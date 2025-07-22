// backend/jobs/notificationScheduler.js
const cron = require('node-cron');
const nodemailer = require('nodemailer');
const Habit = require('../models/habitModel');

// Configuration du transporteur d'e-mail (on le met ici car seul ce job en a besoin)
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

const startNotificationScheduler = () => {
    // S'exécute toutes les minutes
    cron.schedule('* * * * *', async () => {
        const now = new Date();
        // On regarde 10 minutes dans le futur
        const reminderTimeStart = new Date(now.getTime() + 10 * 60 * 1000);
        const reminderTimeEnd = new Date(now.getTime() + 11 * 60 * 1000); // Pour créer une fenêtre de 1 minute

        try {
            // Trouve les tâches :
            // 1. Qui demandent une notification (notify: true)
            // 2. Qui sont toujours en attente (status: 'pending')
            // 3. Dont l'échéance est exactement dans 10-11 minutes
            const habitsToRemind = await Habit.find({
                notify: true,
                status: 'pending',
                dateTime: {
                    $gte: reminderTimeStart, // Greater than or equal to (dans 10 min)
                    $lt: reminderTimeEnd,   // Less than (avant 11 min)
                }
            }).populate('user'); // .populate('user') récupère les infos de l'utilisateur lié

            if (habitsToRemind.length > 0) {
                console.log(`[NOTIF] Envoi de ${habitsToRemind.length} rappels...`);
                habitsToRemind.forEach(habit => {
                    const mailOptions = {
                        from: process.env.EMAIL_USER,
                        to: habit.user.email,
                        subject: `Rappel : Votre tâche "${habit.name}" fini bientôt !`,
                        text: `Bonjour ${habit.user.name},\n\nN'oubliez pas de faire votre tâche : "${habit.name}", qui fini bientôt.\n\nBon courage !\nL'équipe TaskManager.`
                    };

                    transporter.sendMail(mailOptions, (error, info) => {
                        if (error) {
                            console.error(`[NOTIF] Erreur d'envoi à ${habit.user.email}:`, error);
                        } else {
                            console.log(`[NOTIF] Réponse du serveur Gmail: ${info.response}`);
                        }
                    });
                });
            }
        } catch (error) {
            console.error('[NOTIF] Erreur dans le scheduler de notifications:', error);
        }
    });
};

module.exports = startNotificationScheduler;
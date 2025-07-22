// backend/jobs/statusUpdater.js
const cron = require('node-cron');
const nodemailer = require('nodemailer');
const Habit = require('../models/habitModel');

// On a aussi besoin de la config email ici
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

const startStatusUpdater = () => {
    // S'exécute toutes les minutes
    cron.schedule('* * * * *', async () => {
        const now = new Date();

        try {
            // 1. On trouve d'abord les tâches à marquer comme manquées
            const missedHabits = await Habit.find({
                dateTime: { $lt: now },
                status: 'pending'
            }).populate('user');

            if (missedHabits.length > 0) {
                console.log(`[STATUS] ${missedHabits.length} tâche(s) à marquer comme manquée(s).`);

                // 2. On envoie les notifications d'échec
                missedHabits.forEach(habit => {
                    if (habit.notify) { // On n'envoie que si l'utilisateur l'a demandé
                         const mailOptions = {
                            from: process.env.EMAIL_USER,
                            to: habit.user.email,
                            subject: `Tâche manquée : "${habit.name}"`,
                            text: `Bonjour ${habit.user.name},\n\nLa tâche "${habit.name}" dont l'échéance était passée est maintenant marquée comme manquée.\n\nVous pouvez la reprogrammer si nécessaire.\nL'équipe TaskManager.`
                        };
                         try {
                              transporter.sendMail(mailOptions);
                              } catch (emailError) {
                              console.log(`[NOTIF] Réponse du serveur Gmail: ${info.response}`);
                             }
                    }
                });

                // 3. On met à jour leur statut en base de données
                const idsToUpdate = missedHabits.map(h => h._id);
                await Habit.updateMany(
                    { _id: { $in: idsToUpdate } },
                    { $set: { status: 'missed' } }
                );
            }
        } catch (error) {
            console.error('[STATUS] Erreur:', error);
        }
    });
};

module.exports = startStatusUpdater;
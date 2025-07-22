// backend/controllers/habitController.js
const asyncHandler = require('express-async-handler');
const Habit = require('../models/habitModel');

// @desc    Obtenir les habitudes de l'utilisateur
// @route   GET /api/habits
// @access  Privé
const getHabits = asyncHandler (async (req, res) => {
  // req.user est disponible grâce à notre middleware `protect`
  const habits = await Habit.find({ user: req.user.id }).sort({ dateTime: 1 });
  res.status(200).json(habits);
});

// @desc    Créer une nouvelle habitude
// @route   POST /api/habits
// @access  Privé
const createHabit = asyncHandler(async (req, res) => {
  const { name, dateTime, notify } = req.body;
  

  if (!name || !dateTime ) {
    res.status(400);
     throw new Error("Veuillez fournir un nom et une date/heure");
  }

  const habit = await Habit.create({name, 
    dateTime, 
     notify: notify || false,
     user: req.user.id, // le statut 'pending' est ajouté par défaut par le modèle
  });

  res.status(201).json(habit);
});

// @desc    Mettre à jour le statut d'une habitude
// @route   PUT /api/habits/:id
// @access  Privé
const updateHabitStatus = asyncHandler(async (req, res) => {
    const { status } = req.body; // Le nouveau statut envoyé par le front-end
    const habit = await Habit.findById(req.params.id);

    if (!habit) {
        res.status(400);
        throw new Error("Habitude non trouvée");
    }
    // Vérification de sécurité
    if (habit.user.toString() !== req.user.id) {
        res.status(401);
        throw new Error("Non autorisé");
    }

    // On s'assure que le statut est valide
    if (['pending', 'completed', 'missed'].includes(status)) {
        habit.status = status;
        const updatedHabit = await habit.save();
        res.status(200).json(updatedHabit);
    } else {
        res.status(400);
        throw new Error("Statut invalide");
    }
});

// @desc    Supprimer une habitude
// @route   DELETE /api/habits/:id
// @access  Privé
const deleteHabit = asyncHandler(async (req, res) => {
  const habit = await Habit.findById(req.params.id);

  if (!habit) {
    res.status(400);
    throw new Error("Habitude non trouvée");
  }

  // Vérification de sécurité
  if (habit.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error("Utilisateur non autorisé");
  }

  await habit.deleteOne();
  res.status(200).json({ id: req.params.id });
});

// Exporte toutes les fonctions nécessaires
module.exports = {
  getHabits,
  createHabit,
  updateHabitStatus,
  deleteHabit,
};
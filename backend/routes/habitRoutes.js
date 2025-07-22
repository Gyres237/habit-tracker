// backend/routes/habitRoutes.js
const express = require('express');
const router = express.Router();
const { getHabits, createHabit, deleteHabit, updateHabitStatus } = require('../controllers/habitController');
// On importe notre middleware de protection
const { protect } = require('../middleware/authMiddleware');

// On applique le middleware `protect` à toutes les routes de ce fichier
// Une seule ligne pour protéger GET et POST
router.route('/').get(protect, getHabits).post(protect, createHabit);
router.route('/:id').delete(protect, deleteHabit).put(protect, updateHabitStatus);


module.exports = router;
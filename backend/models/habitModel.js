// backend/models/habitModel.js
const mongoose = require('mongoose');

const habitSchema = mongoose.Schema(
  {
    // On lie chaque habitude à un utilisateur. C'est la relation clé.
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User', // Fait référence au modèle 'User'
    },
    name: {
      type: String,
      required: [true, "Veuillez entrer le nom de l'habitude"],
    },
    // NOUVEAU : L'heure de l'habitude
    dateTime: {
      type: Date,
      required: true,
    },
    notify: {
    type: Boolean,
    default: false,
    },
    
  
    // NOUVEAU : Le statut de l'habitude
    status: {
      type: String,
      required: true,
      enum: ['pending', 'completed', 'missed'], // Le statut ne peut être que l'une de ces valeurs
      default: 'pending', // Par défaut, une nouvelle habitude est en attente
    },
  },
  {
    timestamps: true, // Garde automatiquement la date de création/mise à jour
  }
);

module.exports = mongoose.model('Habit', habitSchema);
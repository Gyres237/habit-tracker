// backend/models/userModel.js
const mongoose = require('mongoose');

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Veuillez ajouter un nom'],
    },
    email: {
      type: String,
      required: [true, "Veuillez ajouter un email"],
      unique: true, // Chaque email doit être unique
    },
    password: {
      type: String,
      required: [true, 'Veuillez ajouter un mot de passe'],
    },
    avatarUrl: {
     type: String,
     default: '', // Par défaut, une chaîne vide
    },
  },
  {
    timestamps: true, // Ajoute automatiquement les champs createdAt et updatedAt
  }
);

module.exports = mongoose.model('User', userSchema);

//Explication : On définit un "schéma". C'est un plan qui dit que chaque User doit avoir un name, un email (qui doit être unique) et un password. Tous ces champs sont obligatoires. timestamps: true est une option très pratique qui ajoute automatiquement la date de création et de mise à jour de l'utilisateur.
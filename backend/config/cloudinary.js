// backend/config/cloudinary.js
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// On configure Cloudinary avec les variables d'environnement
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true // On force l'utilisation de HTTPS
});

// On configure le "moteur de stockage" pour multer
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'habit-tracker-avatars', // Le nom du dossier où seront stockées les images sur Cloudinary
    allowed_formats: ['jpeg', 'png', 'jpg'], // On autorise ces formats
    transformation: [{ width: 200, height: 200, crop: 'fill' }] // On redimensionne toutes les images en 200x200
  },
});

// On exporte le middleware multer configuré avec ce moteur de stockage
const upload = multer({ storage: storage });

module.exports = upload;
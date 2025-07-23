// backend/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const { 
    registerUser, 
    loginUser, 
    getMe, 
    updateUserDetails, 
    changeUserPassword 
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const { uploadAvatar } = require('../controllers/userController');
const upload = require('../config/cloudinary');
// Quand une requête POST arrive sur '/', on appelle la fonction registerUser
router.post('/', registerUser);
router.post('/login', loginUser); // Route pour la connexion
// On crée une route GET pour /me et on place le middleware `protect` juste avant le contrôleur `getMe`
router.route('/me').get(protect, getMe).put(protect, updateUserDetails);

router.post('/change-password', protect, changeUserPassword);
router.post('/upload-avatar', protect, upload.single('avatar'), uploadAvatar);

module.exports = router;
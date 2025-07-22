// backend/controllers/userController.js
const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/userModel'); // On importe notre modèle User
const upload = require('../config/cloudinary');

// @desc    Inscrire un nouvel utilisateur
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
    // 1. On récupère les données envoyées dans le corps de la requête
    const { name, email, password } = req.body;

    // 2. Validation : on vérifie que tous les champs sont présents
    if (!name || !email || !password) {
        res.status(400); // 400 = Bad Request
        throw new Error('Veuillez remplir tous les champs');
    }

    // 3. On vérifie si l'utilisateur existe déjà
    const userExists = await User.findOne({ email });
    if (userExists) {
        res.status(400);
        throw new Error('Cet utilisateur existe déjà');
    }

    // 4. Hachage du mot de passe
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 5. Création de l'utilisateur en base de données
    const user = await User.create({
        name,
        email,
        password: hashedPassword,
    });

    // 6. Si l'utilisateur est bien créé, on envoie une réponse de succès
    if (user) {
        res.status(201).json({ // 201 = Created
            _id: user.id,
            name: user.name,
            email: user.email,
            avatarUrl: user.avatarUrl, // <-- VÉRIFIE QUE CETTE LIGNE EST LÀ
            token: generateToken(user._id),
        });
    } else {
        res.status(400);
        throw new Error('Données invalides');
    }
});

// Dans userController.js -> uploadAvatar
const uploadAvatar = asyncHandler(async (req, res) => {
    // 👇 AJOUTE CE LOG DE DÉBOGAGE 👇
   

    const user = await User.findById(req.user.id);
    if (!user) {
        res.status(404);
        throw new Error('Utilisateur non trouvé');
    }

    if (req.file && req.file.path) { // On ajoute une vérification supplémentaire
        user.avatarUrl = req.file.path;
        const updatedUser = await user.save();
        
        // On renvoie l'utilisateur mis à jour (sans le token, comme on avait corrigé)
        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            avatarUrl: updatedUser.avatarUrl,
        });
    } else {
        console.error('Aucun fichier reçu ou chemin manquant dans req.file');
        res.status(400);
        throw new Error("Erreur lors de l'upload de l'image vers le serveur.");
    }
});
// @desc    Connecter un utilisateur
// @route   POST /api/users/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
    // 1. On récupère l'email et le mot de passe du corps de la requête
    const { email, password } = req.body;

    // 2. On cherche l'utilisateur dans la base de données via son email
    const user = await User.findOne({ email });

    // 3. On vérifie si l'utilisateur existe ET si les mots de passe correspondent
    // bcrypt.compare est une fonction qui compare un mot de passe en clair avec un mot de passe haché
    if (user && (await bcrypt.compare(password, user.password))) {
        // Si tout est bon, on renvoie les infos de l'utilisateur avec un token
        res.json({
            _id: user.id,
            name: user.name,
            email: user.email,
            avatarUrl: user.avatarUrl,
            token: generateToken(user._id), // On appelle une fonction pour générer le token
        });
    } else {
        // Si l'utilisateur n'existe pas ou si le mot de passe est incorrect
        res.status(400);
        throw new Error('Email ou mot de passe invalide');
    }
});

// On va créer une petite fonction séparée pour générer le token
// C'est plus propre
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d', // Le token expirera dans 30 jours
    });
};
// @desc    Obtenir les informations de l'utilisateur connecté
// @route   GET /api/users/me
// @access  Privé
const getMe = asyncHandler(async (req, res) => {
    // Grâce à notre middleware `protect`, on a maintenant accès à `req.user`
    res.status(200).json(req.user);
});

const updateUserDetails = asyncHandler(async (req, res) => {
    const { name, email } = req.body;

    // On récupère l'utilisateur depuis la base de données
    const user = await User.findById(req.user.id);

    if (user) {
        user.name = name || user.name; // Met à jour le nom s'il est fourni
        user.email = email || user.email; // Met à jour l'email s'il est fourni

        const updatedUser = await user.save();

        // On renvoie les nouvelles informations avec le token existant
       res.json({ // On renvoie juste les infos, pas besoin de nouveau token
    _id: updatedUser._id,
    name: updatedUser.name,
    email: updatedUser.email,
    avatarUrl: updatedUser.avatarUrl,
});
    } else {
        res.status(404);
        throw new Error('Utilisateur non trouvé');
    }
});

const changeUserPassword = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
        res.status(400);
        throw new Error('Veuillez fournir l\'ancien et le nouveau mot de passe');
    }

    const user = await User.findById(req.user.id);

    // On vérifie si l'ancien mot de passe correspond
    if (user && (await bcrypt.compare(oldPassword, user.password))) {
        // Hacher le nouveau mot de passe
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);

        await user.save();

        res.json({ message: 'Mot de passe changé avec succès' });
    } else {
        res.status(401); // Non autorisé
        throw new Error('Ancien mot de passe incorrect');
    }
});




module.exports = {
    registerUser,
    loginUser,
    getMe,
    updateUserDetails, 
    changeUserPassword,
    uploadAvatar,
};
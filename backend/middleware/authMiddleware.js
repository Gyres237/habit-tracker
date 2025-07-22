// backend/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/userModel.js');

const protect = async (req, res, next) => {
    let token;

    // Le token est généralement envoyé dans les en-têtes (headers) HTTP comme ceci: "Bearer <token>"
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // 1. On récupère le token de l'en-tête
            token = req.headers.authorization.split(' ')[1]; // On sépare "Bearer" et le token

            // 2. On vérifie le token avec notre clé secrète
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // 3. On récupère l'utilisateur depuis la base de données grâce à l'ID qui est dans le token
            // On attache cet utilisateur à l'objet `req` pour qu'il soit disponible dans les routes qui suivent
            req.user = await User.findById(decoded.id).select('-password'); // On exclut le mot de passe

            next(); // Si tout va bien, on passe au prochain middleware ou au contrôleur
        } catch (error) {
            console.error(error);
            res.status(401); // 401 = Non autorisé
            throw new Error('Non autorisé, token invalide');
        }
    }

    if (!token) {
        res.status(401);
        throw new Error('Non autorisé, pas de token');
    }
};

module.exports = { protect };
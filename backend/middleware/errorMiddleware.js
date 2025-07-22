// backend/middleware/errorMiddleware.js

const errorHandler = (err, req, res, next) => {
    // Parfois, même en cas de succès, le statut peut être 200 alors qu'il y a une erreur.
    // On s'assure que si le statut est 200, on le passe à 500 (Erreur serveur).
    const statusCode = res.statusCode ? res.statusCode : 500;

    res.status(statusCode);

    // On renvoie une réponse JSON propre
    res.json({
        message: err.message,
        // On n'affiche la "stack trace" de l'erreur que si on est en mode développement
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
};

module.exports = {
    errorHandler,
};
//Explication : Cette fonction errorHandler prend 4 arguments
//  (c'est ce qui dit à Express que c'est un middleware d'erreur). Elle récupère le statut de l'erreur, 
// le message, et renvoie un bel objet JSON. La stack est la pile d'appels techniques, 
// utile pour déboguer mais qu'on ne veut pas montrer aux utilisateurs en production.
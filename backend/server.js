// backend/server.js

// On importe les outils dont on a besoin
const express = require('express');
const dotenv = require('dotenv');
// On dit à dotenv de charger les variables du fichier .env
dotenv.config();

const connectDB = require('./config/db'); // On importe notre fonction de connexion
const { errorHandler } = require('./middleware/errorMiddleware');
const startStatusUpdater = require('./jobs/statusUpdater');
const startNotificationScheduler = require('./jobs/notificationScheduler');

// On dit à dotenv de charger les variables du fichier .env
dotenv.config();




// On exécute la fonction de connexion à la base de données
connectDB();

const PORT = process.env.PORT || 5000;

// Le reste est comme avant
const app = express();

// Middleware pour accepter les données au format JSON
app.use(express.json());
// Middleware pour accepter les données de formulaires URL-encoded
app.use(express.urlencoded({ extended: false }));


app.get('/', (req, res) => {
  res.send('API is running...');
});
// On dit à notre app d'utiliser le fichier de routes pour toutes les URL qui commencent par /api/users
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/habits', require('./routes/habitRoutes'));

// On place notre gestionnaire d'erreurs ici, après les routes
app.use(errorHandler);


console.log('Démarrage du planificateur de tâches pour les statuts...');
startStatusUpdater();
startNotificationScheduler();

app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});
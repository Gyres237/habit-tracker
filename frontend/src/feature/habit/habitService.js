// frontend/src/feature/habits/habitService.js
import axios from 'axios';

const API_URL = 'https://habit-tracker-api-2v74.onrender.com/api/habits/';

// Créer une nouvelle habitude
const createHabit = async (habitData, token) => {
  const config = { headers: { Authorization: `Bearer ${token}` } };
  const response = await axios.post(API_URL, habitData, config); // Attend {name, time}
  return response.data;
};

// NOUVELLE FONCTION
const updateStatus = async (habitId, status, token) => {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const response = await axios.put(API_URL + habitId, { status }, config);
    return response.data;
};

// Obtenir les habitudes de l'utilisateur
const getHabits = async (token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
     alert(`Appel API vers : GET ${API_URL}`);

    const response = await axios.get(API_URL, config);
    return response.data;
};
const deleteHabit = async (habitId, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
    // On appelle l'URL /api/habits/ suivi de l'ID
    const response = await axios.delete(API_URL + habitId, config);
    return response.data;
};


const habitService = {
  createHabit,
  getHabits,
  deleteHabit,
  updateStatus, // On ajoute la nouvelle fonction ici
};

export default habitService;
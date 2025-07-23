// frontend/src/feature/auth/authService.js
import axios from 'axios';

const API_URL = 'https://habit-tracker-api-2v74.onrender.com/api/users/';


// Inscrire un utilisateur
const register = async (userData) => {
  const response = await axios.post(API_URL, userData);
  if (response.data) {
    localStorage.setItem('user', JSON.stringify(response.data));
  }
  return response.data;
};

// Connecter un utilisateur
const login = async (userData) => {
  const response = await axios.post(API_URL + 'login', userData);
  if (response.data) {
    localStorage.setItem('user', JSON.stringify(response.data));
  }
  return response.data;
};

// NOUVEAU: Mettre à jour les détails de l'utilisateur (nom)
const updateDetails = async (userData, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
    const response = await axios.put(API_URL + 'me', userData, config);

    // On met aussi à jour le localStorage avec les nouvelles informations
     if (response.data) {
        // 1. On récupère l'utilisateur actuel depuis localStorage
        const oldUser = JSON.parse(localStorage.getItem('user'));
        // 2. On fusionne l'ancien utilisateur (qui a le token) avec les nouvelles données
        const newUser = { ...oldUser, ...response.data };
        // 3. On sauvegarde le nouvel objet complet
        localStorage.setItem('user', JSON.stringify(newUser));
        // 4. On retourne l'objet complet
        return newUser;
    }
    return response.data;
};

// NOUVEAU: Changer le mot de passe
const changePassword = async (passwordData, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
      alert(`Appel API vers : PUT ${API_URL}change-password`);
    const response = await axios.put(API_URL + 'change-password', passwordData, config);
    return response.data;
};

const uploadAvatar = async (formData, token) => {
    const config = {
        headers: {
            'Content-Type': 'multipart/form-data', // Important pour l'envoi de fichiers
            Authorization: `Bearer ${token}`,
        },
    };
    const response = await axios.post(API_URL + 'upload-avatar', formData, config);

    // Mettre à jour le localStorage avec les nouvelles infos (incluant l'avatarUrl)
    if (response.data) {
        const oldUser = JSON.parse(localStorage.getItem('user'));
        const newUser = { ...oldUser, ...response.data };
        localStorage.setItem('user', JSON.stringify(newUser));
        return newUser;
    }
    return response.data;
};


const authService = {
  register,
  login,
  updateDetails,  
  uploadAvatar,
};

export default authService;
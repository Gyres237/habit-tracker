// frontend/src/features/auth/authContext.js
import { createContext, useState, useEffect, useContext } from 'react';
import authService from './authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // On essaie de récupérer l'utilisateur depuis le localStorage au chargement de l'app
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('user'));
    } catch (error) {
      return null;
    }
  });

  const login = async (userData) => {
    const loggedInUser = await authService.login(userData);
    setUser(loggedInUser);
  };

  const register = async (userData) => {
    const registeredUser = await authService.register(userData);
    setUser(registeredUser);
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  

  return (
     <AuthContext.Provider value={{ user, setUser, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook personnalisé pour utiliser facilement notre contexte
export const useAuth = () => {
  return useContext(AuthContext);
};
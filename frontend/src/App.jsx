// frontend/src/App.jsx
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'; // 1. Importer Navigate
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AddHabitPage from './pages/AddHabitPage'; 
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import CalendarPage from './pages/CalendarPage';
import StatsPage from './pages/StatsPage';
import SettingsPage from './pages/SettingsPage';
// On va bientôt créer cette page
// import AddHabitPage from './pages/AddHabitPage';

function App() {
  const [theme, setTheme] = useState('light');

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
  };

  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  return (
    <>
      <Router>
        <Header toggleTheme={toggleTheme} currentTheme={theme} />
        <main className="container">
          <Routes>
            {/* --- ROUTES PUBLIQUES --- */}
            <Route path="/add-habit" element={<AddHabitPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* --- ROUTES PRIVÉES (on ajoutera la protection plus tard si besoin) --- */}
            
            {/* 2. La route racine redirige maintenant vers le dashboard */}
            <Route path='/' element={<Navigate to='/dashboard' />} />

            {/* 3. Le Dashboard a maintenant des routes dynamiques */}
            <Route path='/dashboard' element={<Dashboard />} />
            <Route path='/dashboard/:date' element={<Dashboard />} /> 
            
            <Route path="/calendar" element={<CalendarPage />} />
            <Route path="/stats" element={<StatsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            {/* <Route path="/add-habit" element={<AddHabitPage />} /> */}

          </Routes>
        </main>
      </Router>
        <ToastContainer theme={theme} position="bottom-center" />
    </>
  );
}

export default App;
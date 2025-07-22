// frontend/src/components/Header.jsx
import { useState, useEffect, useRef } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../feature/auth/authContext.jsx';
import { FaMoon, FaSun, FaPlus, FaBars, FaTimes } from 'react-icons/fa';

function Header({ toggleTheme, currentTheme }) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      // On vérifie que le clic n'est pas sur le bouton du menu non plus
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };
    if (isUserMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isUserMenuOpen]);

  // Ferme tous les menus au clic sur un lien et gère la déconnexion
  const onLogout = () => {
    logout();
    closeAllMenus();
    navigate('/login');
  };

  const closeAllMenus = () => {
    setIsUserMenuOpen(false);
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="header">
      <div className="header-left">
        <div className="logo">
          <Link to="/dashboard" onClick={closeAllMenus}>HabitTracker</Link>
        </div>
        {/* Navigation pour grand écran */}
        {user && (
          <nav className="main-nav">
            <NavLink to="/dashboard">Dashboard</NavLink>
            <NavLink to="/calendar">Calendrier</NavLink>
            <NavLink to="/stats">Statistiques</NavLink>
          </nav>
        )}
      </div>

      <div className="header-right">
        <button className="btn-theme" onClick={toggleTheme}>
          {currentTheme === 'light' ? <FaMoon /> : <FaSun />}
        </button>

        {user ? (
          <>
            {/* Actions pour grand écran */}
            <div className="desktop-actions">
              <Link to="/add-habit" className="btn btn-add-habit">
                <FaPlus /> Ajouter
              </Link>
              <div className="user-menu" ref={menuRef}>
                <button onClick={() => setIsUserMenuOpen(!isUserMenuOpen)} className="user-menu-btn">
                  {user?.avatarUrl ? (
                    <img src={user.avatarUrl} alt="Avatar" className="header-avatar" />
                  ) : (
                    user?.name?.charAt(0).toUpperCase() || '?'
                  )}
                </button>
                {isUserMenuOpen && (
                  <div className="dropdown-menu">
                    <Link to="/settings" onClick={closeAllMenus}>Paramètres</Link>
                    <button onClick={onLogout}>Déconnexion</button>
                  </div>
                )}
              </div>
            </div>
            
            {/* Bouton Hamburger pour petit écran */}
            <button className="mobile-menu-toggle" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
            </button>
          </>
        ) : (
          <div className="guest-menu">
            <Link to="/login" className="btn btn-secondary">Connexion</Link>
            <Link to="/register" className="btn">Inscription</Link>
          </div>
        )}
      </div>

      {/* Le Menu Mobile qui s'affiche en superposition */}
      {isMobileMenuOpen && user && (
        <nav className="mobile-nav">
          <NavLink to="/dashboard" onClick={closeAllMenus}>Dashboard</NavLink>
          <NavLink to="/calendar" onClick={closeAllMenus}>Calendrier</NavLink>
          <NavLink to="/stats" onClick={closeAllMenus}>Statistiques</NavLink>
          <NavLink to="/settings" onClick={closeAllMenus}>Paramètres</NavLink>
          <div className="mobile-nav-actions">
            <Link to="/add-habit" className="btn" onClick={closeAllMenus}><FaPlus /> Ajouter une habitude</Link>
            <button onClick={onLogout} className="btn btn-secondary">Déconnexion</button>
          </div>
        </nav>
      )}
    </header>
  );
}

export default Header;
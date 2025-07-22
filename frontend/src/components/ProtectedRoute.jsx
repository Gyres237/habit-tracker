// frontend/src/components/ProtectedRoute.jsx
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../feature/auth/authContext.jsx';

function ProtectedRoute() {
  const { user } = useAuth();

  if (!user) {
    // Si l'utilisateur n'est pas connecté, on le redirige vers la page de connexion
    return <Navigate to="/login" replace />;
  }

  // Si l'utilisateur est connecté, on affiche le contenu de la page demandée
  // <Outlet /> est un placeholder pour le composant enfant (ex: <Dashboard />)
  return <Outlet />;
}

export default ProtectedRoute;
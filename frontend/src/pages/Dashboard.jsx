// frontend/src/pages/Dashboard.jsx
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../feature/auth/authContext.jsx';
import habitService from '../feature/habit/habitService.js';
import { FaEllipsisV } from 'react-icons/fa';
import Spinner from '../components/Spinner';
import { getIconForHabit } from '../config/icons.js';

// Helper pour formater une date en YYYY-MM-DD (fiable)
const toYYYYMMDD = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

function Dashboard() {
  const { date: dateFromUrl } = useParams(); // Lit la date depuis l'URL
  const { user } = useAuth();
  
  const [allHabits, setAllHabits] = useState([]); // Stocke TOUTES les habitudes
  const [isLoading, setIsLoading] = useState(true);
  const [activeMenu, setActiveMenu] = useState(null);

  // Détermine la date à afficher (depuis l'URL ou aujourd'hui par défaut)
  const displayDate = dateFromUrl ? new Date(dateFromUrl) : new Date();
  const displayDateString = toYYYYMMDD(displayDate);

  // Détermine si on peut ajouter une habitude (si la date est présente ou future)
  const isTodayOrFuture = toYYYYMMDD(displayDate) >= toYYYYMMDD(new Date());
   const habitsForDisplayDate = allHabits.filter(
    (habit) => toYYYYMMDD(habit.dateTime) === displayDateString
  );

 const handleStatusChange = async (habitId, status) => {
    try {
      const updatedHabit = await habitService.updateStatus(habitId, status, user.token);
      const updatedList = allHabits.map(h => (h._id === habitId ? updatedHabit : h));
      setAllHabits(updatedList.sort((a, b) => new Date(a.dateTime) - new Date(b.dateTime)));
      setActiveMenu(null);
    } catch (error) { console.error("Erreur de mise à jour", error); }
  };

  // Récupère les habitudes
  useEffect(() => {
    async function fetchHabits() {
      setIsLoading(true);
      if (user) {
        
        try {
          const userHabits = await habitService.getHabits(user.token);
          // On trie les habitudes dès la récupération
          const sortedHabits = userHabits.sort((a, b) => new Date(a.dateTime) - new Date(b.dateTime));
          setAllHabits(sortedHabits);
        } catch (error) {
          console.error("Erreur", error);
        }
      } else {
        setAllHabits([]);
      }
      setIsLoading(false);
    }
    fetchHabits();
  }, [user]);

  useEffect(() => {
     if (!user || habitsForDisplayDate.length === 0) return; // Si pas d'utilisateur, on ne fait rien

    // On lance un minuteur qui s'exécutera toutes les 60 secondes
    const interval = setInterval(() => {
      const now = new Date();
      
      habitsForDisplayDate.forEach(habit => {
        const habitTime = new Date(habit.dateTime);
  if (toYYYYMMDD(habitTime) === toYYYYMMDD(now)) {

          // 👇 LA NOUVELLE LOGIQUE EST ICI 👇
          // L'habitude est "manquée" si :
          // 1. Elle est toujours 'pending'.
          // 2. L'heure actuelle est passée OU la minute actuelle est passée.
          if (
            habit.status === 'pending' &&
            (now.getHours() > habitTime.getHours() || 
             (now.getHours() === habitTime.getHours() && now.getMinutes() > habitTime.getMinutes()))
          ) {
            handleStatusChange(habit._id, 'missed');
          }
        }
      });
    }, 10000); 

    // Fonction de nettoyage : TRÈS IMPORTANT
    // On arrête le minuteur quand le composant est "détruit" (ex: on change de page)
    // pour éviter les fuites de mémoire.
    return () => clearInterval(interval);
    
  }, [habitsForDisplayDate, user,  handleStatusChange]);

  // Filtre les habitudes pour n'afficher que celles du jour concerné
 

  // Gère les actions sur les habitudes
 

  const handleDelete = async (habitId) => {
    try {
      await habitService.deleteHabit(habitId, user.token);
      setAllHabits(allHabits.filter((habit) => habit._id !== habitId));
    } catch (error) { console.error("Erreur de suppression", error); }
  };
  
  const getStatusBadge = (status) => {
    switch (status) {
      case 'completed': return <span className="badge success">Succès</span>;
      case 'missed': return <span className="badge missed">Manqué</span>;
      default: return null;
    }
  };

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <>
      <section className="heading">
        <h1>Habitudes pour le {displayDate.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}</h1>
      </section>

      {/* Le bouton "Ajouter" n'apparaît que si on est connecté et sur une date valide */}
      {user && isTodayOrFuture && (
        <div className="add-habit-prompt">
          <Link to="/add-habit" className="btn">Ajouter une habitude</Link>
        </div>
      )}

      <section className="content">
        <div className="habits-list">
          {user ? (
            habitsForDisplayDate.length > 0 ? (
              habitsForDisplayDate.map((habit) => {
                const IconComponent = getIconForHabit(habit.name);
                const formattedTime = new Date(habit.dateTime).toLocaleTimeString('fr-FR', {
                  hour: '2-digit',
                  minute: '2-digit',
                });

                return (
                  <div key={habit._id} className="habit-item">
                    <div className="habit-icon"><IconComponent /></div>
                    <div className="habit-details">
                      <span className="habit-time">{formattedTime}</span>
                      <span className="habit-name">{habit.name}</span>
                    </div>
                    <div className="habit-status">{getStatusBadge(habit.status)}</div>
                    <div className="habit-menu">
                      <button onClick={() => setActiveMenu(activeMenu === habit._id ? null : habit._id)} className="menu-btn"  disabled={habit.status !== 'pending'}><FaEllipsisV /></button>
                      {activeMenu === habit._id && (
                        <div className="dropdown-menu">
                          <button onClick={() => handleStatusChange(habit._id, 'completed')}>Accompli</button>
                          <button onClick={() => handleDelete(habit._id)} className="danger">Supprimer</button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <h3>Aucune habitude prévue pour ce jour.</h3>
            )
          ) : (
            // Exemples pour les visiteurs
            <>
              <div className="habit-item">
                <div className="habit-details">
                  <span className="habit-time">07:00</span>
                  <span className="habit-name">Faire son lit</span>
                </div>
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
}

export default Dashboard;
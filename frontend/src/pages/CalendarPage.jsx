// frontend/src/pages/CalendarPage.jsx
import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { useAuth } from '../feature/auth/authContext.jsx';
import habitService from '../feature/habit/habitService.js';
import Spinner from '../components/Spinner';

// Helper pour formater une date en YYYY-MM-DD
const toYYYYMMDD = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

function CalendarPage() {
  const [value, setValue] = useState(new Date());
  const navigate = useNavigate();
  const { user } = useAuth();
  const [allHabits, setAllHabits] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Récupère TOUTES les habitudes de l'utilisateur
  useEffect(() => {
    async function fetchHabits() {
      if (!user) {
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      try {
        const userHabits = await habitService.getHabits(user.token);
        setAllHabits(userHabits);
      } catch (error) {
        console.error("Erreur de récupération des habitudes", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchHabits();
  }, [user]);

  // NOUVEAU: Traite les données pour compter chaque statut (completed, missed, pending)
  const dailyData = useMemo(() => {
    const data = {};
    allHabits.forEach(habit => {
      const habitDate = toYYYYMMDD(habit.dateTime);
      if (!data[habitDate]) {
        data[habitDate] = { total: 0, completed: 0, missed: 0, pending: 0 };
      }
      data[habitDate].total += 1;
      if (habit.status === 'completed') data[habitDate].completed += 1;
      if (habit.status === 'missed') data[habitDate].missed += 1;
      if (habit.status === 'pending') data[habitDate].pending += 1;
    });
    return data;
  }, [allHabits]);

  // Gère le clic sur un jour pour rediriger
  const handleDayClick = (clickedDate) => {
    const dateString = toYYYYMMDD(clickedDate);
    navigate(`/dashboard/${dateString}`);
  };

  // NOUVEAU: La logique de coloration mise à jour
  const getTileClassName = ({ date, view }) => {
    if (view === 'month') {
      const dateString = toYYYYMMDD(date);
      const dayData = dailyData[dateString];

      if (dayData && dayData.total > 0) {
        if (dayData.completed === dayData.total) return 'day-perfect';
        if (dayData.missed > 0 && dayData.completed === 0) return 'day-failed';
        if (dayData.completed > 0) return 'day-in-progress';
        if (dayData.pending === dayData.total) return 'day-pending';
      }
    }
    return null;
  };

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div>
      <section className="heading">
        <h1>Calendrier d'Habitudes</h1>
        <p>Visualisez vos progrès au fil du temps</p>
      </section>

      <div className="calendar-container">
        <Calendar
          onChange={setValue}
          value={value}
          onClickDay={handleDayClick}
          tileClassName={getTileClassName}
        />
      </div>

      {/* NOUVEAU: La légende mise à jour */}
      <div className="legend-container">
        <div className="legend-item"><span className="legend-color day-perfect"></span> Parfait</div>
        <div className="legend-item"><span className="legend-color day-in-progress"></span> En Progrès</div>
        <div className="legend-item"><span className="legend-color day-pending"></span> En Attente</div>
        <div className="legend-item"><span className="legend-color day-failed"></span> Manqué</div>
      </div>
    </div>
  );
}

export default CalendarPage;
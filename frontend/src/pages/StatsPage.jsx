// frontend/src/pages/StatsPage.jsx
import { useState, useEffect, useMemo } from 'react'; 
import { useAuth } from '../feature/auth/authContext.jsx';
import habitService from '../feature/habit/habitService.js';
import Spinner from '../components/Spinner';
import PieChart from '../components/PieChart';
import BarChart from '../components/BarChart';

function StatsPage() {
  const { user } = useAuth();
  const [allHabits, setAllHabits] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [timeFilter, setTimeFilter] = useState('all');

  // Récupère toutes les habitudes
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
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchHabits();
  }, [user]);

  // 1. CORRECTION: On filtre d'abord, PUIS on calcule
  const filteredHabits = useMemo(() => {
    const now = new Date();
    if (timeFilter === 'all') {
      return allHabits;
    }
    const days = timeFilter === '7days' ? 7 : 30;
    const cutoffDate = new Date();
    cutoffDate.setDate(now.getDate() - days);
    return allHabits.filter(habit => new Date(habit.dateTime) >= cutoffDate);
  }, [allHabits, timeFilter]);

  // 2. CORRECTION: Tous les calculs utilisent `filteredHabits`
  const keyStats = useMemo(() => {
    if (filteredHabits.length === 0) {
      return { totalCompleted: 0, totalPending: 0, totalMissed: 0, overallSuccessRate: 0 };
    }
    const completed = filteredHabits.filter(h => h.status === 'completed').length;
    const pending = filteredHabits.filter(h => h.status === 'pending').length;
    const missed = filteredHabits.filter(h => h.status === 'missed').length;
    const totalRated = completed + missed;
    const successRate = totalRated > 0 ? Math.round((completed / totalRated) * 100) : 0;
    return { totalCompleted: completed, totalPending: pending, totalMissed: missed, overallSuccessRate: successRate };
  }, [filteredHabits]);

  const pieChartData = useMemo(() => {
    // On utilise directement les chiffres déjà calculés
    const { totalCompleted, totalMissed, totalPending } = keyStats;
    return {
      labels: ['Accompli', 'Manqué', 'En attente'],
      datasets: [{
        label: 'Statut des habitudes',
        data: [totalCompleted, totalMissed, totalPending],
        backgroundColor: ['rgba(75, 192, 192, 0.6)', 'rgba(255, 99, 132, 0.6)', 'rgba(255, 206, 86, 0.6)'],
        borderColor: ['rgba(75, 192, 192, 1)', 'rgba(255, 99, 132, 1)', 'rgba(255, 206, 86, 1)'],
        borderWidth: 1,
      }],
    };
  }, [keyStats]);

  const barChartData = useMemo(() => {
    const habitsByName = {};
    filteredHabits.forEach(habit => {
      if (!habitsByName[habit.name]) habitsByName[habit.name] = { total: 0, completed: 0 };
      habitsByName[habit.name].total += 1;
      if (habit.status === 'completed') habitsByName[habit.name].completed += 1;
    });
    const labels = Object.keys(habitsByName);
    const data = labels.map(label => {
      const { total, completed } = habitsByName[label];
      return total > 0 ? (completed / total) * 100 : 0;
    });
    return {
      labels,
      datasets: [{
        label: 'Taux de réussite (%)',
        data,
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      }],
    };
  }, [filteredHabits]);

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div>
      <section className="heading">
        <h1>Statistiques</h1>
        <p>Votre performance en un coup d'œil</p>
      </section>
      
      {/* 3. CORRECTION: Les filtres sont toujours visibles */}
      <div className="time-filter">
        <button className={timeFilter === '7days' ? 'active' : ''} onClick={() => setTimeFilter('7days')}>7 derniers jours</button>
        <button className={timeFilter === '30days' ? 'active' : ''} onClick={() => setTimeFilter('30days')}>30 derniers jours</button>
        <button className={timeFilter === 'all' ? 'active' : ''} onClick={() => setTimeFilter('all')}>Toujours</button>
      </div>
      
      {/* 4. CORRECTION: On affiche les stats seulement si on a des données filtrées */}
      {filteredHabits.length > 0 ? (
        <>
          <div className="key-stats-container">
            <div className="stat-card key-stat"><h3>Taux de Réussite</h3><p className="stat-value">{keyStats.overallSuccessRate}%</p></div>
            <div className="stat-card key-stat"><h3>Total Accompli</h3><p className="stat-value">{keyStats.totalCompleted}</p></div>
            <div className="stat-card key-stat"><h3>Total en Attente</h3><p className="stat-value">{keyStats.totalPending}</p></div>
            <div className="stat-card key-stat"><h3>Total Manqué</h3><p className="stat-value">{keyStats.totalMissed}</p></div>
          </div>
          <div className="stats-container">
            <div className="stat-card"><h2>Répartition des Statuts</h2><div style={{ height: '300px' }}><PieChart chartData={pieChartData} /></div></div>
            <div className="stat-card"><h2>Performance par Habitude (%)</h2><div style={{ height: '300px' }}><BarChart chartData={barChartData} /></div></div>
          </div>
        </>
      ) : (
        <p style={{ textAlign: 'center' }}>Aucune donnée à afficher pour cette période.</p>
      )}
    </div>
  );
}

export default StatsPage;
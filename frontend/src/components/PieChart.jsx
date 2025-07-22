// frontend/src/components/PieChart.jsx
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

// On doit enregistrer les modules de Chart.js qu'on va utiliser
ChartJS.register(ArcElement, Tooltip, Legend);

function PieChart({ chartData }) {
  const options = {
    plugins: {
      legend: {
        position: 'top', // Position de la légende
      },
      title: {
        display: false, // On a déjà un titre dans la carte
      },
    },
    maintainAspectRatio: false, // Permet de mieux gérer la taille
  };
  
  return <Pie data={chartData} options={options} />;
}

export default PieChart;
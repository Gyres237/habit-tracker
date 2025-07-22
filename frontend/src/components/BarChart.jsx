// frontend/src/components/BarChart.jsx
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Enregistrer les modules nécessaires pour un graphique en barres
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function BarChart({ chartData }) {
  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false, // On n'a pas besoin de légende pour un seul set de données
      },
    },
    maintainAspectRatio: false,
    scales: { // Pour l'axe Y
      y: {
        beginAtZero: true, // Commence à 0
        ticks: {
          callback: function(value) {
            return value + '%' // Ajoute le symbole %
          }
        },
        max: 100, // L'axe va jusqu'à 100%
      }
    }
  };

  return <Bar options={options} data={chartData} />;
}

export default BarChart;
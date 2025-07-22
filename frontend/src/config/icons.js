import { FaAppleAlt, FaBed, FaBook, FaDumbbell, FaTasks, FaDollarSign, FaRunning, FaBrain } from 'react-icons/fa';

export const habitIcons = {
  FaDumbbell: { component: FaDumbbell, keywords: ['sport', 'muscu', 'gym', 'pompes', 'fitness'] },
  FaRunning: { component: FaRunning, keywords: ['courir', 'course', 'running', 'cardio'] },
  FaBook: { component: FaBook, keywords: ['lire', 'lecture', 'livre', 'étudier'] },
  FaBrain: { component: FaBrain, keywords: ['méditer', 'méditation', 'penser', 'calme'] },
  FaAppleAlt: { component: FaAppleAlt, keywords: ['manger', 'nourriture', 'repas', 'salade'] },
  FaBed: { component: FaBed, keywords: ['dormir', 'coucher', 'lit', 'sieste'] },
  FaDollarSign: { component: FaDollarSign, keywords: ['argent', 'économie', 'budget', 'dépense'] },
  FaTasks: { component: FaTasks, keywords: [] }, // Icône par défaut
};

export const getIconForHabit = (habitName) => {
  const nameLower = habitName.toLowerCase();

  // On cherche la première icône dont un mot-clé est trouvé dans le nom de l'habitude
  for (const iconKey in habitIcons) {
    const hasKeyword = habitIcons[iconKey].keywords.some(keyword => nameLower.includes(keyword));
    if (hasKeyword) {
      return habitIcons[iconKey].component;
    }
  }

  // Si aucun mot-clé n'est trouvé, on renvoie l'icône par défaut
  return habitIcons.FaTasks.component;
};

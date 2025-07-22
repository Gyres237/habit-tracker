// frontend/src/pages/AddHabitPage.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../feature/auth/authContext.jsx';
import habitService from '../feature/habit/habitService.js';
import { toast } from 'react-toastify';
import { FaBell } from 'react-icons/fa';

// Helper pour obtenir la date actuelle au format YYYY-MM-DDTHH:MM
const getNowString = () => {
  const now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset()); // Ajuste pour le fuseau horaire local
  return now.toISOString().slice(0, 16);
};

function AddHabitPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    dateTime: getNowString(),
    notify: false, // Notre nouveau champ pour la notification
  });
  const { name, dateTime, notify } = formData;

  const onChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: value,
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
     const utcDateTime = new Date(dateTime).toISOString();
    try {
      await habitService.createHabit({ name, dateTime: utcDateTime, notify }, user.token);
      toast.success('Habitude ajoutée avec succès !');
      navigate('/dashboard');
    } catch (error) {
      toast.error("Erreur lors de l'ajout de l'habitude.");
      console.error(error);
    }
  };

  return (
    <>
      <section className="heading">
        <h1>Ajouter une Nouvelle Habitude</h1>
        <p>Planifiez une nouvelle habitude à suivre.</p>
      </section>

      <section className="form">
        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label htmlFor="name">Nom de l'habitude</label>
            <input type="text" name="name" value={name} onChange={onChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="dateTime">Date et Heure De Fin</label>
            <input
              type="datetime-local"
              name="dateTime"
              value={dateTime}
              onChange={onChange}
              min={getNowString()} // Empêche de sélectionner une date passée
              required
            />
          </div>
          <div className="form-group-checkbox">
            <input
              type="checkbox"
              name="notify"
              id="notify"
              checked={notify}
              onChange={onChange}
            />
            <label htmlFor="notify">
              <FaBell /> Me notifier
            </label>
          </div>
          <div className="form-group">
            <button type="submit" className="btn btn-block">
              Enregistrer l'habitude
            </button>
          </div>
        </form>
      </section>
    </>
  );
}

export default AddHabitPage;
// frontend/src/components/settings/AccountSettings.jsx
import { useState } from 'react';
import { useAuth } from '../../feature/auth/authContext.jsx';
import authService from '../../feature/auth/authService.js';
import { toast } from 'react-toastify';

function AccountSettings() {
  const { user } = useAuth();
  const [passwordData, setPasswordData] = useState({
    oldPassword: '', newPassword: '', confirmPassword: '',
  });

  const handlePasswordChange = (e) => {
    setPasswordData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const onPasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Les nouveaux mots de passe ne correspondent pas.');
      return;
    }
    try {
      await authService.changePassword(
        { oldPassword: passwordData.oldPassword, newPassword: passwordData.newPassword },
        user.token
      );
      toast.success('Mot de passe changé avec succès !');
      setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      const message = error.response?.data?.message || 'Une erreur est survenue.';
      toast.error(message);
    }
  };

  return (
    <div className="settings-card">
      <h2>Changer mon mot de passe</h2>
      <form onSubmit={onPasswordSubmit}>
        <div className="form-group">
          <label htmlFor="oldPassword">Mot de passe actuel</label>
          <input type="password" name="oldPassword" value={passwordData.oldPassword} onChange={handlePasswordChange} required/>
        </div>
        <div className="form-group">
          <label htmlFor="newPassword">Nouveau mot de passe</label>
          <input type="password" name="newPassword" value={passwordData.newPassword} onChange={handlePasswordChange} required/>
        </div>
        <div className="form-group">
          <label htmlFor="confirmPassword">Confirmer le nouveau mot de passe</label>
          <input type="password" name="confirmPassword" value={passwordData.confirmPassword} onChange={handlePasswordChange} required/>
        </div>
        <button type="submit" className="btn">Changer le mot de passe</button>
      </form>
    </div>
  );
}
export default AccountSettings;
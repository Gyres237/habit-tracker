// frontend/src/components/settings/ProfileSettings.jsx
import { useState, useRef } from 'react'; // Importer useRef
import { useAuth } from '../../feature/auth/authContext.jsx';
import authService from '../../feature/auth/authService.js';
import { toast } from 'react-toastify';

function ProfileSettings() {
  const { user, setUser } = useAuth();
  const [detailsData, setDetailsData] = useState({ name: user?.name || '' });

  // 1. Créer une référence pour notre input de fichier caché
  const fileInputRef = useRef(null);

  const handleDetailsChange = (e) => { /* ... (ne change pas) */ };
  const onDetailsSubmit = async (e) => { /* ... (ne change pas) */ };

  // 2. NOUVELLE FONCTION: Gère le changement de fichier
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // On crée un FormData pour envoyer le fichier
    const formData = new FormData();
    formData.append('avatar', file); // 'avatar' doit correspondre au nom attendu par multer

    try {
      const updatedUser = await authService.uploadAvatar(formData, user.token);
      setUser(updatedUser); // Met à jour le contexte global
      toast.success('Avatar mis à jour !');
    } catch (error) {
      toast.error("Erreur lors de l'envoi de l'avatar.");
    }
  };


  return (
    <div className="settings-card">
      <h2>Mon Profil</h2>

      {/* 3. SECTION AVATAR */}
      <div className="avatar-section">
        <img
          src={user?.avatarUrl || `https://ui-avatars.com/api/?name=${user?.name}&background=random`}
          alt="Avatar"
          className="avatar-preview"
        />
        <button className="btn" onClick={() => fileInputRef.current.click()}>
          Changer la photo
        </button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          style={{ display: 'none' }} // L'input est caché
          accept="image/png, image/jpeg, image/jpg" // On n'accepte que les images
        />
      </div>

      <form onSubmit={onDetailsSubmit}>
        {/* ... (tes formulaires pour le nom et l'email ne changent pas) ... */}
      </form>
    </div>
  );
}

// Pour être sûr, voici le code complet du composant
function ProfileSettings_complet() {
    const { user, setUser } = useAuth();
    const [detailsData, setDetailsData] = useState({ name: user?.name || '' });
    const fileInputRef = useRef(null);

    const handleDetailsChange = (e) => {
        setDetailsData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const onDetailsSubmit = async (e) => {
        e.preventDefault();
        try {
            // updatedUser est maintenant l'objet COMPLET (avec le token)
        const updatedUser = await authService.updateDetails({ name: detailsData.name }, user.token);
        // On peut donc simplement appeler setUser avec
        setUser(updatedUser);
        toast.success('Nom mis à jour !');
    } catch (error) { /*...*/ }
};
    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const formData = new FormData();
        formData.append('avatar', file);
        try {
                  // updatedUser est aussi l'objet COMPLET
        const updatedUser = await authService.uploadAvatar(formData, user.token);

        
        setUser(updatedUser);
        toast.success('Avatar mis à jour !');

        } catch (error) { toast.error("Erreur lors de l'envoi de l'avatar."); }
    };

    return (
        <div className="settings-card">
            <h2>Mon Profil</h2>
            <div className="avatar-section">
                <img src={user?.avatarUrl || `https://ui-avatars.com/api/?name=${user?.name}&background=random`} alt="Avatar" className="avatar-preview" />
                <button className="btn" onClick={() => fileInputRef.current.click()}>
                    Changer la photo
                </button>
                <input type="file" ref={fileInputRef} onChange={handleFileChange} style={{ display: 'none' }} accept="image/png, image/jpeg, image/jpg" />
            </div>
            <form onSubmit={onDetailsSubmit}>
                <div className="form-group">
                    <label htmlFor="name">Nom</label>
                    <input type="text" name="name" value={detailsData.name} onChange={handleDetailsChange} />
                </div>
                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input type="email" name="email" value={user?.email || ''} disabled />
                </div>
                <button type="submit" className="btn">Enregistrer le nom</button>
            </form>
        </div>
    );
}

export default ProfileSettings_complet;
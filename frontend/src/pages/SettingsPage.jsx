// frontend/src/pages/SettingsPage.jsx
import { useState } from 'react';
import ProfileSettings from '../components/settings/ProfileSettings';
import AccountSettings from '../components/settings/AccountSettings';

function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile');

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return <ProfileSettings />;
      
      case 'account':
        return <AccountSettings />;
      default:
        return <ProfileSettings />;
    }
  };

  return (
    <>
      <section className="heading">
        <h1>Paramètres</h1>
      </section>

      <div className="settings-container">
        <nav className="settings-nav">
          <button
            className={activeTab === 'profile' ? 'active' : ''}
            onClick={() => setActiveTab('profile')}
          >
            Profil
          </button>
          
          <button
            className={activeTab === 'account' ? 'active' : ''}
            onClick={() => setActiveTab('account')}
          >
            Compte
          </button>
        </nav>
        <div className="settings-content">
          {renderContent()}
        </div>
      </div>
    </>
  );
}

export default SettingsPage;
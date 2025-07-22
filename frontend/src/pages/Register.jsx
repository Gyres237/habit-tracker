// frontend/src/pages/Register.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../feature/auth/authContext.jsx';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { toast } from 'react-toastify';

function Register() {
  
    const [showPassword, setShowPassword] = useState(false);
  // On utilise le hook `useState` pour créer un état pour nos données de formulaire
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password2: '', // Un champ pour confirmer le mot de passe
  });

  // On "déstructure" les variables de formData pour un accès plus facile
  const { name, email, password, password2 } = formData;
  const navigate = useNavigate(); // <-- 2. INITIALISER le hook pour la redirection
  const { register } = useAuth(); // On récupère la fonction `register` du contexte d'authentification


  const onChange = (e) => {
    // Cette fonction met à jour notre état à chaque fois qu'on tape dans un champ
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

   const onSubmit = async (e) => {
  e.preventDefault();

  // 1. Vérifier si les champs sont remplis
  if (!name || !email || !password || !password2) {
    toast.error('Veuillez remplir tous les champs');
    return; // On arrête la fonction ici
  }

  // 2. Vérifier si les mots de passe correspondent
  if (password !== password2) {
    toast.error('Les mots de passe ne correspondent pas');
  } else {
    // 3. Si tout va bien, on prépare les données
    const userData = { name, email, password };

    try {
      // 4. ON APPELLE UNIQUEMENT LA FONCTION DU CONTEXTE
      await register(userData);

      // 5. On affiche un message de succès et on redirige
      toast.success('Inscription réussie !');
      navigate('/');
      
    } catch (error) {
      // 6. En cas d'erreur de l'API, on l'affiche
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      toast.error(message);
    }
  }
};

  return (
    <>
      <section className="heading">
        <h1>Inscription</h1>
        <p>Veuillez créer un compte pour suivre vos habitudes</p>
      </section>

      <section className="form">
        <form onSubmit={onSubmit}>
          <div className="form-group">
            <input
              type="text"
              id="name"
              name="name"
              value={name}
              placeholder="Entrez votre nom"
              onChange={onChange}
            />
          </div>
          <div className="form-group">
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              placeholder="Entrez votre email"
              onChange={onChange}
            />
          </div>
          {/* 3. MODIFIER LE CHAMP PASSWORD */}
          <div className="form-group password-group"> {/* Ajouter une classe */}
            <input
              type={showPassword ? 'text' : 'password'} // Type dynamique
              id="password"
              name="password"
              value={password}
              placeholder="Entrez votre mot de passe"
              onChange={onChange}
            />
            {/* Icône cliquable */}
            <span onClick={() => setShowPassword(!showPassword)} className="password-icon">
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
           {/* 4. MODIFIER LE CHAMP PASSWORD2 (confirmation) */}
          <div className="form-group password-group">
            <input
              type={showPassword ? 'text' : 'password'}
              id="password2"
              name="password2"
              value={password2}
              placeholder="Confirmez votre mot de passe"
              onChange={onChange}
            />
             {/* On peut aussi mettre l'icône ici si on veut, mais une seule suffit souvent */}
             
          </div>
          
          <div className="form-group">
            <button type="submit" className="btn btn-block">
              S'inscrire
            </button>
          </div>
        </form>
      </section>
    </>
  );
}

export default Register;
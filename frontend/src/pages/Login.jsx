// frontend/src/pages/Login.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../feature/auth/authContext.jsx';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

function Login() {
    const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const { email, password } = formData;
  const navigate = useNavigate(); // Le hook pour la redirection
  const { login } = useAuth();

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
     if (!email || !password) {
        toast.error('Veuillez remplir tous les champs');
        return;
    }

    const userData = {
      email,
      password,
    };


    try {
      await login(userData);      // Si la connexion réussit, on redirige vers la page d'accueil
      navigate('/');
    } catch (error) {
 const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      toast.error(message);    }
  };

  return (
    <>
      <section className="heading">
        <h1>Connexion</h1>
        <p>Connectez-vous pour suivre vos habitudes</p>
      </section>

      <section className="form">
        <form onSubmit={onSubmit}>
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

          <div className="form-group">
            <button type="submit" className="btn btn-block">
              Se connecter
            </button>
          </div>
        </form>
      </section>
    </>
  );
}

export default Login;
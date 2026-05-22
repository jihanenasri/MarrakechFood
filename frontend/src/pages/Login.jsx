import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { clientAPI } from '../services/api';

function Login({ setIsAuthenticated, setUserRole }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await clientAPI.login({ email, motDePasse: password });

      localStorage.setItem('clientId', response.data.clientId);
      localStorage.setItem('email', response.data.email);

      let role = 'CLIENT';
      if (email === 'admin@marrakechfood.com') role = 'ADMIN';
      else if (email === 'livreur@marrakechfood.com' || email.includes('livreur')) role = 'LIVREUR';

      localStorage.setItem('role', role);

      if (setIsAuthenticated) setIsAuthenticated(true);
      if (setUserRole) setUserRole(role);

      alert(`Connexion réussie en tant que ${role} !`);

      if (role === 'ADMIN') navigate('/admin/restaurants');
      else if (role === 'LIVREUR') navigate('/livreur/dashboard');
      else navigate('/restaurants');
    } catch (err) {
      setError('Email ou mot de passe incorrect');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-page d-flex align-items-center">
      <div className="container form-shell">
        <div className="premium-card p-4 p-md-5">
          {/* Logo et titre */}
          <div className="text-center mb-4">
            <img 
              src="/images/logo.png" 
              alt="Marrakech Food" 
              style={{ height: '60px', width: 'auto', marginBottom: '10px' }}
              onError={(e) => { e.target.src = 'https://placehold.co/60x60/FF6B35/white?text=MF'; }}
            />
            <h2 className="section-title mb-0" style={{ color: '#FF6B35' }}>Marrakech Food</h2>
            <p className="text-muted small mt-1">DÉCOUVREZ • RÉSERVEZ • SAVOUREZ</p>
          </div>

          {error && <div className="alert alert-danger">{error}</div>}

          <form onSubmit={handleSubmit} className="input-rounded">
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Mot de passe</label>
              <input
                type="password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn orange-btn w-100" disabled={loading}>
              {loading ? 'Connexion...' : 'Se connecter'}
            </button>
          </form>

          <div className="text-center mt-3">
            <small>
              Pas de compte ?{' '}
              <button
                onClick={() => navigate('/register')}
                className="btn btn-link text-decoration-none p-0"
                style={{ color: '#FF6B35' }}
              >
                S'inscrire
              </button>
            </small>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
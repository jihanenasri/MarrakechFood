import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { clientAPI } from '../services/api';

function Register() {
  const [formData, setFormData] = useState({
    nom: '',
    email: '',
    motDePasse: '',
    adresse: '',
    telephone: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await clientAPI.register(formData);
      alert('Inscription réussie ! Vous pouvez vous connecter.');
      navigate('/login');
    } catch (err) {
      setError("Erreur lors de l'inscription. Email peut-être déjà utilisé.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-page d-flex align-items-center">
      <div className="container form-shell">
        <div className="premium-card p-4 p-md-5">
          <h2 className="text-center section-title mb-4" style={{ color: '#FF6B35' }}>Créer un compte</h2>

          {error && <div className="alert alert-danger">{error}</div>}

          <form onSubmit={handleSubmit} className="input-rounded">
            <div className="mb-3">
              <label className="form-label">Nom</label>
              <input name="nom" className="form-control" value={formData.nom} onChange={handleChange} required />
            </div>

            <div className="mb-3">
              <label className="form-label">Email</label>
              <input type="email" name="email" className="form-control" value={formData.email} onChange={handleChange} required />
            </div>

            <div className="mb-3">
              <label className="form-label">Mot de passe</label>
              <input type="password" name="motDePasse" className="form-control" value={formData.motDePasse} onChange={handleChange} required />
            </div>

            <div className="mb-3">
              <label className="form-label">Téléphone</label>
              <input name="telephone" className="form-control" value={formData.telephone} onChange={handleChange} />
            </div>

            <div className="mb-4">
              <label className="form-label">Adresse</label>
              <input name="adresse" className="form-control" value={formData.adresse} onChange={handleChange} />
            </div>

            <button type="submit" className="btn orange-btn w-100" disabled={loading}>
              {loading ? 'Inscription...' : "S'inscrire"}
            </button>
          </form>

          <div className="text-center mt-3">
            <small>
              Déjà un compte ?{' '}
              <button onClick={() => navigate('/login')} className="btn btn-link text-decoration-none p-0" style={{ color: '#FF6B35' }}>
                Se connecter
              </button>
            </small>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
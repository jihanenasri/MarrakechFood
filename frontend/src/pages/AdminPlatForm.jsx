import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { restaurantAPI } from '../services/api';

function AdminPlatForm() {
  const { restaurantId, platId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nom: '',
    description: '',
    prix: '',
    image: ''
  });

  useEffect(() => {
    if (platId) fetchPlat();
  }, [platId]);

  const fetchPlat = async () => {
    try {
      const response = await restaurantAPI.getPlatById(platId);
      setFormData({
        ...response.data,
        image: response.data.image || ''
      });
    } catch (err) {
      alert('Erreur chargement du plat');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (platId) {
        await restaurantAPI.updatePlat(platId, formData);
        alert('Plat modifié !');
      } else {
        await restaurantAPI.createPlat(restaurantId, formData);
        alert('Plat ajouté !');
      }
      navigate(`/restaurant/${restaurantId}`);
    } catch (err) {
      alert('Erreur : vérifie les champs');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-page">
      <div className="container form-shell">
        <div className="premium-card p-4 p-md-5">
          <h2 className="text-center section-title mb-4" style={{ color: '#FF6B35' }}>
            {platId ? '✏️ Modifier un plat' : '➕ Ajouter un plat'}
          </h2>

          <form onSubmit={handleSubmit} className="input-rounded">
            <div className="mb-3">
              <label className="form-label">Nom</label>
              <input name="nom" className="form-control" value={formData.nom} onChange={handleChange} required />
            </div>

            <div className="mb-3">
              <label className="form-label">Description</label>
              <textarea name="description" className="form-control" rows="4" value={formData.description} onChange={handleChange} />
            </div>

            <div className="mb-3">
              <label className="form-label">Prix (DH)</label>
              <input type="number" step="0.5" name="prix" className="form-control" value={formData.prix} onChange={handleChange} required />
            </div>

            <div className="mb-4">
              <label className="form-label">Image du plat</label>
              <input name="image" className="form-control" value={formData.image} onChange={handleChange} placeholder="URL image" />
            </div>

            <button type="submit" disabled={loading} className="btn orange-btn w-100">
              {loading ? 'Enregistrement...' : (platId ? 'Modifier' : 'Ajouter')}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AdminPlatForm;
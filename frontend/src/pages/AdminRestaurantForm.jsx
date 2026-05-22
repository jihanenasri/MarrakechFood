import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { restaurantAPI } from '../services/api';

function AdminRestaurantForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nom: '',
    adresse: '',
    telephone: '',
    typeCuisine: '',
    image: '',
    statut: 'OUVERT'
  });

  useEffect(() => {
    if (id) fetchRestaurant();
  }, [id]);

  const fetchRestaurant = async () => {
    try {
      const response = await restaurantAPI.getById(id);
      setFormData({
        ...response.data,
        image: response.data.image || ''
      });
    } catch (err) {
      alert('Erreur chargement du restaurant');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (id) {
        await restaurantAPI.update(id, formData);
        alert('Restaurant modifié avec succès !');
      } else {
        await restaurantAPI.create(formData);
        alert('Restaurant ajouté avec succès !');
      }
      navigate('/admin/restaurants');
    } catch (err) {
      alert('Erreur : ' + (err.response?.data?.message || 'Vérifie les champs'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-page">
      <div className="container form-shell">
        <div className="premium-card p-4 p-md-5">
          <h2 className="text-center section-title mb-4" style={{ color: '#FF6B35' }}>
            {id ? '✏️ Modifier le restaurant' : '➕ Ajouter un restaurant'}
          </h2>

          <form onSubmit={handleSubmit} className="input-rounded">
            <div className="mb-3">
              <label className="form-label">Nom</label>
              <input name="nom" value={formData.nom} onChange={handleChange} required className="form-control" />
            </div>

            <div className="mb-3">
              <label className="form-label">Adresse</label>
              <input name="adresse" value={formData.adresse} onChange={handleChange} required className="form-control" />
            </div>

            <div className="mb-3">
              <label className="form-label">Téléphone</label>
              <input name="telephone" value={formData.telephone} onChange={handleChange} className="form-control" />
            </div>

            <div className="mb-3">
              <label className="form-label">Type de cuisine</label>
              <input name="typeCuisine" value={formData.typeCuisine} onChange={handleChange} className="form-control" />
            </div>

            <div className="mb-3">
              <label className="form-label">Image du restaurant</label>
              <input name="image" value={formData.image} onChange={handleChange} className="form-control" placeholder="URL image" />
            </div>

            <div className="mb-4">
              <label className="form-label">Statut</label>
              <select name="statut" value={formData.statut} onChange={handleChange} className="form-select">
                <option value="OUVERT">Ouvert</option>
                <option value="FERME">Fermé</option>
              </select>
            </div>

            <button type="submit" disabled={loading} className="btn orange-btn w-100">
              {loading ? 'Enregistrement...' : (id ? 'Modifier' : 'Ajouter')}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AdminRestaurantForm;
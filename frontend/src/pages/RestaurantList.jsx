import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { restaurantAPI } from '../services/api';

function RestaurantList() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const isAdmin = localStorage.getItem('role') === 'ADMIN';

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async () => {
    try {
      const response = await restaurantAPI.getAll();
      setRestaurants(response.data);
    } catch (err) {
      setError('Erreur chargement des restaurants');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, nom) => {
    if (window.confirm(`Supprimer le restaurant "${nom}" ?`)) {
      try {
        await restaurantAPI.delete(id);
        alert('Restaurant supprimé');
        fetchRestaurants();
      } catch (err) {
        alert('Erreur suppression');
      }
    }
  };

  if (loading) return <div className="text-center mt-5">Chargement...</div>;
  if (error) return <div className="text-center mt-5 text-danger">{error}</div>;

  return (
    <div className="app-page">
      <div className="container">
        <div className="hero-banner p-4 p-md-5 mb-4">
          <div className="row align-items-center">
            <div className="col-md-8">
              {/* Logo + titre */}
              <div className="d-flex align-items-center gap-3 mb-2">
                <img 
                  src="/images/logo.png" 
                  alt="Marrakech Food" 
                  style={{ height: '50px', width: 'auto' }}
                  onError={(e) => { e.target.src = 'https://placehold.co/50x50/FF6B35/white?text=MF'; }}
                />
                <div>
                  <h1 className="section-title mb-0" style={{ color: '#FF6B35' }}>Marrakech Food</h1>
                  <p className="small text-muted mb-0">DÉCOUVREZ • RÉSERVEZ • SAVOUREZ</p>
                </div>
              </div>
            </div>
            <div className="col-md-4 text-md-end mt-3 mt-md-0">
              <button onClick={() => navigate('/cart')} className="btn btn-light soft-btn fw-bold">
                🛒 Voir le panier
              </button>
            </div>
          </div>
        </div>

        <div className="row g-4">
          {restaurants.map((restaurant) => (
            <div key={restaurant.id} className="col-md-4">
              <div className="premium-card h-100">
                <img
                  src={restaurant.image || 'https://placehold.co/800x500/FF6B35/white?text=Restaurant'}
                  alt={restaurant.nom}
                  className="food-image"
                  style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                />
                <div className="p-4">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <h4 className="mb-0 section-title" style={{ color: '#FF6B35' }}>
                      {restaurant.nom}
                    </h4>
                    <span className="badge badge-orange rounded-pill">
                      ★ {restaurant.note || '4.5'}
                    </span>
                  </div>

                  <p className="mb-1">📍 {restaurant.adresse}</p>
                  <p className="text-muted mb-3">🍳 {restaurant.typeCuisine || 'Cuisine variée'}</p>

                  <button
                    onClick={() => navigate(`/restaurant/${restaurant.id}`)}
                    className="btn orange-btn w-100 mb-2"
                  >
                    Voir le menu
                  </button>

                  {isAdmin && (
                    <div className="d-flex gap-2">
                      <button
                        onClick={() => navigate(`/admin/restaurant/edit/${restaurant.id}`)}
                        className="btn btn-outline-secondary w-50 soft-btn"
                      >
                        ✏️ Modifier
                      </button>
                      <button
                        onClick={() => handleDelete(restaurant.id, restaurant.nom)}
                        className="btn btn-outline-danger w-50 soft-btn"
                      >
                        🗑️ Supprimer
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default RestaurantList;
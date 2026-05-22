import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { restaurantAPI } from '../services/api';

function RestaurantDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState(null);
  const [plats, setPlats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const isAdmin = localStorage.getItem('role') === 'ADMIN';

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      const [restoRes, platsRes] = await Promise.all([
        restaurantAPI.getById(id),
        restaurantAPI.getPlats(id)
      ]);
      setRestaurant(restoRes.data);
      setPlats(platsRes.data);
    } catch (err) {
      setError('Erreur chargement du restaurant');
    } finally {
      setLoading(false);
    }
  };

  const ajouterAuPanier = (plat) => {
    const panier = JSON.parse(localStorage.getItem('panier') || '[]');
    const existing = panier.find(p => p.id === plat.id);

    if (existing) {
      existing.quantite++;
    } else {
      panier.push({ ...plat, quantite: 1, restaurantId: parseInt(id) });
    }

    localStorage.setItem('panier', JSON.stringify(panier));
    alert(`${plat.nom} ajouté au panier !`);
  };

  const handleDeletePlat = async (platId, platNom) => {
    if (window.confirm(`Supprimer le plat "${platNom}" ?`)) {
      try {
        await restaurantAPI.deletePlat(platId);
        alert('Plat supprimé');
        fetchData();
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
        <button onClick={() => navigate('/restaurants')} className="btn btn-outline-secondary soft-btn mb-3">
          ← Retour
        </button>

        <div className="premium-card mb-4">
          {/* Affiche l'image du restaurant (celle stockée en base ou une par défaut) */}
         <img
             src={restaurant?.image || 'https://placehold.co/1200x500/FF6B35/white?text=Restaurant+Food'}
             alt={restaurant?.nom}
            className="food-image-lg"
            style={{ width: '100%', height: '300px', objectFit: 'cover' }}
/>
          <div className="p-4 p-md-5">
            <div className="d-flex justify-content-between align-items-start flex-wrap gap-2">
              <div>
                <h1 className="section-title" style={{ color: '#FF6B35' }}>{restaurant?.nom}</h1>
                <p className="mb-1">📍 {restaurant?.adresse}</p>
                <p className="mb-0">🍳 {restaurant?.typeCuisine}</p>
              </div>

              {isAdmin && (
                <button
                  onClick={() => navigate(`/admin/plat/add/${id}`)}
                  className="btn orange-btn"
                >
                  ➕ Ajouter un plat
                </button>
              )}
            </div>
          </div>
        </div>

        <h2 className="mb-4 section-title">Notre carte</h2>

        <div className="row g-4">
          {plats.map((plat) => (
            <div key={plat.id} className="col-md-6 col-lg-4">
              <div className="premium-card h-100">
                {/* Affiche l'image du plat (celle stockée en base ou une par défaut) */}
               <img
                  src={plat.image || 'https://placehold.co/600x400/FF6B35/white?text=Food'}
                  alt={plat.nom}
                  className="food-image"
                  style={{ width: '100%', height: '200px', objectFit: 'cover' }}
/>
                <div className="p-4">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <h5 className="mb-0 section-title">{plat.nom}</h5>
                    <span className="badge badge-orange rounded-pill">{plat.prix} DH</span>
                  </div>

                  <p className="text-muted mb-3">{plat.description || 'Délicieux plat du chef.'}</p>

                  <button
                    onClick={() => ajouterAuPanier(plat)}
                    className="btn orange-btn w-100 mb-2"
                  >
                    Ajouter au panier
                  </button>

                  {isAdmin && (
                    <div className="d-flex gap-2">
                      <button
                        onClick={() => navigate(`/admin/plat/edit/${plat.id}/restaurant/${id}`)}
                        className="btn btn-outline-secondary w-50 soft-btn"
                      >
                        ✏️ Modifier
                      </button>
                      <button
                        onClick={() => handleDeletePlat(plat.id, plat.nom)}
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

        <button
          onClick={() => navigate('/cart')}
          className="btn orange-btn floating-cart"
        >
          🛒
        </button>
      </div>
    </div>
  );
}

export default RestaurantDetail;
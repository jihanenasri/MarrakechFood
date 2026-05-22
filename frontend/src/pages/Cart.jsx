import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { commandeAPI, restaurantAPI } from '../services/api';

function Cart() {
  const [cart, setCart] = useState([]);
  const [adresse, setAdresse] = useState('');
  const [loading, setLoading] = useState(false);
  const [restaurants, setRestaurants] = useState([]);
  const [selectedRestaurantId, setSelectedRestaurantId] = useState('');
  const navigate = useNavigate();
  const clientId = localStorage.getItem('clientId');

  useEffect(() => {
    loadCart();
    loadRestaurants();
  }, []);

  const loadCart = () => {
    const savedCart = JSON.parse(localStorage.getItem('panier') || '[]');
    setCart(savedCart);
  };

  const loadRestaurants = async () => {
    try {
      const response = await restaurantAPI.getAll();
      setRestaurants(response.data);
      const savedRestaurantId = localStorage.getItem('currentRestaurantId');
      if (savedRestaurantId && response.data.some(r => r.id === parseInt(savedRestaurantId))) {
        setSelectedRestaurantId(savedRestaurantId);
      } else if (response.data.length > 0) {
        setSelectedRestaurantId(response.data[0].id.toString());
        localStorage.setItem('currentRestaurantId', response.data[0].id);
      }
    } catch (err) {
      console.error('Erreur chargement restaurants:', err);
    }
  };

  const updateQuantite = (id, newQuantite) => {
    if (newQuantite < 1) {
      removeItem(id);
      return;
    }
    const newCart = cart.map(item => item.id === id ? { ...item, quantite: newQuantite } : item);
    setCart(newCart);
    localStorage.setItem('panier', JSON.stringify(newCart));
  };

  const removeItem = (id) => {
    const newCart = cart.filter(item => item.id !== id);
    setCart(newCart);
    localStorage.setItem('panier', JSON.stringify(newCart));
  };

  const total = cart.reduce((sum, item) => sum + (item.prix * item.quantite), 0);

  const handleRestaurantChange = (e) => {
    const newId = e.target.value;
    setSelectedRestaurantId(newId);
    localStorage.setItem('currentRestaurantId', newId);
  };

  const handleCommander = async () => {
    if (!adresse) return alert('Veuillez entrer votre adresse de livraison');
    if (!clientId) {
      alert('Veuillez vous connecter');
      navigate('/login');
      return;
    }

    const finalRestaurantId = selectedRestaurantId || restaurants[0]?.id;
    if (!finalRestaurantId) return alert('Aucun restaurant disponible');

    setLoading(true);

    const commande = {
      clientId: parseInt(clientId),
      restaurantId: parseInt(finalRestaurantId),
      adresseLivraison: adresse,
      items: cart.map(item => ({
        platId: item.id,
        nomPlat: item.nom,
        prixUnitaire: item.prix,
        quantite: item.quantite
      }))
    };

    try {
      const response = await commandeAPI.create(commande);
      localStorage.removeItem('panier');
      alert('Commande créée avec succès !');
      navigate(`/order-tracking/${response.data.id}`);
    } catch (err) {
      alert('Erreur lors de la création de la commande');
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="app-page">
        <div className="container text-center mt-5">
          <div className="premium-card p-5">
            <h2>🛒 Votre panier est vide</h2>
            <button onClick={() => navigate('/restaurants')} className="btn orange-btn mt-3">
              Voir les restaurants
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-page">
      <div className="container" style={{ maxWidth: 900 }}>
        <h1 className="section-title mb-4" style={{ color: '#FF6B35' }}>🛒 Mon panier</h1>

        {restaurants.length > 0 && (
          <div className="premium-card p-3 p-md-4 mb-3">
            <label className="fw-bold mb-2">Restaurant</label>
            <select className="form-select" value={selectedRestaurantId} onChange={handleRestaurantChange}>
              {restaurants.map(r => (
                <option key={r.id} value={r.id}>{r.nom} - {r.adresse}</option>
              ))}
            </select>
          </div>
        )}

        <div className="d-grid gap-3">
          {cart.map((item) => (
            <div key={item.id} className="premium-card p-3 p-md-4">
              <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
                <div>
                  <h5 className="mb-1">{item.nom}</h5>
                  <p className="mb-0" style={{ color: '#FF6B35', fontWeight: 700 }}>{item.prix} DH</p>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <button onClick={() => updateQuantite(item.id, item.quantite - 1)} className="btn btn-outline-secondary soft-btn">-</button>
                  <span className="fw-bold">{item.quantite}</span>
                  <button onClick={() => updateQuantite(item.id, item.quantite + 1)} className="btn btn-outline-secondary soft-btn">+</button>
                  <button onClick={() => removeItem(item.id)} className="btn btn-outline-danger soft-btn ms-2">🗑️</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="premium-card p-4 mt-4">
          <h3 className="mb-4">Total : <span style={{ color: '#FF6B35' }}>{total} DH</span></h3>

          <div className="mb-3">
            <label className="form-label fw-bold">Adresse de livraison</label>
            <input
              type="text"
              className="form-control"
              value={adresse}
              onChange={(e) => setAdresse(e.target.value)}
              placeholder="Votre adresse"
            />
          </div>

          <button onClick={handleCommander} disabled={loading} className="btn orange-btn w-100 py-3">
            {loading ? 'Commande en cours...' : 'Valider la commande'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Cart;
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { commandeAPI } from '../services/api';

function LivreurDashboard() {
  const [commandes, setCommandes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCommandes();
  }, []);

  const fetchCommandes = async () => {
    try {
      const response = await commandeAPI.getByStatut('VALIDEE');
      setCommandes(response.data);
    } catch (err) {
      alert('Erreur chargement commandes');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center mt-5">Chargement...</div>;

  return (
    <div className="app-page">
      <div className="container" style={{ maxWidth: 900 }}>
        <h1 className="section-title mb-4" style={{ color: '#FF6B35' }}>🚚 Commandes à livrer</h1>

        {commandes.length === 0 ? (
          <div className="premium-card p-4 text-center">
            <div className="alert alert-info mb-0">Aucune commande en attente.</div>
          </div>
        ) : (
          <div className="d-grid gap-3">
            {commandes.map(cmd => (
              <div key={cmd.id} className="premium-card p-4">
                <div className="d-flex justify-content-between align-items-start flex-wrap gap-2">
                  <div>
                    <h5 className="mb-2">Commande #{cmd.id}</h5>
                    <p className="mb-1">📍 Adresse : {cmd.adresseLivraison}</p>
                    <p className="mb-0">💰 Total : {cmd.total} DH</p>
                  </div>
                  <button onClick={() => navigate(`/livreur/scan/${cmd.id}`)} className="btn orange-btn">
                    📷 Scanner QR
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default LivreurDashboard;
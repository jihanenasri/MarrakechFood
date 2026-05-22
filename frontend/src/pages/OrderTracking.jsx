import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { commandeAPI } from '../services/api';

function OrderTracking() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [commande, setCommande] = useState(null);
  const [loading, setLoading] = useState(true);
  const [validating, setValidating] = useState(false);

  useEffect(() => {
    fetchCommande();
  }, [id]);

  const fetchCommande = async () => {
    try {
      const response = await commandeAPI.getById(id);
      setCommande(response.data);
    } catch (err) {
      alert('Erreur chargement commande');
    } finally {
      setLoading(false);
    }
  };

  const handleValider = async () => {
    setValidating(true);
    try {
      await commandeAPI.valider(id);
      alert('Commande validée avec succès ! QR code généré.');
      fetchCommande();
    } catch (err) {
      alert('Erreur lors de la validation');
    } finally {
      setValidating(false);
    }
  };

  const statutSteps = { EN_ATTENTE: 1, VALIDEE: 2, EN_PREPARATION: 3, EN_LIVRAISON: 4, LIVREE: 5 };
  const currentStep = statutSteps[commande?.statut] || 1;

  if (loading) return <div className="text-center mt-5">Chargement...</div>;

  return (
    <div className="app-page">
      <div className="container" style={{ maxWidth: 700 }}>
        <h1 className="section-title mb-4" style={{ color: '#FF6B35' }}>
          📦 Suivi commande #{commande?.id}
        </h1>

        {commande?.statut === 'EN_ATTENTE' && (
          <div className="text-center mb-4">
            <button onClick={handleValider} disabled={validating} className="btn orange-btn">
              {validating ? 'Validation...' : 'Valider la commande'}
            </button>
          </div>
        )}

        <div className="premium-card p-4 mb-4">
          <div className="d-flex justify-content-between mb-2 small">
            <span>📝 En attente</span><span>✅ Validée</span><span>🍳 Préparation</span><span>🚚 Livraison</span><span>🏠 Livrée</span>
          </div>
          <div className="progress" style={{ height: 10 }}>
            <div
              className="progress-bar"
              style={{ width: `${(currentStep / 5) * 100}%`, backgroundColor: '#FF6B35' }}
            ></div>
          </div>
        </div>

        {commande?.qrCodeBase64 ? (
          <div className="premium-card p-4 text-center mb-4">
            <h3 className="mb-3">📱 QR Code</h3>
            <img
              src={`data:image/png;base64,${commande.qrCodeBase64}`}
              alt="QR Code"
              className="img-fluid border rounded"
              style={{ width: 220 }}
            />
            <p className="mt-3 text-muted">Code : COMMANDE_{commande.id}</p>
          </div>
        ) : (
          <div className="alert alert-secondary text-center mt-4">⏳ QR code après validation</div>
        )}

        <div className="premium-card p-4">
          <h5 className="mb-3">Détails commande</h5>
          <p><strong>Statut :</strong> {commande?.statut}</p>
          <p><strong>Total :</strong> {commande?.total} DH</p>
          <p className="mb-0"><strong>Adresse :</strong> {commande?.adresseLivraison}</p>
        </div>

        <button onClick={() => navigate('/restaurants')} className="btn btn-outline-secondary soft-btn mt-3">
          ← Retour
        </button>
      </div>
    </div>
  );
}

export default OrderTracking;
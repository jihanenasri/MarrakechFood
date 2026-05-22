import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { livreurAPI } from "../services/api";

function QRScanner() {
  const { commandeId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const scan = async () => {
      const input = prompt("Entrer QR (COMMANDE_15)");
      if (!input) {
        navigate("/livreur/dashboard");
        return;
      }

      const qr = input.trim().replace(/"/g, "").replace(/\s/g, "");

      if (!qr.startsWith("COMMANDE_")) {
        alert("QR invalide");
        return;
      }

      try {
        await livreurAPI.scanQR(qr);
        alert("Livraison confirmée ✅");
        navigate("/livreur/dashboard");
      } catch (err) {
        alert("Erreur backend: " + (err.response?.data || err.message));
      }
    };

    scan();
  }, [commandeId, navigate]);

  return (
    <div className="app-page d-flex align-items-center justify-content-center">
      <div className="premium-card p-4 text-center">
        <h2>📷 Scan QR...</h2>
      </div>
    </div>
  );
}

export default QRScanner;
import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { livreurAPI } from "../services/api";

function QRScanner() {
  const { commandeId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const scan = async () => {
      const input = prompt("Entrer QR (ex: COMMANDE_15)");
      if (!input) {
        navigate("/livreur/dashboard");
        return;
      }

      const qr = input.trim().replace(/"/g, "").replace(/\s/g, "");

      if (!qr.startsWith("COMMANDE_")) {
        alert("QR invalide — format attendu : COMMANDE_ID");
        navigate("/livreur/dashboard");
        return;
      }

      try {
        const response = await livreurAPI.scanQR(qr);

        // ✅ FIX : vérifier la réponse AVANT d'afficher le succès
        if (response.data?.error) {
          alert("Erreur : " + response.data.error);
        } else {
          const msg =
            response.data?.message ||
            (typeof response.data === "string" ? response.data : null) ||
            "Livraison confirmée ✅";
          alert(msg);
          navigate("/livreur/dashboard");
        }
      } catch (err) {
        // ✅ FIX : extraction propre du message d'erreur backend
        let errorMsg = "Erreur inconnue";
        const data = err.response?.data;
        if (data) {
          if (typeof data === "string") errorMsg = data;
          else if (data.error) errorMsg = data.error;
          else if (data.message) errorMsg = data.message;
          else errorMsg = JSON.stringify(data);
        } else if (err.message) {
          errorMsg = err.message;
        }
        alert("Erreur backend : " + errorMsg);
        navigate("/livreur/dashboard");
      }
    };

    scan();
  }, [commandeId, navigate]);

  return (
    <div className="app-page d-flex align-items-center justify-content-center">
      <div className="premium-card p-4 text-center">
        <h2>📷 Scan QR en cours...</h2>
        <p className="text-muted mt-2">Veuillez entrer le code QR dans la fenêtre de dialogue.</p>
      </div>
    </div>
  );
}

export default QRScanner;
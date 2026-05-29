package com.example.livreurservice.controller;

import com.example.livreurservice.entity.Livreur;
import com.example.livreurservice.entity.StatutLivreur;
import com.example.livreurservice.service.LivreurService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/livreurs")
@CrossOrigin(origins = "*")
public class LivreurController {

    private final LivreurService livreurService;

    public LivreurController(LivreurService livreurService) {
        this.livreurService = livreurService;
    }

    @GetMapping("/test")
    public String test() {
        return "✅ Service Livreur fonctionne sur le port 8085 !";
    }

    @PostMapping
    public ResponseEntity<Livreur> ajouterLivreur(@RequestBody Livreur livreur) {
        return ResponseEntity.ok(livreurService.ajouterLivreur(livreur));
    }

    @GetMapping
    public List<Livreur> getAll() {
        return livreurService.getAllLivreurs();
    }

    @GetMapping("/disponibles")
    public List<Livreur> getDisponibles() {
        return livreurService.getLivreursDisponibles();
    }

    @PutMapping("/{id}/statut")
    public ResponseEntity<String> changerStatut(@PathVariable Long id, @RequestParam StatutLivreur statut) {
        livreurService.changerStatut(id, statut);
        return ResponseEntity.ok("Statut mis à jour");
    }

    @PutMapping("/assigner/{commandeId}")
    public ResponseEntity<Livreur> assignerALaCommande(@PathVariable Long commandeId) {
        return ResponseEntity.ok(livreurService.assignerALaCommande(commandeId));
    }

    // endpoint pour scanner QR code (accepte JSON et text/plain)
    @PostMapping(value = "/scan-qr", consumes = {"text/plain", "application/json"})
    public ResponseEntity<Map<String, String>> scannerQR(@RequestBody String qrCodeData) {
        Map<String, String> response = new HashMap<>();
        
        System.out.println("RAW RECU = [" + qrCodeData + "]");
        
        // nettoie la chaîne si elle vient d'un JSON
        String cleanQr = qrCodeData;
        if (qrCodeData.startsWith("{")) {
            // extrait la valeur entre guillemets
            int start = qrCodeData.indexOf("\"") + 1;
            int end = qrCodeData.lastIndexOf("\"");
            if (start > 0 && end > start) {
                cleanQr = qrCodeData.substring(start, end);
            }
        }
        
        cleanQr = cleanQr.trim().replaceAll("^\"|\"$", "");
        
        try {
            String message = livreurService.scannerQRCode(cleanQr);
            response.put("message", message);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Livreur> getById(@PathVariable Long id) {
        return livreurService.getLivreurById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Livreur> updateLivreur(
            @PathVariable Long id,
            @RequestBody Livreur livreur) {

        return ResponseEntity.ok(livreurService.updateLivreur(id, livreur));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteLivreur(@PathVariable Long id) {
        livreurService.deleteLivreur(id);
        return ResponseEntity.ok("Livreur supprimé");
    }
}

package com.example.commandeservice.controller;

import com.example.commandeservice.entity.Commande;
import com.example.commandeservice.entity.StatutCommande;
import com.example.commandeservice.service.CommandeService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/commandes")
@CrossOrigin(origins = "*")
public class CommandeController {

    private final CommandeService commandeService;

    public CommandeController(CommandeService commandeService) {
        this.commandeService = commandeService;
    }

    @GetMapping("/test")
    public String test() {
        return "✅ Service Commande fonctionne sur le port 8084 !";
    }

    @PostMapping
    public ResponseEntity<Commande> creerCommande(@RequestBody Commande commande) {
        return ResponseEntity.ok(commandeService.createCommande(commande));
    }

    @PutMapping("/{id}/valider")
    public ResponseEntity<String> validerCommande(@PathVariable Long id) {
        commandeService.validerCommande(id);
        return ResponseEntity.ok("OK");
    }

    @GetMapping
    public List<Commande> getAll() {
        return commandeService.getAllCommandes();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Commande> getById(@PathVariable Long id) {
        return ResponseEntity.ok(commandeService.getCommandeById(id));
    }

    @GetMapping("/client/{clientId}")
    public List<Commande> getByClient(@PathVariable Long clientId) {
        return commandeService.getCommandesByClient(clientId);
    }
    @PutMapping("/{commandeId}/assigner/{livreurId}")
    public ResponseEntity<Commande> assignerLivreur(
            @PathVariable Long commandeId,
            @PathVariable Long livreurId) {

        Commande commande = commandeService.assignerLivreur(commandeId, livreurId);
        return ResponseEntity.ok(commande);
    }
    
    @PutMapping("/{commandeId}/confirmer-livraison")
    public ResponseEntity<Commande> confirmerLivraison(@PathVariable Long commandeId) {
        Commande commande = commandeService.confirmerLivraison(commandeId);
        return ResponseEntity.ok(commande);
    }
    @GetMapping("/statut/{statut}")
    public List<Commande> getByStatut(@PathVariable StatutCommande statut) {
        return commandeService.getCommandesByStatut(statut);
    }
}

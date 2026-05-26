package com.example.clientservice.controller;

import com.example.clientservice.entity.Client;
import com.example.clientservice.service.ClientService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/clients")
@CrossOrigin(origins = "*")
public class ClientController {

    private final ClientService clientService;

    public ClientController(ClientService clientService) {
        this.clientService = clientService;
    }

    @GetMapping("/test")
    public String test() {
        return "✅ Service Client fonctionne correctement !";
    }

    @PostMapping("/inscrire")
    public ResponseEntity<Client> inscrire(@RequestBody Client client) {
        Client savedClient = clientService.inscrire(client);
        return ResponseEntity.ok(savedClient);
    }
    
    @PostMapping("/connexion")
    public ResponseEntity<?> connexion(@RequestBody Map<String, String> credentials) {
        String email = credentials.get("email");
        String motDePasse = credentials.get("motDePasse");

        return clientService.connexion(email, motDePasse)
                .map(client -> ResponseEntity.ok(Map.of(
                        "message", "Connexion réussie",
                        "clientId", client.getId(),
                        "email", client.getEmail(),
                        "role", client.getRole()
                )))
                .orElse(ResponseEntity.status(401)
                .body(Map.of("message", "Email ou mot de passe incorrect")));
    }
    
    // endpoint pour creer un admin (a appeler une seule fois)
    @PostMapping("/create-admin")
    public ResponseEntity<?> createAdmin() {
        if (clientService.getClientByEmail("admin@marrakechfood.com").isPresent()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Admin existe deja"));
        }
        Client admin = new Client();
        admin.setNom("Administrateur");
        admin.setEmail("admin@marrakechfood.com");
        admin.setMotDePasse("admin123");
        admin.setRole("ADMIN");
        admin.setAdresse("Admin");
        admin.setTelephone("0000000000");
        clientService.inscrire(admin);
        return ResponseEntity.ok(Map.of("message", "Admin cree avec succes"));
    }
    
    @GetMapping
    public List<Client> getAllClients() {
        return clientService.getAllClients();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Client> getClientById(@PathVariable Long id) {
        return clientService.getClientById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/{id}/exists")
    public boolean exists(@PathVariable Long id) {
        return clientService.getClientById(id).isPresent();
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteClient(@PathVariable Long id) {
        if (clientService.getClientById(id).isPresent()) {
            clientService.deleteClient(id);
            return ResponseEntity.ok(Map.of("message", "Client supprime avec succes"));
        } else {
            return ResponseEntity.status(404).body(Map.of("message", "Client introuvable"));
        }
    }
}

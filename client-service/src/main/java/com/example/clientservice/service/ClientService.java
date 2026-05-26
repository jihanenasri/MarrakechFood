package com.example.clientservice.service;

import com.example.clientservice.entity.Client;
import com.example.clientservice.repository.ClientRepository;
import org.mindrot.jbcrypt.BCrypt;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ClientService {

    private final ClientRepository repository;

    public ClientService(ClientRepository repository) {
        this.repository = repository;
    }

    public Client inscrire(Client client) {
        if (repository.findByEmail(client.getEmail()).isPresent()) {
            throw new RuntimeException("Email déjà utilisé");
        }
        // hash du mot de passe avant sauvegarde
        String hashed = BCrypt.hashpw(client.getMotDePasse(), BCrypt.gensalt());
        client.setMotDePasse(hashed);
        
        // par defaut, le role est CLIENT
        if (client.getRole() == null) {
            client.setRole("CLIENT");
        }
        return repository.save(client);
    }

    public Optional<Client> connexion(String email, String motDePasse) {
        Optional<Client> client = repository.findByEmail(email);
        if (client.isPresent()) {
            String storedPassword = client.get().getMotDePasse();
            // verification si le mot de passe est deja hashe ou en clair
            if (storedPassword.startsWith("$2a$")) {
                // mot de passe deja hashe
                if (BCrypt.checkpw(motDePasse, storedPassword)) {
                    return client;
                }
            } else {
                // mot de passe en clair (ancien format) - on le hache et on met a jour
                if (storedPassword.equals(motDePasse)) {
                    String hashed = BCrypt.hashpw(motDePasse, BCrypt.gensalt());
                    client.get().setMotDePasse(hashed);
                    repository.save(client.get());
                    return client;
                }
            }
        }
        return Optional.empty();
    }

    public List<Client> getAllClients() {
        return repository.findAll();
    }

    public Optional<Client> getClientById(Long id) {
        return repository.findById(id);
    }
    
    public Optional<Client> getClientByEmail(String email) {
        return repository.findByEmail(email);
    }

    public void deleteClient(Long id) {
        repository.deleteById(id);
    }
}
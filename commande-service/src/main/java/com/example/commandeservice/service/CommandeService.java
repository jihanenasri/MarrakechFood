package com.example.commandeservice.service;

import com.example.commandeservice.entity.CommandeItem;
import com.example.commandeservice.client.ClientServiceClient;
import com.example.commandeservice.client.RestaurantServiceClient;
import com.example.commandeservice.entity.Commande;
import com.example.commandeservice.entity.StatutCommande;
import com.example.commandeservice.repository.CommandeRepository;
import com.example.commandeservice.util.QRCodeGenerator;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class CommandeService {

    private final CommandeRepository repository;
    private final ClientServiceClient clientServiceClient;
    private final RestaurantServiceClient restaurantServiceClient;

    public CommandeService(CommandeRepository repository,
                           ClientServiceClient clientServiceClient,
                           RestaurantServiceClient restaurantServiceClient) {
        this.repository = repository;
        this.clientServiceClient = clientServiceClient;
        this.restaurantServiceClient = restaurantServiceClient;
    }

    public Commande createCommande(Commande commande) {

        System.out.println("client id = " + commande.getClientId());
        System.out.println("resto id = " + commande.getRestaurantId());
        System.out.println("items = " + commande.getItems());

        if (commande.getItems() == null || commande.getItems().isEmpty()) {
            throw new RuntimeException("items obligatoires");
        }

        // verification client et restaurant avec gestion des exceptions feign
        try {
            if (!clientServiceClient.existsById(commande.getClientId())) {
                throw new RuntimeException("client invalide");
            }

            if (!restaurantServiceClient.existsById(commande.getRestaurantId())) {
                throw new RuntimeException("restaurant invalide");
            }
        } catch (Exception e) {
            throw new RuntimeException("erreur communication microservices: " + e.getMessage());
        }

        for (CommandeItem item : commande.getItems()) {
            item.setCommande(commande);
        }

        double total = commande.getItems().stream()
                .mapToDouble(i -> i.getPrixUnitaire() * i.getQuantite())
                .sum();

        commande.setTotal(total);
        commande.setStatut(StatutCommande.EN_ATTENTE);
        commande.setDateCommande(LocalDateTime.now());

        return repository.save(commande);
    }

    @Transactional
    public Commande validerCommande(Long id) {

        Commande commande = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("commande non trouvee"));

        if (commande.getStatut() != StatutCommande.EN_ATTENTE) {
            throw new RuntimeException("la commande ne peut pas etre validee");
        }

        try {
            String qrData = "commande_" + commande.getId();
            String qrBase64 = QRCodeGenerator.generateQRCode(qrData);
            commande.setQrCodeBase64(qrBase64);
        } catch (Exception e) {
            System.out.println("erreur qr code : " + e.getMessage());
        }

        commande.setStatut(StatutCommande.VALIDEE);
        return repository.save(commande);
    }

    public List<Commande> getAllCommandes() {
        return repository.findAll();
    }

    public Commande getCommandeById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("commande non trouvee"));
    }

    public List<Commande> getCommandesByClient(Long clientId) {
        return repository.findByClientId(clientId);
    }

    public List<Commande> getCommandesByStatut(StatutCommande statut) {
        return repository.findByStatut(statut);
    }

    @Transactional
    public Commande assignerLivreur(Long commandeId, Long livreurId) {
        Commande commande = repository.findById(commandeId)
                .orElseThrow(() -> new RuntimeException("commande non trouvee"));

        if (commande.getStatut() != StatutCommande.VALIDEE) {
            throw new RuntimeException("la commande doit etre validee avant d'assigner un livreur");
        }

        commande.setLivreurId(livreurId);
        commande.setStatut(StatutCommande.EN_LIVRAISON);
        return repository.save(commande);
    }

    @Transactional
    public Commande confirmerLivraison(Long commandeId) {
        Commande commande = repository.findById(commandeId)
                .orElseThrow(() -> new RuntimeException("commande non trouvee"));

        if (commande.getStatut() != StatutCommande.EN_LIVRAISON) {
            throw new RuntimeException("la commande n'est pas en cours de livraison");
        }

        commande.setStatut(StatutCommande.LIVREE);
        commande.setDateLivraison(LocalDateTime.now());
        return repository.save(commande);
    }
}
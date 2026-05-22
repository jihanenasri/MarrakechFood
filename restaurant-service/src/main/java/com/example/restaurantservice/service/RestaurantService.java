package com.example.restaurantservice.service;

import com.example.restaurantservice.entity.Plat;
import com.example.restaurantservice.entity.Restaurant;
import com.example.restaurantservice.repository.PlatRepository;
import com.example.restaurantservice.repository.RestaurantRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class RestaurantService {

    private final RestaurantRepository restaurantRepository;
    private final PlatRepository platRepository;

    public RestaurantService(RestaurantRepository restaurantRepository,
                             PlatRepository platRepository) {
        this.restaurantRepository = restaurantRepository;
        this.platRepository = platRepository;
    }

    public Restaurant ajouterRestaurant(Restaurant restaurant) {
        return restaurantRepository.save(restaurant);
    }

    public List<Restaurant> getAllRestaurants() {
        return restaurantRepository.findAll();
    }

    public Optional<Restaurant> getRestaurantById(Long id) {
        return restaurantRepository.findById(id);
    }

    // ✅ AJOUTER CETTE MÉTHODE (manquante)
    public Optional<Plat> getPlatById(Long id) {
        return platRepository.findById(id);
    }

    public Restaurant updateRestaurant(Long id, Restaurant restaurant) {

        Restaurant existing = restaurantRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Restaurant not found"));

        existing.setNom(restaurant.getNom());
        existing.setAdresse(restaurant.getAdresse());
        existing.setTelephone(restaurant.getTelephone());
        existing.setTypeCuisine(restaurant.getTypeCuisine());
        existing.setStatut(restaurant.getStatut());
        existing.setImage(restaurant.getImage()); // ajout d'image

        return restaurantRepository.save(existing);
    }

    public void deleteRestaurant(Long id) {
        restaurantRepository.deleteById(id);
    }

    public Plat ajouterPlat(Plat plat) {
        return platRepository.save(plat);
    }
    
    // ajout d'une methode manquante
    public Plat updatePlat(Long id, Plat plat) {
        Plat existing = platRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Plat not found"));
        
        existing.setNom(plat.getNom());
        existing.setDescription(plat.getDescription());
        existing.setPrix(plat.getPrix());
        existing.setImage(plat.getImage());
        
        return platRepository.save(existing);
    }

    public List<Plat> getPlatsByRestaurant(Long restaurantId) {
        return platRepository.findByRestaurantId(restaurantId);
    }
    
    public void deletePlat(Long platId) {
        Plat plat = platRepository.findById(platId)
                .orElseThrow(() -> new RuntimeException("Plat not found"));
        platRepository.delete(plat);
    }
}
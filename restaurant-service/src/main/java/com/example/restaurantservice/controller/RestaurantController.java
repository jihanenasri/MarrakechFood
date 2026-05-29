package com.example.restaurantservice.controller;

import com.example.restaurantservice.entity.Plat;
import com.example.restaurantservice.entity.Restaurant;
import com.example.restaurantservice.service.RestaurantService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/restaurants")
public class RestaurantController {

    private final RestaurantService restaurantService;

    public RestaurantController(RestaurantService restaurantService) {
        this.restaurantService = restaurantService;
    }

    @GetMapping("/test")
    public String test() {
        return "Service Restaurant fonctionne sur le port 8083 !";
    }

    @PostMapping
    public ResponseEntity<Restaurant> ajouterRestaurant(@RequestBody Restaurant restaurant) {
        return ResponseEntity.ok(restaurantService.ajouterRestaurant(restaurant));
    }

    @GetMapping
    public List<Restaurant> getAllRestaurants() {
        return restaurantService.getAllRestaurants();
    }

    // ajout de endpoint pour recuperer un plat avec id
    @GetMapping("/plats/{id}")
    public ResponseEntity<Plat> getPlatById(@PathVariable Long id) {
        return restaurantService.getPlatById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // ajout endpoint pour modifier un plat
    @PutMapping("/plats/{id}")
    public ResponseEntity<Plat> updatePlat(@PathVariable Long id, @RequestBody Plat plat) {
        return ResponseEntity.ok(restaurantService.updatePlat(id, plat));
    }

    @DeleteMapping("/plats/{platId}")
    public ResponseEntity<Void> deletePlat(@PathVariable Long platId) {
        restaurantService.deletePlat(platId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Restaurant> getById(@PathVariable Long id) {
        return restaurantService.getRestaurantById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Restaurant> updateRestaurant(
            @PathVariable Long id,
            @RequestBody Restaurant restaurant) {

        return ResponseEntity.ok(
                restaurantService.updateRestaurant(id, restaurant)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRestaurant(@PathVariable Long id) {
        restaurantService.deleteRestaurant(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{restaurantId}/plats")
    public ResponseEntity<Plat> ajouterPlat(
            @PathVariable Long restaurantId,
            @RequestBody Plat plat) {

        Restaurant restaurant = restaurantService.getRestaurantById(restaurantId)
                .orElseThrow(() -> new RuntimeException("Restaurant not found"));

        plat.setRestaurant(restaurant);

        return ResponseEntity.ok(restaurantService.ajouterPlat(plat));
    }

    @GetMapping("/{restaurantId}/plats")
    public List<Plat> getPlatsByRestaurant(@PathVariable Long restaurantId) {
        return restaurantService.getPlatsByRestaurant(restaurantId);
    }

    @GetMapping("/{id}/exists")
    public boolean exists(@PathVariable Long id) {
        return restaurantService.getRestaurantById(id).isPresent();
    }
}

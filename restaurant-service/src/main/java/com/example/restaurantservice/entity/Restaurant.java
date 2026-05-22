package com.example.restaurantservice.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "restaurants")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Restaurant {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Le nom est obligatoire")
    @Column(nullable = false)
    private String nom;

    @NotBlank(message = "L'adresse est obligatoire")
    @Column(nullable = false)
    private String adresse;

    @Pattern(regexp = "^[0-9]{10}$", message = "Téléphone invalide")
    @Column(unique = true)
    private String telephone;

    private String typeCuisine;

    @Enumerated(EnumType.STRING)
    private StatutRestaurant statut = StatutRestaurant.OUVERT;

    // ajout du champ image
    @Column(length = 500)
    private String image;
    
    @OneToMany(mappedBy = "restaurant", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<Plat> plats;
}
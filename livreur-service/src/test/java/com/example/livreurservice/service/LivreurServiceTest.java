package com.example.livreurservice.service;

import com.example.livreurservice.client.CommandeServiceClient;
import com.example.livreurservice.entity.Livreur;
import com.example.livreurservice.entity.StatutLivreur;
import com.example.livreurservice.repository.LivreurRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class LivreurServiceTest {

    @Mock
    private LivreurRepository repository;

    @Mock
    private CommandeServiceClient commandeClient;

    @InjectMocks
    private LivreurService livreurService;

    // AJOUT

    @Test
    void testAjouterLivreur() {
        Livreur l = new Livreur(null, "Ali", "0600", null, null, null, null);

        when(repository.save(any())).thenReturn(l);

        Livreur result = livreurService.ajouterLivreur(l);

        assertNotNull(result);
        assertEquals(StatutLivreur.DISPONIBLE, result.getStatut());
        verify(repository, times(1)).save(l);
    }

    @Test
    void testAjouterLivreurNull() {
        assertThrows(IllegalArgumentException.class, () -> {
            livreurService.ajouterLivreur(null);
        });
        verify(repository, never()).save(any());
    }

    //GET

    @Test
    void testGetAllLivreurs() {
        List<Livreur> list = List.of(
                new Livreur(1L, "Ali", "0600", null, StatutLivreur.DISPONIBLE, null, null),
                new Livreur(2L, "Sara", "0601", null, StatutLivreur.OCCUPE, null, null)
        );

        when(repository.findAll()).thenReturn(list);

        List<Livreur> result = livreurService.getAllLivreurs();

        assertEquals(2, result.size());
        verify(repository).findAll();
    }

    @Test
    void testGetLivreursDisponibles() {
        List<Livreur> list = List.of(
                new Livreur(1L, "Ali", "0600", null, StatutLivreur.DISPONIBLE, null, null)
        );

        when(repository.findByStatut(StatutLivreur.DISPONIBLE)).thenReturn(list);

        List<Livreur> result = livreurService.getLivreursDisponibles();

        assertEquals(1, result.size());
        assertEquals(StatutLivreur.DISPONIBLE, result.get(0).getStatut());
    }

    // ASSIGNATION

    @Test
    void testAssignerLivreurSuccess() {
        Livreur l = new Livreur(1L, "Ali", "0600", null, StatutLivreur.DISPONIBLE, null, null);

        when(repository.findByStatut(StatutLivreur.DISPONIBLE))
                .thenReturn(List.of(l));

        when(repository.save(any())).thenReturn(l);

        Livreur result = livreurService.assignerALaCommande(1L);

        assertEquals(StatutLivreur.OCCUPE, result.getStatut());

        verify(commandeClient).assignerLivreur(1L, 1L);
        verify(repository).save(l);
    }

    @Test
    void testAssignerAucunLivreur() {
        when(repository.findByStatut(StatutLivreur.DISPONIBLE))
                .thenReturn(List.of());

        assertThrows(RuntimeException.class, () -> {
            livreurService.assignerALaCommande(1L);
        });

        verify(commandeClient, never()).assignerLivreur(any(), any());
    }

    //CHANGER STATUT

    @Test
    void testChangerStatutSuccess() {
        Livreur l = new Livreur(1L, "Ali", "0600", null, StatutLivreur.DISPONIBLE, null, null);

        when(repository.findById(1L)).thenReturn(Optional.of(l));

        livreurService.changerStatut(1L, StatutLivreur.OCCUPE);

        assertEquals(StatutLivreur.OCCUPE, l.getStatut());
        verify(repository).save(l);
    }

    @Test
    void testChangerStatutLivreurNotFound() {
        when(repository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> {
            livreurService.changerStatut(1L, StatutLivreur.OCCUPE);
        });
    }

    //QR CODE

    @Test
    void testScannerQRSuccess() {
        String qr = "COMMANDE_1";

        // Mock du livreur disponible
        Livreur livreur = new Livreur(1L, "Ali", "0600", null, StatutLivreur.DISPONIBLE, null, null);
        when(repository.findByStatut(StatutLivreur.DISPONIBLE))
                .thenReturn(List.of(livreur));
        when(repository.save(any())).thenReturn(livreur);

        // Mock des appels Feign 
        doNothing().when(commandeClient).validerCommande(1L);
        doNothing().when(commandeClient).assignerLivreur(1L, 1L);
        doNothing().when(commandeClient).confirmerLivraison(1L);

        String result = livreurService.scannerQRCode(qr);

        assertTrue(result.contains("Livraison confirmée"));
        verify(commandeClient).confirmerLivraison(1L);
        verify(commandeClient).assignerLivreur(1L, 1L);
    }

    @Test
    void testScannerQRInvalide() {
        String qr = "INVALID";

        assertThrows(RuntimeException.class, () -> {
            livreurService.scannerQRCode(qr);
        });

        verify(commandeClient, never()).confirmerLivraison(any());
    }
    //Test GET BY ID
    @Test
    void testGetLivreurByIdExists() {
        Livreur l = new Livreur(1L, "Ali", "0600", null, StatutLivreur.DISPONIBLE, null, null);

        when(repository.findById(1L)).thenReturn(Optional.of(l));

        Optional<Livreur> result = livreurService.getLivreurById(1L);

        assertTrue(result.isPresent());
        assertEquals("Ali", result.get().getNom());
    }
    
    @Test
    void testGetLivreurByIdNotFound() {
        when(repository.findById(1L)).thenReturn(Optional.empty());

        Optional<Livreur> result = livreurService.getLivreurById(1L);

        assertTrue(result.isEmpty());
    }
    
    //Test UPDATE
    //succes
    @Test
    void testUpdateLivreurSuccess() {
        Livreur existing = new Livreur(1L, "Ali", "0600", null, StatutLivreur.DISPONIBLE, null, null);
        Livreur updated = new Livreur(null, "AliUpdated", "0700", "email@test.com", null, 10.0, 20.0);

        when(repository.findById(1L)).thenReturn(Optional.of(existing));
        when(repository.save(any())).thenReturn(existing);

        Livreur result = livreurService.updateLivreur(1L, updated);

        assertEquals("AliUpdated", result.getNom());
        assertEquals("0700", result.getTelephone());
        assertEquals("email@test.com", result.getEmail());
    }
    
    //id introuvable
    
    @Test
    void testUpdateLivreurNotFound() {
        Livreur updated = new Livreur();

        when(repository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> {
            livreurService.updateLivreur(1L, updated);
        });
    }
    
    //Test DELETE
    //succès
    @Test
    void testDeleteLivreur() {
        Long id = 1L;

        doNothing().when(repository).deleteById(id);

        livreurService.deleteLivreur(id);

        verify(repository, times(1)).deleteById(id);
    }
    
    //delete avec erreur
    @Test
    void testDeleteLivreurException() {
        Long id = 1L;

        doThrow(new RuntimeException()).when(repository).deleteById(id);

        assertThrows(RuntimeException.class, () -> {
            livreurService.deleteLivreur(id);
        });
    }
    
}
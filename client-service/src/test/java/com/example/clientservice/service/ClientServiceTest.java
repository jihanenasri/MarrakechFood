package com.example.clientservice.service;

import com.example.clientservice.entity.Client;
import com.example.clientservice.repository.ClientRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mindrot.jbcrypt.BCrypt;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ClientServiceTest {

    @Mock
    private ClientRepository repository;

    @InjectMocks
    private ClientService clientService;

    // tests pour l'inscription

    @Test
    void testInscrireSuccess() {
        // constructeur avec 7 parametres: id, nom, email, motDePasse, adresse, telephone, role
        Client client = new Client(null, "Jihane", "jihane@gmail.com", "1234", null, null, "CLIENT");

        when(repository.findByEmail(client.getEmail())).thenReturn(Optional.empty());
        when(repository.save(any(Client.class))).thenAnswer(invocation -> {
            Client saved = invocation.getArgument(0);
            saved.setId(1L);
            return saved;
        });

        Client result = clientService.inscrire(client);

        assertNotNull(result);
        assertEquals("jihane@gmail.com", result.getEmail());
        assertTrue(result.getMotDePasse().startsWith("$2a$"));

        verify(repository).save(any(Client.class));
    }

    @Test
    void testInscrireEmailExiste() {
        Client client = new Client(null, "Jihane", "jihane@gmail.com", "1234", null, null, "CLIENT");

        Client existingClient = new Client(1L, "Jihane", "jihane@gmail.com", BCrypt.hashpw("1234", BCrypt.gensalt()), null, null, "CLIENT");

        when(repository.findByEmail(client.getEmail())).thenReturn(Optional.of(existingClient));

        RuntimeException ex = assertThrows(RuntimeException.class,
                () -> clientService.inscrire(client));

        assertEquals("Email déjà utilisé", ex.getMessage());
    }

    // tests pour la connexion

    @Test
    void testConnexionSuccess() {
        String motDePasseClair = "1234";
        String motDePasseHash = BCrypt.hashpw(motDePasseClair, BCrypt.gensalt());
        
        Client client = new Client(1L, "Jihane", "jihane@gmail.com", motDePasseHash, null, null, "CLIENT");

        when(repository.findByEmail("jihane@gmail.com")).thenReturn(Optional.of(client));

        Optional<Client> result = clientService.connexion("jihane@gmail.com", motDePasseClair);

        assertTrue(result.isPresent());
    }

    @Test
    void testConnexionWrongPassword() {
        String motDePasseHash = BCrypt.hashpw("1234", BCrypt.gensalt());
        Client client = new Client(1L, "Jihane", "jihane@gmail.com", motDePasseHash, null, null, "CLIENT");

        when(repository.findByEmail("jihane@gmail.com")).thenReturn(Optional.of(client));

        Optional<Client> result = clientService.connexion("jihane@gmail.com", "wrongpassword");

        assertTrue(result.isEmpty());
    }

    @Test
    void testConnexionEmailNotFound() {
        when(repository.findByEmail("test@gmail.com")).thenReturn(Optional.empty());

        Optional<Client> result = clientService.connexion("test@gmail.com", "1234");

        assertTrue(result.isEmpty());
    }

    // test pour ancien mot de passe en clair

    @Test
    void testConnexionWithOldPlainPassword() {
        Client client = new Client(1L, "Jihane", "jihane@gmail.com", "1234", null, null, "CLIENT");

        when(repository.findByEmail("jihane@gmail.com")).thenReturn(Optional.of(client));
        when(repository.save(any(Client.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Optional<Client> result = clientService.connexion("jihane@gmail.com", "1234");

        assertTrue(result.isPresent());
        assertTrue(result.get().getMotDePasse().startsWith("$2a$"));
    }

    // tests pour recuperer tous les clients

    @Test
    void testGetAllClients() {
        List<Client> clients = List.of(
                new Client(1L, "A", "a@gmail.com", "hash1", null, null, "CLIENT"),
                new Client(2L, "B", "b@gmail.com", "hash2", null, null, "CLIENT")
        );

        when(repository.findAll()).thenReturn(clients);

        List<Client> result = clientService.getAllClients();

        assertEquals(2, result.size());
    }

    // tests pour recuperer un client par id

    @Test
    void testGetClientByIdExists() {
        Client client = new Client(1L, "A", "a@gmail.com", "hash", null, null, "CLIENT");

        when(repository.findById(1L)).thenReturn(Optional.of(client));

        Optional<Client> result = clientService.getClientById(1L);

        assertTrue(result.isPresent());
    }

    @Test
    void testGetClientByIdNotFound() {
        when(repository.findById(1L)).thenReturn(Optional.empty());

        Optional<Client> result = clientService.getClientById(1L);

        assertTrue(result.isEmpty());
    }

    // test pour getClientByEmail

    @Test
    void testGetClientByEmail() {
        Client client = new Client(1L, "A", "a@gmail.com", "hash", null, null, "CLIENT");

        when(repository.findByEmail("a@gmail.com")).thenReturn(Optional.of(client));

        Optional<Client> result = clientService.getClientByEmail("a@gmail.com");

        assertTrue(result.isPresent());
        assertEquals("a@gmail.com", result.get().getEmail());
    }

    // tests pour supprimer un client

    @Test
    void testDeleteClient() {
        Long id = 1L;

        doNothing().when(repository).deleteById(id);

        clientService.deleteClient(id);

        verify(repository, times(1)).deleteById(id);
    }
}
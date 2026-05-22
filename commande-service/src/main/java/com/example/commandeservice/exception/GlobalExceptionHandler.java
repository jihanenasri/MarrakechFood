package com.example.commandeservice.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.util.HashMap;
import java.util.Map;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String, String>> handleRuntimeException(RuntimeException ex) {
        Map<String, String> error = new HashMap<>();
        String message = ex.getMessage();
        error.put("error", message);
        
        if (message == null) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
        
        // verification pour client invalide (avec majuscule)
        if (message.contains("Client invalide") || message.contains("client invalide")) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
        
        // verification pour restaurant invalide
        if (message.contains("Restaurant invalide") || message.contains("restaurant invalide")) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
        
        // verification pour items obligatoires
        if (message.contains("Items obligatoires") || message.contains("items obligatoires")) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
        
        // verification pour commande non trouvee
        if (message.contains("Commande non trouvée") || message.contains("commande non trouvee")) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        }
        
        // verification pour commande ne peut pas etre validee
        if (message.contains("La commande ne peut pas être validée") || message.contains("ne peut pas etre validee")) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
        
        // verification pour commande doit etre validee avant d'assigner un livreur
        if (message.contains("doit être validée avant") || message.contains("doit etre validee avant")) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
        
        // verification pour commande pas en cours de livraison
        if (message.contains("n'est pas en cours de livraison") || message.contains("pas en cours de livraison")) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
        
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
    }
}
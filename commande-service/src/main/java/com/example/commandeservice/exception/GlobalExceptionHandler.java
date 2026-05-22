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
        error.put("error", ex.getMessage());
        
        String message = ex.getMessage();
        
        if (message != null && message.contains("client invalide")) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
        
        if (message != null && message.contains("restaurant invalide")) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
        
        if (message != null && message.contains("items obligatoires")) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
        
        if (message != null && message.contains("commande non trouvee")) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        }
        
        if (message != null && message.contains("ne peut pas etre validee")) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
        
        if (message != null && message.contains("doit etre validee avant")) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
        
        if (message != null && message.contains("pas en cours de livraison")) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
        
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
    }
}
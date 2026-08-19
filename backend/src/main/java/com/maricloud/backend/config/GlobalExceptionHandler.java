package com.maricloud.backend.config;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(IllegalStateException.class)
    public ResponseEntity<Map<String, String>> handleIllegalState(
            IllegalStateException exception
    ) {

        return ResponseEntity
                .status(HttpStatus.PAYLOAD_TOO_LARGE)
                .body(Map.of(
                        "error", "Storage limit exceeded",
                        "message", exception.getMessage()
                ));
    }
}

package com.notes_tracker.backend.application.integration;


import com.notes_tracker.backend.security.application.AuthenticationService;
import com.notes_tracker.backend.security.data.UserRepository;
import com.notes_tracker.backend.security.domain.User;
import com.notes_tracker.backend.security.presentation.exception.PasswordDoestNotMatchException;
import com.notes_tracker.backend.security.presentation.exception.UserAlreadyExistsByEmailException;
import com.notes_tracker.backend.security.presentation.request.RegisterRequest;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
public class AuthenticationServiceIntegrationTests {

    @Autowired
    private AuthenticationService authService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @AfterEach
    void cleanup() {
        userRepository.deleteAll();
    }

    @Test
    void shouldRegisterUserSuccessfully() {
        RegisterRequest request = new RegisterRequest(
                "Test User",
                "test@example.com",
                "password123",
                "password123"
        );

        User registeredUser = authService.register(request);

        assertNotNull(registeredUser.getId());
        assertEquals("test@example.com", registeredUser.getEmailAddress());
        assertTrue(passwordEncoder.matches("password123", registeredUser.getPassword()));
    }

    @Test
    void shouldThrowExceptionWhenPasswordsDoNotMatch() {
        RegisterRequest request = new RegisterRequest(
                "Test User",
                "test@example.com",
                "password123",
                "wrongPassword"
        );

        assertThrows(PasswordDoestNotMatchException.class, () -> authService.register(request));
    }

    @Test
    void shouldThrowExceptionWhenEmailAlreadyExists() {
        RegisterRequest request = new RegisterRequest(
                "User One",
                "duplicate@example.com",
                "password123",
                "password123"
        );
        authService.register(request);

        assertThrows(UserAlreadyExistsByEmailException.class, () -> authService.register(request));
    }

    @Test
    void shouldAuthenticateValidUser() {
        // Arrange: Register a user first
        String email = "auth@example.com";
        String password = "securePassword123";
        authService.register(new RegisterRequest("Auth User", email, password, password));

        // Act
        User authenticatedUser = authService.authenticate(email, password);

        // Assert
        assertNotNull(authenticatedUser);
        assertEquals(email, authenticatedUser.getEmailAddress());
    }

    @Test
    void shouldThrowExceptionForInvalidCredentials() {
        // Arrange
        String email = "login@example.com";
        authService.register(new RegisterRequest("User", email, "password123", "password123"));

        // Act & Assert
        assertThrows(BadCredentialsException.class, () ->
                authService.authenticate(email, "wrong-password")
        );
    }
}

package com.notes_tracker.backend.presentation;


import com.notes_tracker.backend.security.data.UserRepository;
import com.notes_tracker.backend.security.domain.User;
import com.notes_tracker.backend.security.presentation.request.AuthenticationRequest;
import com.notes_tracker.backend.security.presentation.request.RegisterRequest;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import tools.jackson.databind.ObjectMapper;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
public class AuthenticationControllerIntegrationTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private ObjectMapper objectMapper;

    @AfterEach
    void cleanup() {
        userRepository.deleteAll();
    }

    @Test
    void shouldRegisterUser() throws Exception {
        RegisterRequest request = new RegisterRequest(
                "John Doe",
                "john@example.com",
                "password123",
                "password123"
        );

        mockMvc.perform(post("/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").exists())
                .andExpect(jsonPath("$.displayName").value("John Doe"));
    }

    @Test
    void shouldAuthenticateUserAndReturnToken() throws Exception {
        // Arrange: Seed DB directly
        String email = "login@example.com";
        String password = "password123";

        userRepository.save(new User.Builder()
                .displayName("Login User")
                .emailAddress(email)
                .password(passwordEncoder.encode(password))
                .build());

        AuthenticationRequest loginRequest = new AuthenticationRequest(email, password);

        // Act & Assert
        // Matching your provided Body: {"token":"...","expiresIn":18000000,"user":{"id":"...","displayName":"Login User","photoURL":""}}
        mockMvc.perform(post("/auth")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").exists())
                .andExpect(jsonPath("$.expiresIn").value(18000000))
                .andExpect(jsonPath("$.user.id").exists())
                .andExpect(jsonPath("$.user.displayName").value("Login User"))
                .andExpect(jsonPath("$.user.photoURL").value(""));
    }

    @Test
    void shouldReturnUnauthorizedForWrongPassword() throws Exception {
        userRepository.save(new User.Builder()
                .displayName("User")
                .emailAddress("wrong@example.com")
                .password(passwordEncoder.encode("correctPassword"))
                .build());

        AuthenticationRequest wrongRequest = new AuthenticationRequest("wrong@example.com", "incorrect");

        mockMvc.perform(post("/auth")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(wrongRequest)))
                .andExpect(status().isForbidden());
    }

    @Test
    void shouldReturnBadRequestWhenPasswordsDoNotMatch() throws Exception {
        RegisterRequest request = new RegisterRequest(
                "John Doe",
                "john@example.com",
                "password123",
                "differentPassword"
        );

        mockMvc.perform(post("/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }
}

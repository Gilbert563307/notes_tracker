package com.notes_tracker.backend.presentation;

import com.notes_tracker.backend.kanboard.domain.Folder;
import com.notes_tracker.backend.security.data.UserRepository;
import com.notes_tracker.backend.security.domain.User;
import org.junit.jupiter.api.BeforeEach;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.security.test.context.support.WithUserDetails;
import tools.jackson.databind.ObjectMapper;
import com.notes_tracker.backend.kanboard.application.dto.FolderDto;
import com.notes_tracker.backend.kanboard.data.FolderRepository;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class FolderControllerIntegrationTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private FolderRepository repository;

    @Autowired
    private UserRepository userRepository;

    @AfterEach
    void cleanup() {
        repository.deleteAll();
        this.userRepository.deleteAll();
    }

    User savedUser;

    @BeforeEach
    void init() {
        this.savedUser = this.userRepository.save(new User.Builder()
                .displayName("mock-user")
                .emailAddress("john@example.com")

                .build());
    }

    @Test
    @WithMockUser("john@example.com")
    void createFolder() throws Exception {
        FolderDto request = new FolderDto(
                null,
                "Folder A",
                savedUser.getId(),
                "#44444",
                false,
                null,
                null
        );

        mockMvc.perform(post("/folder")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id", notNullValue()))
                .andExpect(jsonPath("$.name").value("Folder A"))
                .andExpect(jsonPath("$.userId").value(savedUser.getId()))
                .andExpect(jsonPath("$.color").value("#44444"))
                .andExpect(jsonPath("$.archived").value(false));
    }

    @Test
    @WithMockUser("john@example.com")
    void getFolderById() throws Exception {
        Folder created = this.repository.save( new Folder.Builder()
                .name("Folder A")
                .userId(savedUser.getId())
                .color("#4444")
                .build());

        mockMvc.perform(get("/folder/{id}", created.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(created.getId()))
                .andExpect(jsonPath("$.name").value("Folder A"));
    }

    @Test
    @WithMockUser("john@example.com")
    void updateFolder() throws Exception {

        Folder created = this.repository.save( new Folder.Builder()
                .name("My Folder")
                .userId(savedUser.getId())
                .color("#32222")
                .build());


        FolderDto update = new FolderDto(
                created.getId(),
                "Updated Name",
                savedUser.getId(),
                "#0000",
                true,
                null,
                null
        );

        mockMvc.perform(put("/folder")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(update)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Updated Name"))
                .andExpect(jsonPath("$.userId").value(savedUser.getId()))
                .andExpect(jsonPath("$.color").value("#0000"))
                .andExpect(jsonPath("$.archived").value(true));
    }

    @Test
    @WithMockUser("john@example.com")
    void deleteFolder() throws Exception {
        Folder created = this.repository.save( new Folder.Builder()
                .name("My Folder")
                .userId(savedUser.getId())
                .color("#44444")
                .build());

        mockMvc.perform(delete("/folder/{id}", created.getId()))
                .andExpect(status().isOk()); // your controller returns void

        //TODO fix
//        mockMvc.perform(get("/folder/{id}", created.id()))
//                .andExpect(status().is5xxServerError()); // or 404 if mapped properly
    }

}

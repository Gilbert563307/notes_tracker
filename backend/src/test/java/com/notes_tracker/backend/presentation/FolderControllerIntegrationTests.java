package com.notes_tracker.backend.presentation;

import com.notes_tracker.backend.kanboard.domain.Folder;
import org.springframework.security.test.context.support.WithMockUser;
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

    @AfterEach
    void cleanup() {
        repository.deleteAll();
    }

    @Test
    @WithMockUser(username = "admin", roles = {"USER", "ADMIN"})
    void createFolder() throws Exception {
        FolderDto request = new FolderDto(
                null,
                "Folder A",
                "user-1",
                "blue",
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
                .andExpect(jsonPath("$.userId").value("user-1"))
                .andExpect(jsonPath("$.color").value("blue"))
                .andExpect(jsonPath("$.archived").value(false));
    }

    @Test
    @WithMockUser(username = "admin", roles = {"USER", "ADMIN"})
    void getFolderById() throws Exception {
        Folder created = this.repository.save( new Folder.Builder()
                .name("Folder A")
                .userId("user-1")
                .color("blue")
                .build());

        mockMvc.perform(get("/folder/{id}", created.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(created.getId()))
                .andExpect(jsonPath("$.name").value("Folder A"));
    }

    @Test
    @WithMockUser(username = "admin", roles = {"USER", "ADMIN"})
    void updateFolder() throws Exception {

        Folder created = this.repository.save( new Folder.Builder()
                .name("My Folder")
                .userId("user-1")
                .color("blue")
                .build());


        FolderDto update = new FolderDto(
                created.getId(),
                "Updated Name",
                "user-2",
                "green",
                true,
                null,
                null
        );

        mockMvc.perform(put("/folder")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(update)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Updated Name"))
                .andExpect(jsonPath("$.userId").value("user-2"))
                .andExpect(jsonPath("$.color").value("green"))
                .andExpect(jsonPath("$.archived").value(true));
    }

    @Test
    @WithMockUser(username = "admin", roles = {"USER", "ADMIN"})
    void deleteFolder() throws Exception {
        Folder created = this.repository.save( new Folder.Builder()
                .name("My Folder")
                .userId("user-1")
                .color("blue")
                .build());

        mockMvc.perform(delete("/folder/{id}", created.getId()))
                .andExpect(status().isOk()); // your controller returns void

        //TODO fix
//        mockMvc.perform(get("/folder/{id}", created.id()))
//                .andExpect(status().is5xxServerError()); // or 404 if mapped properly
    }

}

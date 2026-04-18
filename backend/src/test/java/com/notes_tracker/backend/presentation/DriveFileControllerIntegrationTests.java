package com.notes_tracker.backend.presentation;


import com.notes_tracker.backend.kanboard.application.dto.DriveFileDto;
import com.notes_tracker.backend.kanboard.data.DriveFileRepository;
import com.notes_tracker.backend.kanboard.domain.DriveFile;
import tools.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.hamcrest.Matchers.notNullValue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class DriveFileControllerIntegrationTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private DriveFileRepository repository;

    @AfterEach
    void cleanup() {
        repository.deleteAll();
    }

    @Test
    @WithMockUser(username = "user-1", roles = {"USER"})
    void createFile() throws Exception {
        DriveFileDto request = new DriveFileDto(
                null,
                "file.pdf",
                "user-1",
                "100",
                "PDF",
                false,
                null,
                null
        );

        mockMvc.perform(post("/drivefile")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id", notNullValue()))
                .andExpect(jsonPath("$.name").value("file.pdf"))
                .andExpect(jsonPath("$.userId").value("user-1"))
                .andExpect(jsonPath("$.size").value("100"))
                .andExpect(jsonPath("$.type").value("PDF"))
                .andExpect(jsonPath("$.archived").value(false));
    }

    @Test
    @WithMockUser(username = "user-1", roles = {"USER"})
    void getFileById() throws Exception {
        // Arrange: Seed database directly via repository
        DriveFile saved = repository.save(new DriveFile.Builder()
                .name("file.pdf")
                .userId("user-1")
                .size("100")
                .type("PDF")
                .build());

        // Act & Assert
        mockMvc.perform(get("/drivefile/{id}", saved.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(saved.getId()))
                .andExpect(jsonPath("$.name").value("file.pdf"));
    }

    @Test
    @WithMockUser(username = "user-1", roles = {"USER"})
    void updateFile() throws Exception {
        DriveFile saved = repository.save(new DriveFile.Builder()
                .name("file.pdf")
                .userId("user-1")
                .size("100")
                .type("PDF")
                .build());

        DriveFileDto update = new DriveFileDto(
                saved.getId(),
                "updated.pdf",
                "user-2",
                "200",
                "PDF",
                true,
                null,
                null
        );

        mockMvc.perform(put("/drivefile")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(update)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("updated.pdf"))
                .andExpect(jsonPath("$.userId").value("user-2"))
                .andExpect(jsonPath("$.size").value("200"))
                .andExpect(jsonPath("$.archived").value(true));
    }

    @Test
    @WithMockUser(username = "user-1", roles = {"USER"})
    void deleteFile() throws Exception {
        DriveFile saved = repository.save(new DriveFile.Builder()
                .name("file.pdf")
                .userId("user-1")
                .size("100")
                .type("PDF")
                .build());


        mockMvc.perform(delete("/drivefile/{id}", saved.getId()))
                .andExpect(status().isOk());

//        mockMvc.perform(get("/driveFile/{id}", created.id()))
//                .andExpect(status().isNotFound());
    }

}

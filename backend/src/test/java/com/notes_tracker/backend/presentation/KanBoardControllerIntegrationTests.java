package com.notes_tracker.backend.presentation;


import tools.jackson.databind.ObjectMapper;
import com.notes_tracker.backend.kanboard.application.dto.KanBoardDto;
import com.notes_tracker.backend.kanboard.data.KanBoardRepository;
import com.notes_tracker.backend.kanboard.domain.KanBoard;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
public class KanBoardControllerIntegrationTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private KanBoardRepository repository;

    @Autowired
    private ObjectMapper objectMapper;

    @AfterEach
    void cleanup() {
        repository.deleteAll();
    }

    @Test
    @WithMockUser(username = "user-1", roles = {"USER"})
    void createBoard() throws Exception {
        KanBoardDto dto = new KanBoardDto(
                null, "New Board", "user-1", "green", false, true, "img.png", null, null
        );

        mockMvc.perform(post("/kanBoard")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").exists())
                .andExpect(jsonPath("$.name").value("New Board"))
                .andExpect(jsonPath("$.color").value("green"))
                .andExpect(jsonPath("$.collaborative").value(true));
    }

    @Test
    @WithMockUser(username = "user-1", roles = {"USER"})
    void getBoardById() throws Exception {
        KanBoard saved = repository.save(new KanBoard.Builder()
                .name("Persistent Board")
                .userId("user-1")
                .color("purple")
                .build());

        mockMvc.perform(get("/kanBoard/" + saved.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(saved.getId()))
                .andExpect(jsonPath("$.name").value("Persistent Board"))
                .andExpect(jsonPath("$.color").value("purple"));
    }

    @Test
    @WithMockUser(username = "user-1", roles = {"USER"})
    void updateBoard() throws Exception {
        KanBoard saved = repository.save(new KanBoard.Builder()
                .name("Old Name")
                .userId("user-1")
                .build());

        KanBoardDto updateDto = new KanBoardDto(
                saved.getId(), "Updated Name", "user-1", "blue", true, true, "new-img.png", null, null
        );

        mockMvc.perform(put("/kanBoard")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateDto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Updated Name"))
                .andExpect(jsonPath("$.archived").value(true));
    }

    @Test
    @WithMockUser(username = "user-1", roles = {"USER"})
    void deleteBoard() throws Exception {
        KanBoard saved = repository.save(new KanBoard.Builder()
                .name("To Be Deleted")
                .userId("user-1")
                .build());

        mockMvc.perform(delete("/kanBoard/" + saved.getId()))
                .andExpect(status().isOk());

        assertFalse(repository.findById(saved.getId()).isPresent());
    }

    @Test
    @WithMockUser(username = "user-1", roles = {"USER"})
    void getBoardsWithPagination() throws Exception {
        repository.save(new KanBoard.Builder().name("Board 1").userId("user-1").build());
        repository.save(new KanBoard.Builder().name("Board 2").userId("user-1").build());

        mockMvc.perform(get("/kanBoard")
                        .param("page", "0")
                        .param("size", "10"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content.length()").value(2))
                .andExpect(jsonPath("$.totalElements").value(2));
    }

    @Test
    void shouldReturnUnauthorizedWhenNoUser() throws Exception {
        mockMvc.perform(get("/kanBoard"))
                .andExpect(status().isForbidden()); // Or isForbidden() depending on your SecurityConfig
    }
}

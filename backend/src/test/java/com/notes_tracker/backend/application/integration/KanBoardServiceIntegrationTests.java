package com.notes_tracker.backend.application.integration;


import com.notes_tracker.backend.kanboard.application.KanBoardService;
import com.notes_tracker.backend.kanboard.application.dto.KanBoardDto;
import com.notes_tracker.backend.kanboard.data.KanBoardRepository;
import com.notes_tracker.backend.kanboard.presentation.exception.ResourceNotFoundException;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
public class KanBoardServiceIntegrationTests {

    @Autowired
    KanBoardService kanBoardService;

    @Autowired
    KanBoardRepository repository;

    @AfterEach
    void cleanup() {
        repository.deleteAll();
    }

    @Test
    void createBoard() {
        KanBoardDto dto = new KanBoardDto(
                null,
                "Board A",
                "user-1",
                "blue",
                false,
                true,
                "img.png",
                null,
                null
        );

        KanBoardDto result = kanBoardService.createBoard(dto);

        assertNotNull(result.id());
        assertEquals("Board A", result.name());
        assertEquals("user-1", result.userId());
        assertEquals("blue", result.color());
        assertEquals("img.png", result.imageUrl());
        assertFalse(result.archived());
        assertTrue(result.collaborative());

        assertNotNull(result.createdAt());
        assertNotNull(result.updatedAt());
    }

    @Test
    void updateAndPersistBoard() {
        KanBoardDto created = kanBoardService.createBoard(new KanBoardDto(
                null, "Old", "user-1", "red", false, false, "img", null, null
        ));

        kanBoardService.updateBoard(new KanBoardDto(
                created.id(),
                "Updated",
                "user-2",
                "blue",
                true,
                true,
                "img2",
                null,
                null
        ));

        KanBoardDto fetched = kanBoardService.getBoard(created.id());

        assertEquals("Updated", fetched.name());
        assertEquals("user-2", fetched.userId());
        assertEquals("blue", fetched.color());
        assertEquals("img2", fetched.imageUrl());
        assertTrue(fetched.archived());
        assertTrue(fetched.collaborative());

        assertNotNull(fetched.createdAt());
        assertNotNull(fetched.updatedAt());
    }

    @Test
    void getBoardById() {
        KanBoardDto created = kanBoardService.createBoard(new KanBoardDto(
                null,
                "Board A",
                "user-1",
                "blue",
                false,
                true,
                "img.png",
                null,
                null
        ));

        KanBoardDto fetched = kanBoardService.getBoard(created.id());

        assertNotNull(fetched);

        assertEquals(created.id(), fetched.id());
        assertEquals("Board A", fetched.name());
        assertEquals("user-1", fetched.userId());
        assertEquals("blue", fetched.color());
        assertEquals("img.png", fetched.imageUrl());
        assertFalse(fetched.archived());
        assertTrue(fetched.collaborative());

        assertNotNull(fetched.createdAt());
        assertNotNull(fetched.updatedAt());
    }

    @Test
    void deleteBoard() {
        KanBoardDto created = kanBoardService.createBoard(new KanBoardDto(
                null,
                "Board A",
                "user-1",
                "blue",
                false,
                true,
                "img.png",
                null,
                null
        ));

        kanBoardService.deleteBoard(created.id());

        assertThrows(ResourceNotFoundException.class, () -> {
            kanBoardService.getBoard(created.id());
        });
    }
}

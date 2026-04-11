package com.notes_tracker.backend.application.integration;


import com.notes_tracker.backend.kanboard.application.DriveFileService;
import com.notes_tracker.backend.kanboard.application.dto.DriveFileDto;
import com.notes_tracker.backend.kanboard.data.DriveFileRepository;
import com.notes_tracker.backend.kanboard.presentation.exception.ResourceNotFoundException;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
public class DriveFileServiceIntegrationTests {

    @Autowired
    DriveFileService driveFileService;

    @Autowired
    DriveFileRepository repository;

    @AfterEach
    void cleanup() {
        repository.deleteAll();
    }

    @Test
    void createFile() {
        DriveFileDto dto = new DriveFileDto(
                null,
                "file.pdf",
                "folder-1",
                "user-1",
                "100",
                "PDF",
                false,
                null,
                null
        );

        DriveFileDto result = driveFileService.createFile(dto);

        assertNotNull(result.id());
        assertEquals("file.pdf", result.name());
        assertEquals("folder-1", result.folderId());
        assertEquals("user-1", result.userId());
        assertEquals("100", result.size());
        assertEquals("PDF", result.type());
        assertFalse( result.archived());
    }

    @Test
    void updateAndPersistFile() {
        DriveFileDto created = driveFileService.createFile(new DriveFileDto(
                null, "old.pdf", "folder-1", "user-1",
                "100", "PDF", false, null, null
        ));

        driveFileService.updateFile(new DriveFileDto(
                created.id(),
                "new.pdf",
                "folder-2",
                "user-2",
                "200",
                "PDF",
                true,
                null,
                null
        ));

        DriveFileDto fetched = driveFileService.getFile(created.id());

        assertEquals("new.pdf", fetched.name());
        assertTrue(fetched.archived());
        assertEquals("folder-2", fetched.folderId());
        assertEquals("user-2", fetched.userId());
        assertEquals("200", fetched.size());
        assertEquals("PDF", fetched.type());
    }

    @Test
    void getFileById() {
        DriveFileDto created = driveFileService.createFile(new DriveFileDto(
                null,
                "file.pdf",
                "folder-1",
                "user-1",
                "100",
                "PDF",
                false,
                null,
                null
        ));

        DriveFileDto fetched = driveFileService.getFile(created.id());

        assertNotNull(fetched);
        assertEquals("file.pdf", fetched.name());
        assertEquals("folder-1", fetched.folderId());
        assertEquals("user-1", fetched.userId());
        assertEquals("100", fetched.size());
        assertEquals("PDF", fetched.type());
        assertFalse(fetched.archived());
    }

    @Test
    void deleteFile() {
        DriveFileDto created = driveFileService.createFile(new DriveFileDto(
                null,
                "file.pdf",
                "folder-1",
                "user-1",
                "100",
                "PDF",
                false,
                null,
                null
        ));

        driveFileService.deleteFile(created.id());

        assertThrows(ResourceNotFoundException.class, () -> {
            driveFileService.getFile(created.id());
        });
    }
}

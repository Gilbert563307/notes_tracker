package com.notes_tracker.backend.application.integration;


import com.notes_tracker.backend.kanboard.application.DriveFileService;
import com.notes_tracker.backend.kanboard.application.dto.DriveFileDto;
import com.notes_tracker.backend.kanboard.data.DriveFileRepository;
import com.notes_tracker.backend.kanboard.presentation.exception.ResourceNotFoundException;
import com.notes_tracker.backend.security.application.UserService;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.core.Authentication;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

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
    @WithMockUser(username = "user-1", roles = {"USER"})
    void createFile() {
        DriveFileDto dto = new DriveFileDto(
                null,
                "file.pdf",
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
        assertEquals("user-1", result.userId());
        assertEquals("100", result.size());
        assertEquals("PDF", result.type());
        assertFalse( result.archived());
    }

    @Test
    void updateAndPersistFile() {
        DriveFileDto created = driveFileService.createFile(new DriveFileDto(
                null, "old.pdf", "user-1",
                "100", "PDF", false, null, null
        ));

        driveFileService.updateFile(new DriveFileDto(
                created.id(),
                "new.pdf",
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
//        assertEquals("folder-2", fetched.folderId());
        assertEquals("user-2", fetched.userId());
        assertEquals("200", fetched.size());
        assertEquals("PDF", fetched.type());
    }

    @Test
    void getFileById() {
        DriveFileDto created = driveFileService.createFile(new DriveFileDto(
                null,
                "file.pdf",
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

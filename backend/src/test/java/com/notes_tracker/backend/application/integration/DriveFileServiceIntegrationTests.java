package com.notes_tracker.backend.application.integration;



import com.notes_tracker.backend.kanboard.application.DriveFileService;
import com.notes_tracker.backend.kanboard.application.dto.DriveFileDto;
import com.notes_tracker.backend.kanboard.data.DriveFileRepository;
import com.notes_tracker.backend.kanboard.presentation.exception.ResourceNotFoundException;
import com.notes_tracker.backend.security.data.UserRepository;
import com.notes_tracker.backend.security.domain.User;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;


import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
//https://docs.spring.io/spring-security/reference/servlet/test/method.html
public class DriveFileServiceIntegrationTests {

    @Autowired
    DriveFileService driveFileService;

    @Autowired
    DriveFileRepository repository;

    @Autowired
    UserRepository userRepository;


    @AfterEach
    void cleanup() {
        this.repository.deleteAll();
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
    void createFile() {
        DriveFileDto dto = new DriveFileDto(
                null,
                "file.pdf",
                this.savedUser.getId(),
                "100",
                "PDF",
                false,
                null,
                null
        );

        DriveFileDto result = driveFileService.createFile(dto);

        assertNotNull(result.id());
        assertEquals("file.pdf", result.name());
        assertEquals( this.savedUser.getId(), result.userId());
        assertEquals("100", result.size());
        assertEquals("PDF", result.type());
        assertFalse(result.archived());
    }

    @Test
    @WithMockUser("john@example.com")
    void updateAndPersistFile() {
        DriveFileDto created = driveFileService.createFile(new DriveFileDto(
                null, "old.pdf",  this.savedUser.getId(),
                "100", "PDF", false, null, null
        ));

        driveFileService.updateFile(new DriveFileDto(
                created.id(),
                "new.pdf",
                this.savedUser.getId(),
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
        assertEquals( this.savedUser.getId(), fetched.userId());
        assertEquals("200", fetched.size());
        assertEquals("PDF", fetched.type());
    }

    @Test
    @WithMockUser("john@example.com")
    void getFileById() {
        DriveFileDto created = driveFileService.createFile(new DriveFileDto(
                null,
                "file.pdf",
                this.savedUser.getId(),
                "100",
                "PDF",
                false,
                null,
                null
        ));

        DriveFileDto fetched = driveFileService.getFile(created.id());

        assertNotNull(fetched);
        assertEquals("file.pdf", fetched.name());
        assertEquals( this.savedUser.getId(), fetched.userId());
        assertEquals("100", fetched.size());
        assertEquals("PDF", fetched.type());
        assertFalse(fetched.archived());
    }

    @Test
    @WithMockUser("john@example.com")
    void deleteFile() {
        DriveFileDto created = driveFileService.createFile(new DriveFileDto(
                null,
                "file.pdf",
                this.savedUser.getId(),
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

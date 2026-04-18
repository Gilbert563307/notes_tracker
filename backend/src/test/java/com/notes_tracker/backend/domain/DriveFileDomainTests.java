package com.notes_tracker.backend.domain;


import com.notes_tracker.backend.kanboard.domain.DriveFile;
import com.notes_tracker.backend.kanboard.presentation.exception.DomainException;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

public class DriveFileDomainTests {

    @Test
    void shouldBuildValidFile() {
        DriveFile file = new DriveFile.Builder()
                .name("file.pdf")
                .userId("user-1")
                .size("1024")
                .type("PDF")
                .build();

        assertNotNull(file);
        assertEquals("file.pdf", file.getName());
        assertEquals("user-1", file.getUserId());
        assertEquals("1024", file.getSize());
        assertEquals("PDF", file.getType());
        assertNotNull(file.getCreatedAt());
    }


    @Test
    void shouldUpdateFile() {
        DriveFile file = new DriveFile.Builder()
                .name("old.pdf")
                .userId("user")
                .size("100")
                .type("PDF")
                .build();

        file.update("new.pdf", "2", "200", "PDF", true);

        assertEquals("new.pdf", file.getName());
        assertTrue(file.isArchived());
    }

    @Test
    void shouldThrowWhenFileTooLarge() {
        assertThrows(DomainException.class, () -> {
            new DriveFile.Builder()
                    .name("file.pdf")
                    .userId("user")
                    .size(String.valueOf(200 * 1024 * 1024)) // 200MB
                    .type("PDF")
                    .build();
        });
    }

    @Test
    void shouldThrowWhenTypeInvalid() {
        assertThrows(DomainException.class, () -> {
            new DriveFile.Builder()
                    .name("file.exe")
                    .userId("user")
                    .size("100")
                    .type("EXE")
                    .build();
        });
    }

    @Test
    void shouldThrowWhenNameInvalid(){
        assertThrows(DomainException.class, () -> {
            new DriveFile.Builder()
                    .name(null)
                    .userId("user")
                    .size("100")
                    .type("PDF")
                    .build();
        });
    }

    @Test
    void shouldThrowWhenUserIdInvalid(){
        assertThrows(DomainException.class, () -> {
            new DriveFile.Builder()
                    .name("drive")
                    .userId(null)
                    .size("100")
                    .type("PDF")
                    .build();
        });
    }

    @Test
    void shouldThrowWhenSizeIsInvalid(){
        assertThrows(DomainException.class, () -> {
            new DriveFile.Builder()
                    .name("drive")
                    .userId("user-1")
                    .size(null)
                    .type("PDF")
                    .build();
        });
    }

}

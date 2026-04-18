package com.notes_tracker.backend.domain;

import com.notes_tracker.backend.kanboard.domain.DriveFile;
import com.notes_tracker.backend.kanboard.domain.Folder;
import com.notes_tracker.backend.kanboard.presentation.exception.DomainException;
import org.junit.jupiter.api.Test;

import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

public class FolderDomainTests {

    private final DriveFile driveFile = new DriveFile.Builder().name("file.pdf")
            .userId("user-1")
            .size("1024")
            .type("PDF")
            .build();

    @Test
    void shouldBuildValidFolder() {
        Folder folder = new Folder.Builder()
                .name("My Folder")
                .userId("user-1")
                .color("#33333")
                .archived(true)
                .files(List.of(driveFile))
                .build();

        assertNotNull(folder);
        assertEquals("My Folder", folder.getName());
        assertEquals("user-1", folder.getUserId());
        assertEquals("#33333", folder.getColor());
        assertTrue(folder.isArchived());
        assertEquals(1, folder.getDriveFiles().size());
        assertNotNull(folder.getCreatedAt());
    }

    @Test
    void shouldUpdateFolder() {
        Folder folder = new Folder.Builder()
                .name("My Folder")
                .userId("user-1")
                .color("#33333")
                .archived(false)
                .build();

        folder.update("New", "user2", "#11111", true);
        assertEquals("New", folder.getName());
        assertEquals("#11111", folder.getColor());
        assertTrue(folder.isArchived());
    }

    @Test
    void shouldThrowWhenUserIdIsInvalid(){
        DomainException exception =   assertThrows(DomainException.class, () -> {
            new Folder.Builder()
                    .name("My Folder")
                    .color("#33333")
                    .archived(true)
                    .files(List.of(driveFile))
                    .build();
        });
        String actualMessage = exception.getMessage();
        assertTrue(actualMessage.contains("User information is missing or invalid."));
    }

    @Test
    void shouldThrowWhenNameIdIsInvalid(){
        DomainException exception =   assertThrows(DomainException.class, () -> {
            new Folder.Builder()
                    .userId("user-1")
                    .color("#33333")
                    .archived(true)
                    .files(List.of(driveFile))
                    .build();
        });
        assertTrue(exception.getMessage().contains("Please enter a name for the folder."));
    }

    @Test
    void shouldThrowWhenNameIsToLongIsInvalid(){
        DomainException exception =   assertThrows(DomainException.class, () -> {
            new Folder.Builder()
                    .name("THIS STRING IS 256 CHARACTERS xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx")
                    .userId("user-1")
                    .color("#33333")
                    .archived(true)
                    .files(List.of(driveFile))
                    .build();
        });
        assertTrue(exception.getMessage().contains("Folder name is too long."));
    }

    @Test
    void shouldThrowWhenColourIdIsInvalid(){
        DomainException exception =   assertThrows(DomainException.class, () -> {
            new Folder.Builder()
                    .name("name")
                    .userId("user-1")
                    .color("colour")
                    .archived(true)
                    .files(List.of(driveFile))
                    .build();
        });
        assertTrue(exception.getMessage().contains("Folder colour is invalid must be of hex code."));
    }

}

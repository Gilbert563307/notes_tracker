package com.notes_tracker.backend.application;


import com.notes_tracker.backend.kanboard.application.DriveFileService;
import com.notes_tracker.backend.kanboard.application.dto.DriveFileDto;
import com.notes_tracker.backend.kanboard.data.DriveFileRepository;
import com.notes_tracker.backend.kanboard.domain.DriveFile;
import com.notes_tracker.backend.security.application.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class DriveFileServiceTests {
    private final DriveFileRepository repo = mock(DriveFileRepository.class);
    private final UserService userService = mock(UserService.class);
    private final DriveFileService service = new DriveFileService(this.repo, this.userService);

    @BeforeEach
    void init(){
        when(userService.getUserIdByAuthentication()).thenReturn("user-1");
    }

    @Test
    void createFile() {
        DriveFile file = new DriveFile.Builder()
                .name("file.pdf")
                .userId("user-1")
                .size("100")
                .type("PDF")
                .build();

        when(repo.save(any())).thenReturn(file);
        DriveFileDto result = service.createFile(DriveFileDto.from(file));
        assertEquals("file.pdf", result.name());
    }

    @Test
    void getFile(){
        DriveFile file = new DriveFile.Builder()
                .name("file.pdf")
                .userId("user-1")
                .size("100")
                .type("PDF")
                .build();

        when(repo.findById("file01")).thenReturn(Optional.ofNullable(file));
        DriveFileDto result = service.getFile("file01");
        assertEquals("file.pdf", result.name());
    }

    @Test
    void updateFile() {
        DriveFile file = new DriveFile.Builder()
                .name("old.pdf")
                .userId("user-1")
                .size("100")
                .type("PDF")
                .build();

        when(repo.findById("1")).thenReturn(Optional.of(file));
        when(repo.save(any())).thenAnswer(i -> i.getArgument(0));

        DriveFileDto updated = service.updateFile(
                new DriveFileDto(
                        "1",
                        "file.pdf",
                        "user-1",
                        "1024",
                        "PDF",
                        false,
                        null,
                        null
                )
        );

        assertEquals("file.pdf", updated.name());
        assertEquals("user-1", updated.userId());
        assertEquals("1024", updated.size());
        assertEquals("PDF", updated.type());
        assertFalse(updated.archived());
    }

    @Test
    void getAllFiles(){
        Pageable pageable = PageRequest.of(1, 1);
        Page<DriveFile> driveFilesPageImpl = new PageImpl<>(List.of(new DriveFile(), new DriveFile()));

        when(repo.findAllByUserId("user-1",pageable)).thenReturn(driveFilesPageImpl);
        Page<DriveFileDto> driveFileDtos = service.getFiles(pageable);
        assertEquals(2, driveFileDtos.getTotalElements());
    }

}

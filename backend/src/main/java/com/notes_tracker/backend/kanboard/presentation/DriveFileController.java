package com.notes_tracker.backend.kanboard.presentation;

import com.notes_tracker.backend.kanboard.application.DriveFileService;
import com.notes_tracker.backend.kanboard.application.dto.DriveFileDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/drivefile")
public class DriveFileController {

    private final DriveFileService driveFileService;

    public DriveFileController(DriveFileService driveFileService) {
        this.driveFileService = driveFileService;
    }

    @GetMapping
    public ResponseEntity<Page<DriveFileDto>> getFiles(Pageable pageable, Authentication authentication) {
        return ResponseEntity.ok(driveFileService.getFiles(pageable, authentication));
    }

    @PostMapping
    public ResponseEntity<DriveFileDto> createFile(@RequestBody DriveFileDto dto, Authentication authentication) {
        DriveFileDto created = driveFileService.createFile(dto, authentication);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @GetMapping("/{fileId}")
    public ResponseEntity<DriveFileDto> getFile(@PathVariable String fileId,Authentication authentication) {
        return ResponseEntity.ok(driveFileService.getFile(fileId, authentication));
    }

    @PutMapping
    public ResponseEntity<DriveFileDto> updateFile(@RequestBody DriveFileDto dto, Authentication authentication) {
        return ResponseEntity.ok(driveFileService.updateFile(dto, authentication));
    }

    @DeleteMapping("/{fileId}")
    public void deleteFile(@PathVariable String fileId, Authentication authentication) {
        driveFileService.deleteFile(fileId, authentication);
    }
}
package com.notes_tracker.backend.kanboard.presentation;

import com.notes_tracker.backend.kanboard.application.DriveFileService;
import com.notes_tracker.backend.kanboard.application.dto.DriveFileDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/driveFile")
public class DriveFileController {

    private final DriveFileService driveFileService;

    public DriveFileController(DriveFileService driveFileService) {
        this.driveFileService = driveFileService;
    }

    @GetMapping
    public ResponseEntity<Page<DriveFileDto>> getFiles(Pageable pageable) {
        return ResponseEntity.ok(driveFileService.getFiles(pageable));
    }

    @PostMapping
    public ResponseEntity<DriveFileDto> createFile(@RequestBody DriveFileDto dto) {
        DriveFileDto created = driveFileService.createFile(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @GetMapping("/{fileId}")
    public ResponseEntity<DriveFileDto> getFile(@PathVariable String fileId) {
        return ResponseEntity.ok(driveFileService.getFile(fileId));
    }

    @PutMapping
    public ResponseEntity<DriveFileDto> updateFile(@RequestBody DriveFileDto dto) {
        return ResponseEntity.ok(driveFileService.updateFile(dto));
    }

    @DeleteMapping("/{fileId}")
    public void deleteFile(@PathVariable String fileId) {
        driveFileService.deleteFile(fileId);
    }
}
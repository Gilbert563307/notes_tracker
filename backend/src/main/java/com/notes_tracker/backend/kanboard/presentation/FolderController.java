package com.notes_tracker.backend.kanboard.presentation;

import com.notes_tracker.backend.kanboard.application.FolderService;
import com.notes_tracker.backend.kanboard.application.dto.FolderDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/folder")
public class FolderController {

    private final FolderService folderService;

    public FolderController(FolderService folderService) {
        this.folderService = folderService;
    }

    @GetMapping
    public ResponseEntity<Page<FolderDto>> getFolders(Pageable pageable) {
        return ResponseEntity.ok(folderService.getFolders(pageable));
    }

    @PostMapping
    public ResponseEntity<FolderDto> createFolder(@RequestBody FolderDto dto) {
        FolderDto created = folderService.createFolder(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @GetMapping("/{folderId}")
    public ResponseEntity<FolderDto> getFolder(@PathVariable String folderId) {
        return ResponseEntity.ok(folderService.getFolder(folderId));
    }

    @PutMapping
    public ResponseEntity<FolderDto> updateFolder(@RequestBody FolderDto dto) {
        return ResponseEntity.ok(folderService.updateFolder(dto));
    }

    @DeleteMapping("/{folderId}")
    public void deleteFolder(@PathVariable String folderId) {
        folderService.deleteFolder(folderId);
    }
}
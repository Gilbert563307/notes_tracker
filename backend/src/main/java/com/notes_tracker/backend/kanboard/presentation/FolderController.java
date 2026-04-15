package com.notes_tracker.backend.kanboard.presentation;

import com.notes_tracker.backend.kanboard.application.FolderService;
import com.notes_tracker.backend.kanboard.application.dto.FolderDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/folder")
public class FolderController {

    private final FolderService folderService;

    public FolderController(FolderService folderService) {
        this.folderService = folderService;
    }

    @GetMapping
    public ResponseEntity<Page<FolderDto>> getFolders(Pageable pageable, Authentication authentication) {
        return ResponseEntity.ok(folderService.getFolders(pageable,authentication));
    }

    @PostMapping
    public ResponseEntity<FolderDto> createFolder(@RequestBody FolderDto dto, Authentication authentication) {
        FolderDto created = folderService.createFolder(dto,authentication);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @GetMapping("/{folderId}")
    public ResponseEntity<FolderDto> getFolder(@PathVariable String folderId, Authentication authentication) {
        return ResponseEntity.ok(folderService.getFolder(folderId,authentication));
    }

    @PutMapping
    public ResponseEntity<FolderDto> updateFolder(@RequestBody FolderDto dto, Authentication authentication) {
        return ResponseEntity.ok(folderService.updateFolder(dto,authentication));
    }

    @DeleteMapping("/{folderId}")
    public void deleteFolder(@PathVariable String folderId, Authentication authentication) {
        folderService.deleteFolder(folderId,authentication);
    }
}
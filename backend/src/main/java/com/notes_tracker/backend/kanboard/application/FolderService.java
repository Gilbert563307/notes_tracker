package com.notes_tracker.backend.kanboard.application;

import com.notes_tracker.backend.kanboard.application.dto.FolderDto;
import com.notes_tracker.backend.kanboard.data.DriveFileRepository;
import com.notes_tracker.backend.kanboard.data.FolderRepository;
import com.notes_tracker.backend.kanboard.domain.DriveFile;
import com.notes_tracker.backend.kanboard.domain.Folder;
import com.notes_tracker.backend.kanboard.presentation.exception.ResourceNotFoundException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class FolderService {

    private final FolderRepository folderRepository;
    private final DriveFileRepository driveFileRepository;

    public FolderService(FolderRepository folderRepository, DriveFileRepository driveFileRepository) {
        this.folderRepository = folderRepository;
        this.driveFileRepository = driveFileRepository;
    }

    public Page<FolderDto> getFolders(Pageable pageable) {
        return folderRepository.findAll(pageable)
                .map(FolderDto::from);
    }

    public FolderDto createFolder(FolderDto dto) {
        Folder folder = folderRepository.save(dto.toDomain());
        return FolderDto.from(folder);
    }

    public FolderDto getFolder(String folderId) {
        Folder folder = getFolderById(folderId);
        return FolderDto.from(folder);
    }

    public void assignDriveFileToFolder(String folderId, String driveFileId){
        Folder folder = this.getFolderById(folderId);
        folder.addDriveFileToFolder(this.getDriveFileById(driveFileId));
    }

    public FolderDto updateFolder(FolderDto dto) {
        Folder folder = getFolderById(dto.id());
        folder.update(
                dto.name(),
                dto.userId(),
                dto.color(),
                dto.archived()
        );

        folderRepository.save(folder);
        return FolderDto.from(folder);
    }

    public void deleteFolder(String folderId) {
        folderRepository.deleteById(folderId);
    }

    private Folder getFolderById(String folderId) {
        return folderRepository.findById(folderId)
                .orElseThrow(() -> new ResourceNotFoundException("Folder not found"));
    }

    private DriveFile getDriveFileById( String driveFileId){
        return driveFileRepository.findById(driveFileId)
                .orElseThrow(() -> new ResourceNotFoundException("Folder not found"));
    }
}
package com.notes_tracker.backend.kanboard.data;

import com.notes_tracker.backend.kanboard.domain.Folder;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FolderRepository extends MongoRepository<Folder, String> {
    Page<Folder> findAllByUserId(String userId, Pageable pageable);
    Folder findFolderByIdAndUserId(String id, String userId);
    void deleteFolderByIdAndUserId(String id, String userId);
}

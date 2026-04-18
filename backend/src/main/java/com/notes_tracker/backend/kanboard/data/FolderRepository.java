package com.notes_tracker.backend.kanboard.data;

import com.notes_tracker.backend.kanboard.domain.Folder;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FolderRepository extends MongoRepository<Folder, String> {
    Page<Folder> findAllByUserId(String userId, Pageable pageable);
    long deleteByIdInAndUserId(List<String> ids, String userId);
}

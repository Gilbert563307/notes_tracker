package com.notes_tracker.backend.kanboard.data;

import com.notes_tracker.backend.kanboard.domain.Folder;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface FolderRepository extends MongoRepository<Folder, String> {
}

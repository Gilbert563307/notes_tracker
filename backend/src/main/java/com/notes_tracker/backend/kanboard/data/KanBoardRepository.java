package com.notes_tracker.backend.kanboard.data;

import com.notes_tracker.backend.kanboard.domain.KanBoard;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface KanBoardRepository extends MongoRepository<KanBoard, String> {
}

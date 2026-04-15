package com.notes_tracker.backend.kanboard.data;

import com.notes_tracker.backend.kanboard.domain.KanBoard;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface KanBoardRepository extends MongoRepository<KanBoard, String> {
    Page<KanBoard> findAllByUserId(String userId, Pageable pageable);
    KanBoard findKanBoardByIdAndUserId(String id, String userId);
    void deleteKanBoardByIdAndUserId(String id, String userId);
}

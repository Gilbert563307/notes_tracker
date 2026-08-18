package com.notes_tracker.backend.kanboard.data;

import java.util.List;
import java.util.Optional;

import com.notes_tracker.backend.kanboard.domain.Task;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;

import com.notes_tracker.backend.kanboard.domain.KanBoard;

public interface KanBoardRepository extends MongoRepository<KanBoard, String> {
    Page<KanBoard> findAllByUserId(String userId, Pageable pageable);
    void deleteByIdIn(List<String> ids);
    long deleteByIdInAndUserId(List<String> ids, String userId);
    long countByUserId(String userId);

    Optional<List<KanBoard>> findKanBoardByNameAndColor(
            String name,
            String color
    );

    //https://www.baeldung.com/spring-jpa-like-queries
    Optional<List<KanBoard>> findKanBoardByNameContainingAndColorContaining(String name, String color);

    KanBoard findKanBoardByTasksContains(List<Task> tasks);
}

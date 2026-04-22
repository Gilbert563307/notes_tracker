package com.notes_tracker.backend.kanboard.domain;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.DocumentReference;

import com.notes_tracker.backend.kanboard.presentation.exception.DomainException;
import com.notes_tracker.backend.kanboard.presentation.exception.MaxKanBoardsException;

@Document
public class KanBoard {
    private final int MAX_KANBOARDS_PER_USER = 20;

    @Id
    private String id;
    private String name;
    private String userId;
    private String color;
    private boolean archived;
    private boolean collaborative;
    private String imageUrl;

    // https://bootify.io/mongodb/document-reference-in-spring-boot-mongodb.html
    // https://docs.spring.io/spring-data/mongodb/reference/mongodb/mapping/mapping.html
    @DocumentReference(lazy = true) // Applied at the field to indicate it is to be stored as a pointer to another
                                    // document. This can be a single value (the id by default), or a Document
                                    // provided via a converter.
    private List<Task> tasks;
    private long totalKanBoards;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public KanBoard() {

    }

    private KanBoard(Builder builder) {
        this.name = builder.name;
        this.userId = builder.userId;
        this.color = builder.color;
        this.archived = builder.archived;
        this.collaborative = builder.collaborative;
        this.imageUrl = builder.imageUrl;
        this.tasks = builder.tasks;
        this.totalKanBoards = builder.totalKanBoards;
        this.createdAt = builder.createdAt;
        this.updatedAt = builder.updatedAt;
        this.validate();
    }

    public void update(String name, String userId, String color, boolean archived, boolean collaborative,
            String imageUrl) {
        this.name = name;
        this.userId = userId;
        this.color = color;
        this.archived = archived;
        this.collaborative = collaborative;
        this.imageUrl = imageUrl;
        this.updatedAt = LocalDateTime.now();
        this.validate();
    }

    public String getUserId() {
        return userId;
    }

    public String getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getColor() {
        return color;
    }

    public boolean isArchived() {
        return archived;
    }

    public boolean isCollaborative() {
        return collaborative;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public List<Task> getTasks() {
        return this.tasks;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void assignTask(Task task) {
        this.tasks.add(task);
    }

    public void removeTask(Task taskToRemove) {
        this.tasks = this.tasks.stream().filter(task -> !task.getId().equals(taskToRemove.getId()))
                .toList();
    }

    public static class Builder {
        private String name;
        private String userId;
        private String color = "#000000";
        private boolean archived = false;
        private boolean collaborative = false;
        private String imageUrl;
        private long totalKanBoards = 0;
        private List<Task> tasks = new ArrayList<>();
        private LocalDateTime createdAt = LocalDateTime.now();
        private LocalDateTime updatedAt = LocalDateTime.now();

        public Builder name(String name) {
            this.name = name;
            return this;
        }

        public Builder userId(String userId) {
            this.userId = userId;
            return this;
        }

        public Builder color(String color) {
            this.color = color;
            return this;
        }

        public Builder archived(boolean archived) {
            this.archived = archived;
            return this;
        }

        public Builder collaborative(boolean collaborative) {
            this.collaborative = collaborative;
            return this;
        }

        public Builder imageUrl(String imageUrl) {
            this.imageUrl = imageUrl;
            return this;
        }

        public Builder totalKanBoards(long totalKanBoards) {
            this.totalKanBoards = totalKanBoards;
            return this;
        }

        public Builder tasks(List<Task> tasks) {
            this.tasks = tasks;
            return this;
        }

        public KanBoard build() {
            return new KanBoard(this);
        }
    }

    private void validate() {
        //TODO ADD A TEST FOR THIS
        if (this.MAX_KANBOARDS_PER_USER == totalKanBoards) {
            throw new MaxKanBoardsException(MAX_KANBOARDS_PER_USER);
        }

        if (this.name == null || this.name.trim().isEmpty()) {
            throw new DomainException("Board name is required.");
        }

        if (this.userId == null || this.userId.trim().isEmpty()) {
            throw new DomainException("User ID is required.");
        }

        if (!this.color.contains("#")) {
            throw new DomainException(
                    "Kanboard colour is invalid must be of hex code.");
        }
    }
}

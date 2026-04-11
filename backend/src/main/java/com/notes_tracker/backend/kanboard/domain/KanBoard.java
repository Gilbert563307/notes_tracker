package com.notes_tracker.backend.kanboard.domain;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import com.notes_tracker.backend.kanboard.presentation.exception.DomainException;

@Document
public class KanBoard {

    @Id
    private String id;
    private String name;
    private String userId;
    private String color;
    private boolean archived;
    private boolean collaborative;
    private String imageUrl;

    //https://spring.io/blog/2021/11/29/spring-data-mongodb-relation-modelling
    @DBRef
    private List<Task> tasks;
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

    public List<Task> getTasks(){
        return this.tasks;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public static class Builder {
        private String name;
        private String userId;
        private String color;
        private boolean archived;
        private boolean collaborative;
        private String imageUrl;
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

        public Builder tasks(List<Task> tasks) {
            this.tasks = tasks;
            return this;
        }

        public KanBoard build() {
            return new KanBoard(this);
        }
    }

    private void validate() {
        if (name == null || name.trim().isEmpty()) {
            throw new DomainException("Board name is required.");
        }

        if (userId == null || userId.trim().isEmpty()) {
            throw new DomainException("User ID is required.");
        }
    }
}

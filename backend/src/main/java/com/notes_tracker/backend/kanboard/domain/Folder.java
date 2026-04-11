package com.notes_tracker.backend.kanboard.domain;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document
public class Folder {

    @Id
    private String id;
    private String name;
    private String userId;
    private String color;
    private boolean archived;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public Folder(){

    }

    private Folder(Builder builder){
        this.name = builder.name;
        this.userId = builder.userId;
        this.color = builder.color;
        this.archived = builder.archived;
        this.createdAt = builder.createdAt;
        this.updatedAt = builder.updatedAt;
    }
    public void update(String name, String userId, String color, boolean archived) {
        this.name = name;
        this.userId = userId;
        this.color = color;
        this.archived = archived;
        this.updatedAt = LocalDateTime.now();
    }


    public String getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getUserId() {
        return userId;
    }

    public String getColor() {
        return color;
    }

    public boolean isArchived() {
        return archived;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public static class  Builder{
        private String name;
        private String userId;
        private String color;
        private boolean archived;
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

        public Folder build(){
            return new Folder(this);
        }
    }
}

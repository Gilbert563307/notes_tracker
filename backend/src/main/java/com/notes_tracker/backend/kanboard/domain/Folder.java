package com.notes_tracker.backend.kanboard.domain;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.DocumentReference;

import com.notes_tracker.backend.kanboard.presentation.exception.DomainException;

@Document
public class Folder {

    @Id
    private String id;
    private String name;
    private String userId;
    private String color;
    private boolean archived;

    @DocumentReference(lazy = true)
    private List<DriveFile> driveFiles;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public Folder() {

    }

    private Folder(Builder builder) {
        this.name = builder.name;
        this.userId = builder.userId;
        this.color = builder.color;
        this.archived = builder.archived;
        this.driveFiles = builder.files;
        this.createdAt = builder.createdAt;
        this.updatedAt = builder.updatedAt;
        this.validate();
    }

    public void update(String name, String userId, String color, boolean archived) {
        this.name = name;
        this.userId = userId;
        this.color = color;
        this.archived = archived;
        this.updatedAt = LocalDateTime.now();
        this.validate();
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

    public List<DriveFile> getDriveFiles() {
        return driveFiles;
    }

    public void addDriveFileToFolder(DriveFile file){
        this.driveFiles = driveFiles;
    }

    public void removeDriveFile(DriveFile fileToRemove){
        List<DriveFile> updatedDriveFiles = this.driveFiles.stream().filter(file -> !file.getId().equals(fileToRemove.getId())).toList();
        this.driveFiles = updatedDriveFiles;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public static class Builder {
        private String name;
        private String userId;
        private String color = "#000000";
        private boolean archived = false;
        private List<DriveFile> files = new ArrayList<>();
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

        public Builder files(List<DriveFile> files) {
            this.files = files;
            return this;
        }

        public Folder build() {
            return new Folder(this);
        }
    }

    private void validate() {
        if (this.userId == null || this.userId.trim().isEmpty()) {
            throw new DomainException(
                    "User information is missing or invalid.");
        }

        if (this.name == null || this.name.trim().isEmpty()) {
            throw new DomainException(
                    "Please enter a name for the folder.");
        }
        if (this.name.length() > 255) {
            throw new DomainException(
                    "Folder name is too long.");
        }

        if(!this.color.contains("#")){
            throw new DomainException(
                    "Folder colour is invalid must be of hex code.");
        }
    }
}

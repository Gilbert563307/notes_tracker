package com.notes_tracker.backend.kanboard.domain;

import com.notes_tracker.backend.kanboard.presentation.exception.DomainException;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

@Document
public class DriveFile {

    // Define constants for validation
    private static final long MAX_FILE_UPLOAD_SIZE = 100 * 1024 * 1024; // 100MB
    private static final List<String> ALLOWED_TYPES = Arrays.asList("PDF", "DOCX", "DOC", "TXT", "MD");

    @Id
    private String id;
    private String name;
    private String userId;
    private String size;
    private String type;
    private boolean archived;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public DriveFile(){

    }
    
    private DriveFile(Builder builder){
        this.validate(builder.name,  builder.userId, builder.size, builder.type);
        this.name = builder.name;
        this.userId = builder.userId;
        this.size = builder.size;
        this.type = builder.type;
        this.archived = builder.archived;
        this.createdAt = builder.createdAt;
        this.updatedAt = builder.updatedAt;
    }

    public void update(String name, String userId, String size, String type, boolean archived) {
        this.validate(name, userId, size, type);
        this.name = name;
        this.userId = userId;
        this.size = size;
        this.type = type;
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

    public String getSize() {
        return size;
    }

    public String getType() {
        return type;
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
    
    public static class Builder{
        private String name;
        private String userId;
        private String size;
        private String type;
        private boolean archived = false;
        private LocalDateTime createdAt = LocalDateTime.now();
        private LocalDateTime updatedAt = LocalDateTime.now();;

        public Builder name(String name) {
            this.name = name;
            return this;
        }

        public Builder userId(String userId) {
            this.userId = userId;
            return this;
        }

        public Builder size(String size) {
            this.size = size;
            return this;
        }

        public Builder type(String type) {
            this.type = type;
            return this;
        }

        public Builder archived(boolean archived) {
            this.archived = archived;
            return this;
        }

        public DriveFile build(){
            return new DriveFile(this);
        }
    }

    private void validate(String name,  String userId, String size, String type) {

        if (name == null || name.trim().isEmpty()) {
            throw new DomainException("Please enter a name for the file.");
        }

        if (userId == null || userId.trim().isEmpty()) {
            throw new DomainException("We couldn’t identify the user. Please sign in again and try.");
        }

        // Size Validation logic
        if (size == null) {
            throw new DomainException("The size of the file is missing");
        }

        try {
            long fileSize = Long.parseLong(size);
            if (fileSize > MAX_FILE_UPLOAD_SIZE) {
                throw new DomainException("File size too large. Maximum size is 100MB");
            }
        } catch (NumberFormatException e) {
            System.out.println(e.getMessage());
            throw new DomainException("Invalid file size format. Expected a numeric string.");
        }

        // Type Validation logic
        if (type == null || type.trim().isEmpty()) {
            throw new DomainException("File type missing or not supported.");
        }

        if (!ALLOWED_TYPES.contains(type.toUpperCase())) {
            throw new DomainException(
                    String.format("File type not supported. Supported file types: PDF, DOCX, DOC, TXT, MD. Received: %s", type)
            );
        }

        // Note: In Java, a primitive 'boolean' (archived) cannot be null.
        // If it reaches this method, it has a value (true/false).
    }
}

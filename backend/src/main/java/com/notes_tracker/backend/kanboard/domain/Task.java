package com.notes_tracker.backend.kanboard.domain;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;


import java.time.LocalDateTime;

@Document
public class Task {

    public enum TaskStatus {
        TODO,
        DOING,
        REVIEW,
        DONE
    }

    @Id
    private String id;
    private String kanBoardId;
    private String title;
    private String description;
    private TaskStatus status;
    private int priority;
    private String assigneId;
    private boolean archived;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public Task(){

    }

    private Task(Builder builder) {
        this.title = builder.title;
        this.kanBoardId = builder.kanBoardId;
        this.description = builder.description;
        this.status = builder.status;
        this.priority = builder.priority;
        this.assigneId = builder.assigneId;
        this.archived = builder.archived;
        this.createdAt = builder.createdAt;
        this.updatedAt = builder.updatedAt;
    }

    public void updateTask(String title, String kanBoardId, String description, TaskStatus status, int priority, String assigneId, boolean archived){
        this.title = title;
        this.kanBoardId = kanBoardId;
        this.description = description;
        this.status = status;
        this.priority = priority;
        this.assigneId = assigneId;
        this.archived = archived;
        this.updatedAt = LocalDateTime.now();
    }

    public void archiveTask(){
        this.archived = true;
    }

    public void assignTaskToUser(String assigneId){
        this.assigneId = assigneId;
    }

    public void assignTaskToNewKanBoard(String kanBoardId){
        this.kanBoardId = kanBoardId;
    }

    public String getKanBoardId() {
        return kanBoardId;
    }

    public String getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public String getDescription() {
        return description;
    }

    public TaskStatus getStatus() {
        return status;
    }

    public int getPriority() {
        return priority;
    }

    public String getAssigneId() {
        return assigneId;
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

    public  static  class Builder{
        private String kanBoardId;
        private String title;
        private String description;
        private TaskStatus status = TaskStatus.TODO;
        private int priority = 0;
        private String assigneId;
        private boolean archived = false;
        private LocalDateTime createdAt = LocalDateTime.now();
        private LocalDateTime updatedAt = LocalDateTime.now();

        public Builder kanBoardId(String kanBoardId) {
            this.kanBoardId = kanBoardId;
            return this;
        }

        public Builder title(String title) {
            this.title = title;
            return this;
        }

        public Builder description(String description) {
            this.description = description;
            return this;
        }

        public Builder status(TaskStatus status) {
            this.status = status;
            return this;
        }

        public Builder priority(int priority) {
            this.priority = priority;
            return this;
        }

        public Builder assigneId(String assigneId) {
            this.assigneId = assigneId;
            return this;
        }

        public Builder archived(boolean archived) {
            this.archived = archived;
            return this;
        }
        
        public  Task build(){
            return new Task(this);
        }
    }

}

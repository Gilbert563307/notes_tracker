package com.notes_tracker.backend.kanboard.application.request;

public record AddTaskToKanBoardRequest(String taskId, String kanBoardId) {
}

package com.notes_tracker.backend.kanboard.application.request;

import com.notes_tracker.backend.kanboard.application.dto.TaskDto;

public record AddNewTaskToKanBoard(TaskDto task) {
}

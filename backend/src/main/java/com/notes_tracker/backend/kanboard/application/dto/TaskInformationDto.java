package com.notes_tracker.backend.kanboard.application.dto;

public record TaskInformationDto(
        TaskDto task,
        String projectName,
        String assignee,
        String reporter
) {

    public static TaskInformationDto  from(TaskDto task, String projectName, String assignee, String reporter){
        return new TaskInformationDto(
                task,
                projectName,
                assignee,
                reporter
        );
    }
}

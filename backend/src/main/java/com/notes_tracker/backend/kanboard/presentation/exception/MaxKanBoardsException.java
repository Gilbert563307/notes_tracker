package com.notes_tracker.backend.kanboard.presentation.exception;

public class MaxKanBoardsException extends RuntimeException {
    public MaxKanBoardsException(int maxKanBaords) {
        super(String.format("You have reached the maximum number of Kanboards (%s).", maxKanBaords));
    }
}

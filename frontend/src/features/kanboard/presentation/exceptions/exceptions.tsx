import { BaseException } from "../../../../shared/exceptions/exceptions";

export class ApiException extends BaseException {
  constructor(message: string) {
    super(message, 1);
    this.name = "ApiException";
  }
}

export class InvalidSessionException extends BaseException {
  constructor() {
    super("Invalid authentication session", 1);
  }
}

export class InvalidResponseError extends BaseException {
  constructor() {
    super("Invalid response received from server.", 0);
  }
}

export class FailedToCreateKanBoardException extends BaseException {
  constructor() {
    super("Failed to create kanban board. Please try again.", 0);
  }
}

export class FailedToFindYourKanBoardException extends BaseException {
  constructor(message: string = "") {
    const newMessage = message === "" ? "Failed to find your kanban board. It may not exist" : message;
    super(newMessage, 0);
    this.type = this.info();
  }
}

export class FailedToFindTasksException extends BaseException {
  constructor() {
    super("Failed to find tasks. Please try again.", 3);
  }
}

export class FailedToLoadKanBoardsException extends BaseException {
  constructor(message: string = "") {
    const newMessage = message === "" ? "Failed to load kanban boards. Please try again." : message;
    super(newMessage, 1);
  }
}

export class FailedToCreateTaskIntoProjectException extends BaseException {
  constructor() {
    super("Failed to create your task. Please try again.", 1);
  }
}

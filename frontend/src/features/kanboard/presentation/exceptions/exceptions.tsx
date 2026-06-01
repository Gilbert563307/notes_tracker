// export const ALERT_TYPES = {
//   INFO: 0,
//   DANGER: 1,
//   SUCCESS: 2,
//   PRIMARY: 3,
// };

export abstract class BaseException extends Error {
  type: number;
  constructor(message: string, type: number) {
    super(message);
    this.type = type;
  }
}

export class ApiException extends BaseException {
  constructor(message: string) {
    super(message, 1);
    this.name = "ApiException";
  }
}

export class InvalidSessionException extends BaseException {
  constructor() {
    super("Invalid authentication session", 1);
    this.name = "InvalidSessionException";
  }
}

export class InvalidResponseError extends BaseException {
  constructor() {
    super("Invalid response received from server.", 0);
    this.name = "InvalidResponseError";
  }
}

export class FailedToCreateKanBoardException extends BaseException {
  constructor() {
    super("Failed to create kanban board. Please try again.", 0);
    this.name = "FailedToCreateKanBoardException";
  }
}

export class FailedToFindTasksException extends BaseException {
  constructor() {
    super("Failed to find tasks. Please try again.", 3);
    this.name = "FailedToFindTasksException";
  }
}

export class FailedToLoadKanBoardsException extends BaseException {
  constructor() {
    super("Failed to load kanban boards. Please try again.", 1);
    this.name = "FailedToLoadKanBoardsException";
  }
}

export class FailedToCreateTaskIntoProjectException extends BaseException {
  constructor() {
    super("Failed to create your task. Please try again.", 1);
    this.name = "FailedToCreateTaskIntoProjectException";
  }
}

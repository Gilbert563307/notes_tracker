import { BaseException } from "../../../../shared/exceptions/exceptions";

export class ApiException extends BaseException {
  constructor(message: string = "Something went wrong. Please try again.") {
    super(message, 1);
    this.name = "ApiException";
  }
}

export class InvalidSessionException extends BaseException {
  constructor() {
    super("Your session has expired. Please sign in again to continue.", 1);
  }
}

export class InvalidResponseError extends BaseException {
  constructor() {
    super("We're having trouble communicating with the server. Please try again in a moment.", 0);
  }
}

export class FailedToCreateKanBoardException extends BaseException {
  constructor() {
    super("We couldn't create your board right now. Please try again.", 0);
  }
}

export class FailedToFindYourKanBoardException extends BaseException {
  constructor(message = "") {
    super(message || "We couldn't find that board. It may have been deleted or you may not have access to it.", 0);
    this.type = this.info();
  }
}

export class FailedToFindTasksException extends BaseException {
  constructor() {
    super("We couldn't load your tasks right now. Please refresh and try again.", 3);
  }
}

export class FailedToLoadKanBoardsException extends BaseException {
  constructor(message = "") {
    super(message || "We couldn't load your boards right now. Please try again.", 1);
  }
}

export class FailedToCreateTaskIntoProjectException extends BaseException {
  constructor() {
    super("We couldn't create your task right now. Please try again.", 1);
  }
}

export class InvalidNameAndColourArgException extends BaseException {
  constructor() {
    super("Please provide both a project name and a color before saving.", 1);
  }
}

export class FailedToUpdateKanBoardException extends BaseException {
  constructor() {
    super("We couldn't update your board right now. Please try again.", 1);
  }
}

export class FailedToDeleteKanBoardException extends BaseException {
  constructor() {
    super("We couldn't delete that board. It may no longer exist or you may not have permission to delete it.", 1);
  }
}

export class FailedToDeleteTaskException extends BaseException {
  constructor() {
    super("We couldn't delete that task. It may no longer exist or you may not have permission to delete it.", 1);
  }
}

export class EmptySearchTermException extends BaseException{
  constructor(){
    super("Please fill in a value.", 0)
  }
}


//TASK exceptions
export class FailedToFindYourTaskException extends BaseException {
  constructor(message = "") {
    super(message || "We couldn't find that task. It may have been deleted or you may not have access to it.", 0);
  }
}

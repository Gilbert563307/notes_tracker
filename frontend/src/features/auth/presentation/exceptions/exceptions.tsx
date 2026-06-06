import { BaseException } from "../../../../shared/exceptions/exceptions";

export class AuthResponseNotOkError extends BaseException {
  constructor() {
    super(
      "Something went wrong while trying to authenticate your request, check your credentials otherwise contact the administrator",
      1,
    );
  }
}

export class MissingAuthDataError extends BaseException {
  constructor() {
    super("Unexpected server response, please contact administrator", 1);
  }
}



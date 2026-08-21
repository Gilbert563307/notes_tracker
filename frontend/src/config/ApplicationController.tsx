import { BaseException } from "../shared/exceptions/exceptions";
import { NotificationDto } from "../shared/features/notification/domain/dto/NotificationDto";
import { notificationObserver } from "../shared/features/notification/observers/NotificationObserver";

//TODO Do somethi
export class ApplicationController {
  protected notifyErrorToUser(error: unknown) {
    const err = error instanceof BaseException ? error : null;
    if (!err) return;
    notificationObserver.add(new NotificationDto.Builder().message(err.message).type(err.type).build());
    return;
  }

  protected notifyUser(message: string) {
    if (!message) return;
    notificationObserver.add(new NotificationDto.Builder().message(message).type(0).build());
    return;
  }
}

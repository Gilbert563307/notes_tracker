import { BaseException } from "../../../shared/exceptions/exceptions";
import { NotificationDto } from "../../../shared/features/notification/domain/dto/NotificationDto";
import { notificationObserver } from "../../../shared/features/notification/observers/NotificationObserver";
import { TaskService, taskService } from "../application/TaskService";

export class TaskController {
  #taskService: TaskService;

  constructor(taskService: TaskService) {
    this.#taskService = taskService;
  }

  async getTaskById(id: string) {
    try {
      return this.#taskService.getTaskById(id);
    } catch (error) {
      this.#setMessageToUserV2(error);
    }
  }

  #setMessageToUserV2(error: unknown) {
    const err = error instanceof BaseException ? error : null;
    if (!err) return;
    notificationObserver.add(new NotificationDto.Builder().message(err.message).type(err.type).build());
    return;
  }
}

const taskController = new TaskController(taskService);
export { taskController };

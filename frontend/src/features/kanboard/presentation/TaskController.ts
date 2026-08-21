import { BaseException } from "../../../shared/exceptions/exceptions";
import { NotificationDto } from "../../../shared/features/notification/domain/dto/NotificationDto";
import { notificationObserver } from "../../../shared/features/notification/observers/NotificationObserver";
import type { DownloadTaskOption } from "../../../types";
import { TaskService, taskService } from "../application/TaskService";
import type { Task } from "../domain/Task";

export class TaskController {
  #taskService: TaskService;

  constructor(taskService: TaskService) {
    this.#taskService = taskService;
  }

  async getTaskById(id: string) {
    try {
      return await this.#taskService.getTaskById(id);
    } catch (error) {
      this.notifyErrorToUser(error);
    }
  }

  async deleteTaskById(taskId: string): Promise<boolean> {
    try {
      const response = await this.#taskService.deleteTaskById(taskId);
      this.notifyUser(response);
      return true;
    } catch (error) {
      this.notifyErrorToUser(error);
      return false;
    }
  }

  async updateTask(updateTaskData: Task) {
    try {
      const response = await this.#taskService.updateTask(updateTaskData);
      this.notifyUser(response);
    } catch (error) {
      this.notifyErrorToUser(error);
    }
  }

  async downloadTask(description: string | undefined, option: DownloadTaskOption, filename: string) {
    try {
      await this.#taskService.downloadTask(description, option, filename);
    } catch (error) {
      this.notifyErrorToUser(error);
    }
  }

  private notifyErrorToUser(error: unknown) {
    const err = error instanceof BaseException ? error : null;
    if (!err) return;
    notificationObserver.add(new NotificationDto.Builder().message(err.message).type(err.type).build());
    return;
  }

  private notifyUser(message: string) {
    if (!message) return;
    notificationObserver.add(new NotificationDto.Builder().message(message).type(0).build());
    return;
  }
}

const taskController = new TaskController(taskService);
export { taskController };

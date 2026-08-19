import { JsonParsingError } from "../../../shared/exceptions/exceptions";
import { OAuth2ResourceService } from "../../../shared/utils/OAuth2ResourceService";
import { RequestHandler } from "../../../shared/utils/RequestHandler";
import type { ApiErrorResponse } from "../../../types";
import type { Task } from "../domain/Task";
import { FailedToDeleteTaskException, FailedToFindYourTaskException } from "../presentation/exceptions/exceptions";
import { TaskMapper } from "./mapper/TaskMapper";
import type { TaskInformationResponse } from "./response/response";

export const TASK_RESOURCE = "task";
export class TaskService extends OAuth2ResourceService {
  constructor(resource: string, requestHandler: RequestHandler) {
    super(resource, requestHandler);
  }

  async getTaskById(id: string): Promise<Task> {
    if (!id) {
      throw new FailedToFindYourTaskException();
    }
    const response = await super.read(id);

    if (!response.ok) {
      const data: ApiErrorResponse = await response.json();
      throw new FailedToFindYourTaskException(data.message);
    }

    try {
      const data: TaskInformationResponse = await response.json();
      const task = TaskMapper.toTask(data.task);
      task.updateProjectName(data.projectName);
      task.updateAssignee(data.assignee);
      task.updateReporter(data.reporter);
      return task;
    } catch (error) {
      throw new JsonParsingError(error?.message);
    }
  }

  async deleteTaskById(taskId: string): Promise<string> {
    if (!taskId) {
      throw new FailedToFindYourTaskException();
    }
    const response = await super.delete(taskId);
    if (!response.ok) {
      throw new FailedToDeleteTaskException();
    }
    return "Your task has been successfully been deleted";
  }
}

const taskService = new TaskService(TASK_RESOURCE, new RequestHandler(import.meta.env.VITE_APP_BACKEND_URL));
export { taskService };

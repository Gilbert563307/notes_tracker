import { JsonParsingError } from "../../../shared/exceptions/exceptions";
import { OAuth2ResourceService } from "../../../shared/utils/OAuth2ResourceService";
import { RequestHandler } from "../../../shared/utils/RequestHandler";
import type { ApiErrorResponse } from "../../../types";
import { FailedToFindYourTaskException } from "../presentation/exceptions/exceptions";
import { TaskMapper } from "./mapper/TaskMapper";

export const TASK_RESOURCE = "task";
export class TaskService extends OAuth2ResourceService {
  constructor(resource: string, requestHandler: RequestHandler) {
    super(resource, requestHandler);
  }

  async getTaskById(id: string) {
    if (!id) {
      throw new FailedToFindYourTaskException();
    }
    const response = await super.read(id);

    if (!response.ok) {
      const data: ApiErrorResponse = await response.json();
      throw new FailedToFindYourTaskException(data.message);
    }

    try {
      const data = await response.json();
      return TaskMapper.toTask(data);
    } catch (error) {
      throw new JsonParsingError(error?.message);
    }
  }
}

const taskService = new TaskService(TASK_RESOURCE, new RequestHandler(import.meta.env.VITE_APP_BACKEND_URL));
export { taskService };

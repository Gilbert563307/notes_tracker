import { AUTH_STORAGE_KEYS } from "../../../shared/context/AuthProviderConfig";
import { RequestHandler } from "../../../shared/utils/RequestHandler";
import { ResourceService } from "../../../shared/utils/ResourceService";
import { UseCookieStorage } from "../../../shared/utils/UseCookieStorage";
import type { AuthenticationCookie } from "../../auth/application/response/Authentication";
import { TaskMapper } from "./mapper/TaskMapper";

export const TASK_RESOURCE = "task";
export class TaskService extends ResourceService {
  #resource: string;
  #requestHandler: RequestHandler;
  #cookieStorage: UseCookieStorage;

  constructor(resource: string, requestHandler: RequestHandler, cookieStorage: UseCookieStorage) {
    super(resource, requestHandler);
    this.#resource = resource;
    this.#requestHandler = requestHandler;
    this.#cookieStorage = cookieStorage;
  }

  async #getToken(): Promise<string> {
    const value: string | null = await this.#cookieStorage.readCookieValue(AUTH_STORAGE_KEYS.AUTH);
    if (value === null) {
      throw new Error("We couldn’t find your session token. Please sign out and log in again.");
    }
    const cookieData: AuthenticationCookie = JSON.parse(value);
    return cookieData.token;
  }

  async createTask(request: CreateTaskRequest){
    try {
        const token = await this.#getToken();
        const task = TaskMapper.toCreateTaskRequest(request);
        const response = await super.create(token, task);
    } catch (error) {
        
    }
  }
}

const taskService = new TaskService(
  TASK_RESOURCE,
  new RequestHandler(import.meta.env.VITE_APP_BACKEND_URL),
  new UseCookieStorage(),
);
export { taskService };

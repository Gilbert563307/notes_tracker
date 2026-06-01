import { ResourceService } from "../../../shared/utils/ResourceService";
import { RequestHandler } from "../../../shared/utils/RequestHandler";
import { UseCookieStorage } from "../../../shared/utils/UseCookieStorage";
import { AUTH_STORAGE_KEYS } from "../../../shared/context/AuthProviderConfig";
import { NotificationDto } from "../../../shared/features/notification/domain/dto/NotificationDto";
import type { CreateKanBoardRequest } from "./request/CreateKanBoardRequest";
import { KanBoardMapper } from "./mapper/KanBoardMapper";
import type { AuthenticationCookie } from "../../auth/application/response/Authentication";
import type { getKanBoardsResponse, getTasksByKanBoardIdResponse } from "../../auth/types";
import type { KanBoard } from "../domain/KanBoard";
import type { Task } from "../domain/Task";
import { TaskMapper } from "./mapper/TaskMapper";
import type { ApiErrorResponse } from "../../../types";
import type { CreateKanBoardTaskRequest } from "../presentation/request/CreateKanBoardTaskRequest";
import { CreateTaskRequest } from "../presentation/request/CreateTaskRequest";
import { FailedToCreateTaskIntoProjectException } from "../presentation/exceptions/exceptions";

export const KAN_BOARD_RESOURCE = "kanboard";
export class KanBoardService extends ResourceService {
  #cookieStorage: UseCookieStorage;
  constructor(resource: string, requestHandler: RequestHandler, cookieStorage: UseCookieStorage) {
    super(resource, requestHandler);
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

  async getKanBoards(): Promise<{
    data: {
      total: number;
      pages: number;
      boards: KanBoard[];
    };
    notification: NotificationDto;
  }> {
    try {
      const token = await this.#getToken();
      const response = await super.findAll(token);

      if (!response.ok) {
        const data: ApiErrorResponse = await response.json();
        return {
          notification: new NotificationDto.Builder()
            .danger()
            .message(data.message || "Failed to load kanban boards. Please try again.")
            .build(),
          data: { total: 0, pages: 0, boards: [] },
        };
      }

      const responseData: getKanBoardsResponse = await response.json();
      const data = KanBoardMapper.findAllResponseToDomain(responseData);

      return {
        data: data,
        notification: new NotificationDto.Builder().build(),
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      return {
        notification: new NotificationDto.Builder().danger().message(message).build(),
        data: { total: 0, pages: 0, boards: [] },
      };
    }
  }

  async createKanBoard(request: CreateKanBoardRequest): Promise<{ notification: NotificationDto; created: boolean }> {
    try {
      const token = await this.#getToken();
      const kanBoard = KanBoardMapper.toCreateKanBoardRequest(request);
      const response = await super.create(token, kanBoard);

      if (!response.ok) {
        const data: ApiErrorResponse = await response.json();
        return {
          notification: new NotificationDto.Builder()
            .danger()
            .message(data.message || "Failed to create kanban board. Please try again.")
            .build(),
          created: false,
        };
      }

      return {
        notification: new NotificationDto.Builder().success().message("Your kan board has been created").build(),
        created: true,
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      return {
        notification: new NotificationDto.Builder().danger().message(message).build(),
        created: false,
      };
    }
  }

  async createNewTaskInKanBoard(request: CreateKanBoardTaskRequest): Promise<Array<Task>> {
    request.validate();
    const token = await this.#getToken();
    //TODO MAKE URL CONSTRUCT EASIER
    const url = `${super.getRequestHandler().getBaseUrl()}${super.getResource()}/${request.getKanBoardId()}/task`;
    const response = await super
      .getRequestHandler()
      .perform(
        new RequestHandler.RequestBuilder()
          .patch()
          .bearer(token)
          .content(
            new CreateTaskRequest.Builder()
              .title(request.getTitle())
              .description(request.getDescription())
              .build()
              .toJson(),
          )
          .url(url)
          .build(),
      );

    if (!response.ok) {
      const data: ApiErrorResponse = await response.json();
      if (data.message) throw new Error(data.message);
      throw new FailedToCreateTaskIntoProjectException();
    }

    let data: getTasksByKanBoardIdResponse;
    try {
      data = await response.json();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      throw new Error(message);
    }

    return TaskMapper.toTaskList(data);
  }

  //TODO NEEDS VI TESTING
  async getTasksByKanBoardId(boardId: string): Promise<{ notification: NotificationDto; tasks: Task[] }> {
    try {
      const token = await this.#getToken();
      const url: string = `${super.getRequestHandler().getBaseUrl()}${super.getResource()}/${boardId}/tasks`;

      const response = await super
        .getRequestHandler()
        .perform(new RequestHandler.RequestBuilder().get().bearer(token).url(url).build());

      if (!response.ok) {
        const data: ApiErrorResponse = await response.json();
        return {
          notification: new NotificationDto.Builder()
            .danger()
            .message(data.message || "Failed to load tasks. Please try again.")
            .build(),
          tasks: [],
        };
      }

      const data: getTasksByKanBoardIdResponse = await response.json();
      return {
        notification: new NotificationDto.Builder().success().build(),
        tasks: TaskMapper.toTaskList(data),
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      return {
        notification: new NotificationDto.Builder().danger().message(message).build(),
        tasks: [],
      };
    }
  }
}

const kanBoardService = new KanBoardService(
  KAN_BOARD_RESOURCE,
  new RequestHandler(import.meta.env.VITE_APP_BACKEND_URL),
  new UseCookieStorage(),
);
export { kanBoardService };

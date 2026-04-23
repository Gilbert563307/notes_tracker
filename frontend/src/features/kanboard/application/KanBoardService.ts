import { ResourceService } from "../../../shared/utils/ResourceService";
import { RequestHandler } from "../../../shared/utils/RequestHandler";
import { UseCookieStorage } from "../../../shared/utils/UseCookieStorage";
import { AUTH_STORAGE_KEYS } from "../../../shared/context/AuthProviderConfig";
import { NotificationDto } from "../../../shared/features/notification/domain/dto/NotificationDto";
import type { CreateKanBoardRequest } from "./request/CreateKanBoardRequest";
import { KanBoardMapper } from "./mapper/KanBoardMapper";
import type { AuthenticationCookie } from "../../auth/application/response/Authentication";
import type { getKanBoardsResponse } from "../../auth/types";
import type { KanBoard } from "../domain/KanBoard";
import type { Task } from "../domain/Task";
import { TaskMapper } from "./mapper/TaskMapper";

export const KAN_BOARD_RESOURCE = "kanboard";
export class KanBoardService extends ResourceService {
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

  //TODO NEEDS VI TESTING
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
        const data = await response.json();
        return {
          notification: new NotificationDto.Builder().danger().message(data?.message).build(),
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

  //TODO NEEDS VI TESTING
  async createKanBoard(request: CreateKanBoardRequest): Promise<{ notification: NotificationDto; created: boolean }> {
    try {
      const token = await this.#getToken();
      const kanBoard = KanBoardMapper.toCreateKanBoardRequest(request);
      const response = await super.create(token, kanBoard);

      if (!response.ok) {
        const data = await response.json();
        return {
          notification: new NotificationDto.Builder().danger().message(data?.message).build(),
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

  //TODO NEEDS VI TESTING
  async getTasksByKanBoardId(boardId: string): Promise<{ notification: NotificationDto; tasks: Task[] }> {
    try {
      const token = await this.#getToken();
      const url: string = `${this.#requestHandler.getBaseUrl()}${this.#resource}/${boardId}/tasks`;

      const response = await this.#requestHandler.perform(
        new RequestHandler.RequestBuilder().get().bearer(token).url(url).build(),
      );

      if (!response.ok) {
        const data = await response.json();
        return {
          notification: new NotificationDto.Builder().danger().message(data?.message).build(),
          tasks: [],
        };
      }

      const data = await response.json();
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

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

export const KAN_BOARD_RESOURCE = "kanboard";
export class KanBoardService extends ResourceService {
  // #requestHandler: RequestHandler;
  #cookieStorage: UseCookieStorage;

  constructor(resource: string, requestHandler: RequestHandler, cookieStorage: UseCookieStorage) {
    super(resource, requestHandler);
    // this.#requestHandler = requestHandler;
    this.#cookieStorage = cookieStorage;
  }

  async #getToken(): Promise<string> {
    const value: string | null = await this.#cookieStorage.readCookieValue(AUTH_STORAGE_KEYS.AUTH);
    if (value === null) {
      throw new Error("User token is missing, try to signout an login again");
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
}

const kanBoardService = new KanBoardService(
  KAN_BOARD_RESOURCE,
  new RequestHandler(import.meta.env.VITE_APP_BACKEND_URL),
  new UseCookieStorage(),
);
export { kanBoardService };

import { ResourceService } from "../../../shared/utils/ResourceService";
import { RequestHandler } from "../../../shared/utils/RequestHandler";
import { UseCookieStorage } from "../../../shared/utils/UseCookieStorage";
import { AUTH_STORAGE_KEYS } from "../../../shared/context/AuthProviderConfig";
import { NotificationDto } from "../../../shared/features/notification/domain/dto/NotificationDto";
import type { AuthResponseCookie } from "../../auth/application/response/AuthResponse";
import type { CreateKanBoardRequest } from "./request/CreateKanBoardRequest";
import { KanBoardMapper } from "./mapper/KanBoardMapper";

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

  async #getCookie(): Promise<string | null> {
    return await this.#cookieStorage.readCookieValue(AUTH_STORAGE_KEYS.AUTH);
  }

  async getKanBoards(): Promise<{ boards: Array<T>; notification: NotificationDto }> {
    try {
      const cookie = await this.#getCookie();
      if (cookie === null) {
        return {
          boards: [],
          notification: new NotificationDto.Builder()
            .danger()
            .message("You are not logged in, log in to proceed")
            .build(),
        };
      }
      const cookieData: AuthResponseCookie = JSON.parse(cookie);
      const response = await super.findAll(cookieData.token);

      if (!response.ok) {
        const data = await response.json();
        return {
          notification: new NotificationDto.Builder().danger().message(data?.message).build(),
          boards: [],
        };
      }

      const data = await response.json();

      return {
        boards: [],
        notification: new NotificationDto.Builder().build(),
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      return {
        notification: new NotificationDto.Builder().danger().message(message).build(),
        boards: [],
      };
    }
  }

  async createKanBoard(request: CreateKanBoardRequest) {
    try {
      const cookie = await this.#getCookie();

      const kanBoard = KanBoardMapper.toCreateKanBoardRequest(request);
      console.log(kanBoard);
    } catch (error) {}
  }
}

const kanBoardService = new KanBoardService(
  KAN_BOARD_RESOURCE,
  new RequestHandler(import.meta.env.VITE_APP_BACKEND_URL),
  new UseCookieStorage(),
);
export { kanBoardService };

import { BaseException } from "../../../shared/exceptions/exceptions";
import { NotificationDto } from "../../../shared/features/notification/domain/dto/NotificationDto";
import { notificationObserver } from "../../../shared/features/notification/observers/NotificationObserver";
import { KanBoardService, kanBoardService } from "../application/KanBoardService";
import type { CreateKanBoardRequest } from "../application/request/CreateKanBoardRequest";
import type { CreateKanBoardTaskRequest } from "./request/CreateKanBoardTaskRequest";

export class KanBoardController {
  #kanBoardService: KanBoardService;

  constructor(kanBoardService: KanBoardService) {
    this.#kanBoardService = kanBoardService;
  }

  async getKanBoards() {
    try {
      return await this.#kanBoardService.getKanBoards();
    } catch (error) {
      this.#setMessageToUserV2(error);
    }
  }

  async getKanBoardById(id: string) {
    try {
      return await this.#kanBoardService.getKanBoardById(id);
    } catch (error) {
      this.#setMessageToUserV2(error);
    }
  }

  async createKanBoard(request: CreateKanBoardRequest) {
    const response = await this.#kanBoardService.createKanBoard(request);
    this.#setMessageToUser(response.notification);
    return response;
  }

  async getTasksByKanBoardId(boardId: string) {
    const response = await this.#kanBoardService.getTasksByKanBoardId(boardId);
    this.#setMessageToUser(response.notification);
    return response;
  }

  async createNewTaskInKanBoard(request: CreateKanBoardTaskRequest) {
    const response = await this.#kanBoardService.createNewTaskInKanBoard(request);
    this.#setMessageToUser(response.notification);
    return response;
  }

  /**
   *
   * @deprecated
   *
   */
  #setMessageToUser(notification: NotificationDto) {
    if (notification.getMessage() === "") return;
    notificationObserver.add(notification);
  }

  #setMessageToUserV2(error: unknown) {
    const err = error instanceof BaseException ? error : null;
    if (!err) return;
    notificationObserver.add(new NotificationDto.Builder().message(err.message).type(err.type).build());
    return;
  }
}

const kanBoardController = new KanBoardController(kanBoardService);
export { kanBoardController };

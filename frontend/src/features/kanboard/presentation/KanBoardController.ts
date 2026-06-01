import type { NotificationDto } from "../../../shared/features/notification/domain/dto/NotificationDto";
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
    const response = await this.#kanBoardService.getKanBoards();
    this.#setMessageToUser(response.notification);
    return response;
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
    try {
      return await this.#kanBoardService.createNewTaskInKanBoard(request);
    } catch (error) {
      this.#setMessageToUser(error);
      return [];
    }
  }

  #setMessageToUser(notification: NotificationDto) {
    if (notification.getMessage() === "") return;
    notificationObserver.add(notification);
  }
}

const kanBoardController = new KanBoardController(kanBoardService);
export { kanBoardController };

import type { NotificationDto } from "../../../shared/features/notification/domain/dto/NotificationDto";
import { notificationObserver } from "../../../shared/features/notification/observers/NotificationObserver";
import { KanBoardService, kanBoardService } from "../application/KanBoardService";


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

  #setMessageToUser(notification: NotificationDto) {
    if (notification.getMessage() === "") return;
    notificationObserver.add(notification);
  }
}

const kanBoardController = new KanBoardController(kanBoardService);
export {kanBoardController}
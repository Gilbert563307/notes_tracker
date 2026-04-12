import type { NotificationDto } from "../../../shared/features/notification/domain/dto/NotificationDto";
import { notificationObserver } from "../../../shared/features/notification/observers/NotificationObserver";
import { AuthService, authService } from "../application/AuthService";
import type { AuthenticateRequest } from "./request/AuthenticateRequest";
import type { RegisterRequest } from "./request/RegisterRequest";

class AuthController {
  #authService;

  constructor(authService: AuthService) {
    this.#authService = authService;
  }

  async register(request: RegisterRequest) {
    const response = await this.#authService.create(request);
    this.#setMessageToUser(response.notification);
    return response;
  }

  async authenticate(request: AuthenticateRequest) {
    const response = await this.#authService.authenticate(request);
    this.#setMessageToUser(response.notification);
    return response;
  }

  #setMessageToUser(notification: NotificationDto) {
    if (notification.getMessage() === "") return;
    notificationObserver.add(notification);
  }
}

const authController = new AuthController(authService);
export { authController };

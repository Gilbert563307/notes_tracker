import { NotificationDto } from "../../../shared/features/notification/domain/dto/NotificationDto";
import { notificationObserver } from "../../../shared/features/notification/observers/NotificationObserver";
import { AuthService, authService } from "../application/AuthService";
import type { AuthenticateRequest } from "../application/request/AuthenticateRequest";
import type { RegisterRequest } from "../application/request/RegisterRequest";

class AuthController {
  #authService;
  #oauthUrl;

  constructor(authService: AuthService, oauthUrl: string) {
    this.#authService = authService;
    this.#oauthUrl = oauthUrl;
  }

  //TODO REMOVE METHOD
  async register(request: RegisterRequest) {
    throw new Error("DELETE METHOD");
  }

  async authenticate() {
    const response = await this.#authService.authenticate();
    this.#setMessageToUser(response.notification);
    return response;
  }

  signInWithGoogle() {
    if (!this.#oauthUrl) {
      this.#setMessageToUser(
        new NotificationDto.Builder()
          .info()
          .message("Something went wrong while trying to reach the server, please contact the administrator")
          .build(),
      );
    }
    window.location.href = this.#oauthUrl + "google";
  }

  #setMessageToUser(notification: NotificationDto) {
    if (notification.getMessage() === "") return;
    notificationObserver.add(notification);
  }
}

const authController = new AuthController(authService, import.meta.env.VITE_APP_OAUTH_BACKEND_URL);
export { authController };

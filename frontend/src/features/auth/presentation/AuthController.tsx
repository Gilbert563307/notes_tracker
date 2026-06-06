import { BaseException } from "../../../shared/exceptions/exceptions";
import { NotificationDto } from "../../../shared/features/notification/domain/dto/NotificationDto";
import { notificationObserver } from "../../../shared/features/notification/observers/NotificationObserver";
import { AuthService, authService } from "../application/AuthService";

class AuthController {
  #authService;
  #oauthUrl;

  constructor(authService: AuthService, oauthUrl: string) {
    this.#authService = authService;
    this.#oauthUrl = oauthUrl;
  }

  async authenticate() {
    try {
      const response = await this.#authService.authenticate();
      return response;
    } catch (error: unknown) {
      this.#setMessageToUserV2(error);
    }
  }

  signInWithGoogle() {
    if (!this.#oauthUrl) {
      notificationObserver.add(
        new NotificationDto.Builder()
          .info()
          .message("Something went wrong while trying to reach the server, please contact the administrator")
          .build(),
      );
    }
    window.location.href = this.#oauthUrl + "google";
  }

  #setMessageToUserV2(error: unknown) {
    const err = error instanceof BaseException ? error : null;
    if (!err) return;
    notificationObserver.add(new NotificationDto.Builder().message(err.message).type(err.type).build());
    return;
  }
}

const authController = new AuthController(authService, import.meta.env.VITE_APP_OAUTH_BACKEND_URL);
export { authController };

import { AUTH_STORAGE_KEYS } from "../../../shared/context/AuthProviderConfig";
import { NotificationDto } from "../../../shared/features/notification/domain/dto/NotificationDto";
import { RequestHandler } from "../../../shared/utils/RequestHandler";
import { UseCookieStorage } from "../../../shared/utils/UseCookieStorage";
import { UserDto } from "../domain/UserDto";
import type { AuthenticateRequest } from "../presentation/request/AuthenticateRequest";
import type { RegisterRequest } from "../presentation/request/RegisterRequest";
import { AuthResponse } from "../presentation/response/AuthResponse";

export class AuthService {
  #resource: string;
  #requestHandler: RequestHandler;

  constructor(resource: string, requestHandler: RequestHandler) {
    this.#resource = resource;
    this.#requestHandler = requestHandler;
  }

  async authenticate(authenticateRequest: AuthenticateRequest): Promise<{
    notification: NotificationDto;
    token: string | null;
    user: UserDto | null;
  }> {
    try {
      const request = new RequestHandler.RequestBuilder()
        .post()
        .url(this.#requestHandler.getBaseUrl() + this.#resource + "/login")
        .content(authenticateRequest.toJson())
        .build();

      const response = await this.#requestHandler.perform(request);

      if (!response.ok) {
        return {
          notification: new NotificationDto.Builder().danger().message("Invalid email or password").build(),
          token: null,
          user: null,
        };
      }

      const data = await response.json();
      if (!data.token || !data.user) {
        return {
          notification: new NotificationDto.Builder()
            .danger()
            .message("Unexpected server response, please contact administrator")
            .build(),
          token: null,
          user: null,
        };
      }

      const auth = new AuthResponse.Builder().token(data?.token).user(data?.user).build();

      const day = 24 * 60 * 60 * 1000;
      const cookie = new UseCookieStorage.CookieBuilder()
        .name(AUTH_STORAGE_KEYS.AUTH)
        .value(JSON.stringify(auth.toJson()))
        .expires(Date.now() + day)
        .build();

      await UseCookieStorage.createCookie(cookie);

      return {
        notification: new NotificationDto.Builder().success().message("You are now logged in").build(),
        token: data.token,
        user: UserDto.from(data.user),
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";

      return {
        notification: new NotificationDto.Builder().danger().message(message).build(),
        token: null,
        user: null,
      };
    }
  }

  async create(
    registerRequest: RegisterRequest,
  ): Promise<{ notification: NotificationDto; created: boolean; user: UserDto | null }> {
    try {
      const request = new RequestHandler.RequestBuilder()
        .post()
        .url(this.#requestHandler.getBaseUrl() + this.#resource + "/register")
        .content(registerRequest.toJson())
        .build();

      const response = await this.#requestHandler.perform(request);

      if (!response.ok) {
        return {
          notification: new NotificationDto.Builder()
            .danger()
            .message("Something went wrong while trying to create your account")
            .build(),
          created: false,
          user: null,
        };
      }
      const data = await response.json();
      return {
        created: true,
        notification: new NotificationDto.Builder()
          .success()
          .message("Your account has been created successfully. Please visit the login page to continue.")
          .build(),
        user: UserDto.from(data),
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      return {
        created: false,
        notification: new NotificationDto.Builder().danger().message(message).build(),
        user: null,
      };
    }
  }
}
const authService = new AuthService("auth", new RequestHandler(import.meta.env.VITE_APP_BACKEND_URL));
export { authService };

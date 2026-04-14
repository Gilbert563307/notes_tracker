import { NotificationDto } from "../../../shared/features/notification/domain/dto/NotificationDto";
import { RequestHandler } from "../../../shared/utils/RequestHandler";
import { User } from "../domain/User";
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
    auth: AuthResponse | null;
    authenticated: boolean;
  }> {
    try {
      const request = new RequestHandler.RequestBuilder()
        .post()
        .url(this.#requestHandler.getBaseUrl() + this.#resource)
        .content(authenticateRequest.toJson())
        .build();

      const response = await this.#requestHandler.perform(request);

      if (!response.ok) {
        return {
          notification: new NotificationDto.Builder().danger().message("Invalid email or password").build(),
          auth: null,
          authenticated: false,
        };
      }

      const data: { token: string; user: { id: string; displayName: string; photoURL: string } } =
        await response.json();
      if (!data.token || !data.user) {
        return {
          notification: new NotificationDto.Builder()
            .danger()
            .message("Unexpected server response, please contact administrator")
            .build(),
          auth: null,
          authenticated: false,
        };
      }

      const user = User.from(data.user);
      const auth = new AuthResponse.Builder().token(data?.token).user(user).build();

      return {
        notification: new NotificationDto.Builder().success().message("You are now logged in").build(),
        auth: auth,
        authenticated: true,
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";

      return {
        notification: new NotificationDto.Builder().danger().message(message).build(),
        auth: null,
        authenticated: false,
      };
    }
  }

  async create(
    registerRequest: RegisterRequest,
  ): Promise<{ notification: NotificationDto; created: boolean; user: User | null }> {
    try {
      const request = new RequestHandler.RequestBuilder()
        .post()
        .url(this.#requestHandler.getBaseUrl() + this.#resource + "/register")
        .content(registerRequest.toJson())
        .build();

      const response = await this.#requestHandler.perform(request);

      if (!response.ok) {
        const data = await response.json();
        return {
          notification: new NotificationDto.Builder()
            .danger()
            .message(data.message || "Something went wrong while trying to create your account")
            .build(),
          created: false,
          user: null,
        };
      }
      //TODO add return type
      const data = await response.json();
      return {
        created: true,
        notification: new NotificationDto.Builder()
          .success()
          .message("Your account has been created successfully. Please visit the login page to continue.")
          .build(),
        user: User.from(data),
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

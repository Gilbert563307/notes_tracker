import { RequestHandler } from "../../../shared/utils/RequestHandler";
import { User } from "../domain/User";
import { Authentication } from "./response/Authentication";

export class AuthService {
  #resource: string;
  #requestHandler: RequestHandler;

  constructor(resource: string, requestHandler: RequestHandler) {
    this.#resource = resource;
    this.#requestHandler = requestHandler;
  }

  async authenticate(): Promise<Authentication> {
    const request = new RequestHandler.RequestBuilder()
      .get()
      .url(this.#requestHandler.getBaseUrl() + this.#resource + "user")
      .withCredentials()
      .build();

    const response = await this.#requestHandler.perform(request);

    if (!response.ok) {
      throw new Error(
        "Something went wrong while trying to authenticate your request, check your credentials otherwise contact the administrator",
      );
    }

    const data: { id: string; displayName: string; photoURL: string } = await response.json();
    if (!data) {
      throw new Error("Unexpected server response, please contact administrator");
    }

    return new Authentication.Builder().user(User.from(data)).build();
  }
}
const authService = new AuthService("auth", new RequestHandler(import.meta.env.VITE_APP_BACKEND_URL));
export { authService };

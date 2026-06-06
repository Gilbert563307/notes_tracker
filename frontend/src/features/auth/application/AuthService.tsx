import { AUTH_STORAGE_KEYS } from "../../../shared/context/AuthProviderConfig";
import { JsonParsingError } from "../../../shared/exceptions/exceptions";
import { RequestHandler } from "../../../shared/utils/RequestHandler";
import { UseSessionStorage } from "../../../shared/utils/UseSessionStorage";
import { User } from "../domain/User";
import { AuthResponseNotOkError, MissingAuthDataError } from "../presentation/exceptions/exceptions";
import { Authentication } from "./response/Authentication";

export class AuthService {
  #resource: string;
  #requestHandler: RequestHandler;
  #sessionStorage: UseSessionStorage;

  constructor(resource: string, requestHandler: RequestHandler, sessionStorage: UseSessionStorage) {
    this.#resource = resource;
    this.#requestHandler = requestHandler;
    this.#sessionStorage = sessionStorage;
  }

  async authenticate(): Promise<Authentication> {
    const request = new RequestHandler.RequestBuilder()
      .get()
      .url(this.#requestHandler.getBaseUrl() + this.#resource + "/user")
      .withCredentials()
      .build();

    const response = await this.#requestHandler.perform(request);

    if (!response.ok) {
      throw new AuthResponseNotOkError();
    }

    try {
      const data: { id: string; displayName: string; photoURL: string } = await response.json();
      if (!data) {
        throw new MissingAuthDataError();
      }

      const auth = new Authentication.Builder().user(User.from(data)).build();

      this.#sessionStorage.setItem(AUTH_STORAGE_KEYS.AUTH, auth.toString());

      return auth;
    } catch (error: unknown) {
      throw new JsonParsingError(error?.message);
    }
  }
}
const authService = new AuthService(
  "auth",
  new RequestHandler(import.meta.env.VITE_APP_BACKEND_URL),
  new UseSessionStorage(),
);
export { authService };

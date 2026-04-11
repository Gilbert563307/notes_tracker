import { RequestHandler } from "../../../shared/utils/RequestHandler";
import { ResourceService } from "../../../shared/utils/ResourceService";
import { UserDto } from "../domain/UserDto";
import type { RegisterRequest } from "../types";

class AuthService extends ResourceService {
  #resource: string;
  #requestHandler: RequestHandler;

  constructor(resource: string, requestHandler: RequestHandler) {
    super(resource, requestHandler);
    this.#resource = resource;
    this.#requestHandler = requestHandler;
  }

  async create(token: string, request: RegisterRequest): Promise<Response> {
    try {
      const response = await super.create(token, request);

      if (!response.ok) {
        return {
          
          message: "Something went wrong while trying to create your account",
          created: false,
          response: null,
        };
      }
      const data = response.json();
      return {
        created: true,
        message: "Account created successfully.",
        response: UserDto.from(data),
      };
    } catch (error) {
      return {
        created: false,
        message: "Unable to reach the server. Please check your connection.",
        user: null,
      };
    }
  }
}
const authService = new AuthService("auth", new RequestHandler(import.meta.env.VITE_APP_BACKEND_URL));
export { authService };

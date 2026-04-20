import { afterEach, expect, test, vi } from "vitest";
import { AuthService } from "../../../../../features/auth/application/AuthService";
import { AuthenticateRequest } from "../../../../../features/auth/application/request/AuthenticateRequest";
// import { RegisterRequest } from "../../../../../features/auth/application/request/RegisterRequest";
import { RequestHandler } from "../../../../../shared/utils/RequestHandler";
import { AuthResponse } from "../../../../../features/auth/application/response/AuthResponse";
import { User } from "../../../../../features/auth/domain/User";

const MOCK_BACKEND_URL = "http://localhost:8080/api/";

const authService = new AuthService("auth", new RequestHandler(MOCK_BACKEND_URL));

afterEach(() => {
  vi.clearAllMocks(); // Reset all mocked calls between tests
});

test("should authenticate user", async () => {
  // Mock the fetch function.
  const mockUser = {
    id: "uuid",
    displayName: "johndoe",
    photoURL: "",
  };
  const mockResponse = {
    token: "token",
    user: mockUser,
  };

  const user = User.from(mockUser);

  global.fetch = vi.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    }),
  );

  const expectAuth = new AuthResponse.Builder().token("token").user(user).build();
  const response = await authService.authenticate(new AuthenticateRequest("johndoe@gmail.com", "password"));
  const auth = response.auth;

  expect(auth).toBeDefined();
  expect(auth?.toJson()).toStrictEqual(expectAuth.toJson());
  expect(response.authenticated).toBe(true);
});

test("should fail to authenticate when response is ", async () => {
  global.fetch = vi.fn(() =>
    Promise.resolve({
      ok: false,
    }),
  );

  const response = await authService.authenticate(new AuthenticateRequest("johndoe@gmail.com", "password"));
  const auth = response.auth;

  expect(auth).toBe(null);
  expect(response.authenticated).toBe(false);
  expect(response.notification.getMessage()).toBe("Something went wrong while trying to authenticate your request");
});

test("should create user", async () => {
  
});

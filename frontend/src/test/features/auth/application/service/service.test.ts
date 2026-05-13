import { afterEach, expect, test, vi } from "vitest";
import { AuthService } from "../../../../../features/auth/application/AuthService";
import { AuthenticateRequest } from "../../../../../features/auth/application/request/AuthenticateRequest";
import { RequestHandler } from "../../../../../shared/utils/RequestHandler";
import { User } from "../../../../../features/auth/domain/User";
import { Authentication } from "../../../../../features/auth/application/response/Authentication";
import { RegisterRequest } from "../../../../../features/auth/application/request/RegisterRequest";
import type { ApiErrorResponse } from "../../../../../types";

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

  globalThis.fetch = vi.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    }),
  );

  const expectAuth = new Authentication.Builder().token("token").user(user).build();
  const response = await authService.authenticate(new AuthenticateRequest("johndoe@gmail.com", "password"));
  const auth = response.auth;

  expect(auth).toBeDefined();
  expect(auth?.toJson()).toStrictEqual(expectAuth.toJson());
  expect(response.authenticated).toBe(true);
});

test("should fail to authenticate when response is not ok ", async () => {
  globalThis.fetch = vi.fn(() =>
    Promise.resolve({
      ok: false,
    }),
  );

  const response = await authService.authenticate(new AuthenticateRequest("johndoe@gmail.com", "password"));
  const auth = response.auth;

  expect(auth).toBe(null);
  expect(response.authenticated).toBe(false);
  expect(response.notification.getMessage()).toBe(
    "Something went wrong while trying to authenticate your request, check your credentials otherwise contact the administrator",
  );
});

test("should register a user", async () => {
  const mockUser = {
    id: "uuid",
    displayName: "JohnDoe",
    photoURL: "",
  };

  const successMsg = "Your account has been created successfully. Please visit the login page to continue.";
  globalThis.fetch = vi.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve(mockUser),
    }),
  );

  const request = new RegisterRequest("JohnDoe", "john@example.com", "password123", "password123");

  const response = await authService.create(request);
  expect(response.created).toBe(true);
  expect(response.notification.getMessage()).toBe(successMsg);
  expect(response.user?.toJson()).toStrictEqual(mockUser);
});

test("should fail to register a user when the response is not ok", async () => {
  const error: ApiErrorResponse = { statusCode: 400, message: "" };
  globalThis.fetch = vi.fn(() =>
    Promise.resolve({
      ok: false,
      json: () => Promise.resolve(error),
    }),
  );
  const failMessage = "Something went wrong while trying to create your account";
  const request = new RegisterRequest("JohnDoe", "john@example.com", "password123", "password123");
  const response = await authService.create(request);
  expect(response.created).toBe(false);
  expect(response.notification.getMessage()).toBe(failMessage);
});

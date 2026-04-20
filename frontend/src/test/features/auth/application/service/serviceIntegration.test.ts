import { afterEach, expect, test, vi } from "vitest";
import { AuthService } from "../../../../../features/auth/application/AuthService";
import { AuthenticateRequest } from "../../../../../features/auth/application/request/AuthenticateRequest";
import { RequestHandler } from "../../../../../shared/utils/RequestHandler";
import { RegisterRequest } from "../../../../../features/auth/application/request/RegisterRequest";

//todo if the backend is not running this will fail
// test("should create user (integration)", async () => {
//   const authService = new AuthService(
//     "auth",
//     new RequestHandler("http://localhost:8080/api/")
//   );

//   const registerRequest = new RegisterRequest(
//     "integration-test-user",
//     "integration@test.com",
//     "password123"
//   );

//   const response = await authService.create(registerRequest);
//   console.log(response)

//   expect(response.created).toBe(true);
//   expect(response.user).not.toBeNull();
//   expect(response.notification).toBeDefined();
// });

// test("should authenticate user (integration)", async () => {
//   const authService = new AuthService("auth", new RequestHandler("http://localhost:8080/api/"));

//   const response = await authService.authenticate(new AuthenticateRequest("integration@test.com", "password123"));

//   expect(response.authenticated).toBe(true);
//   expect(response.auth).not.toBeNull();
// });

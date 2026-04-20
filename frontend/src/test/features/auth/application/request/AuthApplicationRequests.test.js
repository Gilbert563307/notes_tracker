import { expect, test } from "vitest";
import { AuthenticateRequest } from "../../../../../features/auth/application/request/AuthenticateRequest.ts";
import { RegisterRequest } from "../../../../../features/auth/application/request/RegisterRequest.ts";


test("should build authenticateRequest correct", () => {
  const authenticateRequest = new AuthenticateRequest("user@gmail.com", "password");

  expect(authenticateRequest.toJson()).toStrictEqual({
    email: "user@gmail.com",
    password: "password",
  });
});

test("should throw when building wrong authenticateRequest with no email ", () => {
  const authenticateRequest = new AuthenticateRequest("", "password");
  expect(() => authenticateRequest.toJson()).toThrow("Email is required")
});

test("should throw when building wrong authenticateRequest with no password ", () => {
  const authenticateRequest = new AuthenticateRequest("email@gmail.com", "");
  expect(() => authenticateRequest.toJson()).toThrow("Password is required")
});


test("should build RegisterRequest correctly", () => {
  const request = new RegisterRequest(
    "JohnDoe",
    "john@example.com",
    "password123",
    "password123"
  );

  expect(request.toJson()).toStrictEqual({
    displayName: "JohnDoe",
    emailAddress: "john@example.com",
    password: "password123",
    passwordConfirm: "password123",
  });
});

test("should throw when displayName is empty", () => {
  const request = new RegisterRequest(
    "",
    "john@example.com",
    "password123",
    "password123"
  );

  expect(() => request.toJson()).toThrow("Your username is required");
});

test("should throw when email is empty", () => {
  const request = new RegisterRequest(
    "JohnDoe",
    "",
    "password123",
    "password123"
  );

  expect(() => request.toJson()).toThrow("Email address is required");
});

test("should throw when email format is invalid", () => {
  const request = new RegisterRequest(
    "JohnDoe",
    "invalid-email",
    "password123",
    "password123"
  );

  expect(() => request.toJson()).toThrow("Invalid email address format");
});

test("should throw when password is too short", () => {
  const request = new RegisterRequest(
    "JohnDoe",
    "john@example.com",
    "short",
    "short"
  );

  expect(() => request.toJson()).toThrow(
    "Password must be at least 8 characters long"
  );
});

test("should throw when passwords do not match", () => {
  const request = new RegisterRequest(
    "JohnDoe",
    "john@example.com",
    "password123",
    "differentPassword"
  );

  expect(() => request.toJson()).toThrow("Passwords do not match");
});

test("should throw when passwordConfirm is empty", () => {
  const request = new RegisterRequest(
    "JohnDoe",
    "john@example.com",
    "password123",
    ""
  );

  expect(() => request.toJson()).toThrow("Passwords do not match");
});
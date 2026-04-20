import { describe, expect, test } from "vitest";
import { AuthResponse } from "../../../../../features/auth/application/response/AuthResponse";
import { User } from "../../../../../features/auth/domain/User";

const validUser = new User.Builder()
  .id("user-id")
  .displayName("displayName")
  .photoURL("photourl")
  .build();

describe("AuthResponse", () => {
  test("should build correctly using Builder", () => {
    const response = new AuthResponse.Builder()
      .token("token-123")
      .user(validUser)
      .build();

    expect(response.getToken()).toBe("token-123");
    expect(response.getUser()).toBe(validUser);
  });

  test("should throw when building without token", () => {
    expect(() =>
      new AuthResponse.Builder()
        .user(validUser)
        .build()
    ).toThrow("The user or token are null");
  });

  test("should throw when building without user", () => {
    expect(() =>
      new AuthResponse.Builder()
        .token("token-123")
        .build()
    ).toThrow("The user or token are null");
  });

  test("should throw when user is not instance of User", () => {
    expect(() =>
      new AuthResponse.Builder()
        .token("token-123")
        // @ts-expect-error forcing wrong type for runtime test
        .user({ id: "fake" })
    ).toThrow("The provided user must be an instance of the User");
  });

  test("should convert to JSON correctly", () => {
    const response = new AuthResponse.Builder()
      .token("token-123")
      .user(validUser)
      .build();

    expect(response.toJson()).toStrictEqual({
      token: "token-123",
      user: validUser.toJson(),
    });
  });

  test("toJson should throw when token is null", () => {
    const response = Object.create(AuthResponse.prototype);
    response.token = null;
    response.user = validUser;

    expect(() => response.toJson()).toThrow("The user or token are null");
  });

  test("toJson should throw when user is null", () => {
    const response = Object.create(AuthResponse.prototype);
    response.token = "token-123";
    response.user = null;

    expect(() => response.toJson()).toThrow("The user or token are null");
  });

  test("should build from cookie correctly", () => {
    const cookie = {
      token: "token-123",
      user: {
        id: "user-id",
        displayName: "displayName",
        photoURL: "photourl",
      },
    };

    const response = AuthResponse.from(cookie);

    expect(response.getToken()).toBe("token-123");
    expect(response.getUser()?.getId()).toBe("user-id");
    expect(response.getUser()?.getDisplayName()).toBe("displayName");
    expect(response.getUser()?.getPhotoURL()).toBe("photourl");
  });

  test("should throw when cookie token is missing", () => {
    expect(() =>
      AuthResponse.from({
        token: "",
        user: {
          id: "user-id",
          displayName: "displayName",
          photoURL: "photourl",
        },
      })
    ).toThrow("The user or token are null");
  });

  test("should throw when cookie user is missing", () => {
    expect(() =>
      AuthResponse.from({
        token: "token-123",
        // @ts-expect-error runtime test
        user: null,
      })
    ).toThrow("The user or token are null");
  });
});
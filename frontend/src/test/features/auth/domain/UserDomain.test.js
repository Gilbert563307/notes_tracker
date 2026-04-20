import { User } from "../../../../features/auth/domain/User.tsx";
import { expect, test } from "vitest";

test("should build user correctly", () => {
  const user = new User.Builder()
    .displayName("displayName")
    .id("user-id")
    .photoURL("photourl")
    .build();

  expect(user.getDisplayName()).toBe("displayName");
  expect(user.getId()).toBe("user-id");
  expect(user.getPhotoURL()).toBe("photourl");
});

test("should convert user to json", () => {
  const user = new User.Builder()
    .displayName("displayName")
    .id("user-id")
    .photoURL("photourl")
    .build();

  expect(user.toJson()).toStrictEqual({
    id: "user-id",
    displayName: "displayName",
    photoURL: "photourl",
  });
});

test("should build user using static from()", () => {
  const user = User.from({
    id: "user-id",
    displayName: "displayName",
    photoURL: "photourl",
  });

  expect(user.getId()).toBe("user-id");
  expect(user.getDisplayName()).toBe("displayName");
  expect(user.getPhotoURL()).toBe("photourl");
});

test("should throw when id is empty", () => {
  const build = () =>
    new User.Builder()
      .displayName("displayName")
      .id("")
      .photoURL("photourl")
      .build();

  expect(build).toThrow("User id is required");
});

test("should throw when displayName is empty", () => {
  const build = () =>
    new User.Builder()
      .displayName("")
      .id("user-id")
      .photoURL("photourl")
      .build();

  expect(build).toThrow("Display name is required");
});

test("should throw when photoURL is empty", () => {
  const build = () =>
    new User.Builder()
      .displayName("displayName")
      .id("user-id")
      .photoURL("")
      .build();

  expect(build).toThrow("Photo URL is required");
});

test("should throw when values are only whitespace", () => {
  const build = () =>
    new User.Builder()
      .displayName("   ")
      .id("   ")
      .photoURL("   ")
      .build();

  expect(build).toThrow("User id is required");
});
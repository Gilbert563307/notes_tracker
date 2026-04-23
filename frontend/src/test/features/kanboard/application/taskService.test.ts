import { afterEach, expect, test, vi } from "vitest";
import type { getKanBoardsResponse } from "../../../../features/auth/types";
import { KanBoardService } from "../../../../features/kanboard/application/KanBoardService";
import { RequestHandler } from "../../../../shared/utils/RequestHandler";
import { UseCookieStorage } from "../../../../shared/utils/UseCookieStorage";
import type { ApiErrorResponse } from "../../../../types";
import { CreateKanBoardRequest } from "../../../../features/kanboard/application/request/CreateKanBoardRequest";

const MOCK_BACKEND_URL = "http://localhost:8080/api/";

const mockCookieStorage = {
  readCookieValue: vi.fn().mockResolvedValue(JSON.stringify({ token: "fake-token" })),
} as unknown as UseCookieStorage;

const kanBoardService = new KanBoardService("kanboard", new RequestHandler(MOCK_BACKEND_URL), mockCookieStorage);

afterEach(() => {
  vi.clearAllMocks(); // Reset all mocked calls between tests
});

test("should get all kanboards", async () => {
  const mockResponse: getKanBoardsResponse = {
    content: [
      {
        id: "1",
        name: "Board 1",
        userId: "user-1",
        color: "#1e8bac44",
        archived: false,
        collaborative: false,
        imageUrl: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "2",
        name: "Board 2",
        userId: "user-1",
        color: "#0f0d0d44",
        archived: false,
        collaborative: true,
        imageUrl: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "3",
        name: "Board 3",
        userId: "user-1",
        color: "#a8101044",
        archived: false,
        collaborative: false,
        imageUrl: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ],
    empty: false,
    first: true,
    last: true,
    number: 0,
    numberOfElements: 3,
    pageable: {},
    size: 10,
    sort: {},
    totalElements: 3,
    totalPages: 1,
  };

  global.fetch = vi.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    }),
  );

  const response = await kanBoardService.getKanBoards();
  expect(response.data.boards.length).toBe(3);
  expect(response.data.pages).toBe(1);
  expect(response.data.total).toBe(3);
  expect(response.notification.getMessage()).toBe("");
});

test("should fail to get all kanboards when response is not oke", async () => {
  const error: ApiErrorResponse = { statusCode: 400, message: "" };

  global.fetch = vi.fn(() =>
    Promise.resolve({
      ok: false,
      json: () => Promise.resolve(error),
    }),
  );

  const response = await kanBoardService.getKanBoards();
  expect(response.data.boards.length).toBe(0);
  expect(response.data.pages).toBe(0);
  expect(response.data.total).toBe(0);
  expect(response.notification.getMessage()).toBe("Failed to load kanban boards. Please try again.");
});

test("should create a kanboard successfully", async () => {
  global.fetch = vi.fn(() =>
    Promise.resolve({
      ok: true,
    }),
  );

  const response = await kanBoardService.createKanBoard(new CreateKanBoardRequest("Test board", "#fff"));

  expect(response.created).toBe(true);
  expect(response.notification.getMessage()).toBe("Your kan board has been created");
});

test("should fail to create a kanboard with api message", async () => {
  global.fetch = vi.fn(() =>
    Promise.resolve({
      ok: false,
      json: () => Promise.resolve({ message: "Custom error" }),
    }),
  );

  const response = await kanBoardService.createKanBoard(new CreateKanBoardRequest("Test board", "#fff"));

  expect(response.created).toBe(false);
  expect(response.notification.getMessage()).toBe("Custom error");
});

test("should fail to create a kanboard with fallback message", async () => {
  global.fetch = vi.fn(() =>
    Promise.resolve({
      ok: false,
      json: () => Promise.resolve({}), // no message
    }),
  );

  const response = await kanBoardService.createKanBoard(new CreateKanBoardRequest("Test board", "#fff"));

  expect(response.created).toBe(false);
  expect(response.notification.getMessage()).toBe("Failed to create kanban board. Please try again.");
});

test("should handle exception when creating a kanboard", async () => {
  global.fetch = vi.fn(() => Promise.reject(new Error("Network error")));

  const response = await kanBoardService.createKanBoard(new CreateKanBoardRequest("Test board", "#fff"));

  expect(response.created).toBe(false);
  expect(response.notification.getMessage()).toBe("Network error");
});

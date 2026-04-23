import { describe, it, expect, test } from "vitest";
import { KanBoardMapper } from "../../../../../features/kanboard/application/mapper/KanBoardMapper";
import type { getKanBoardsResponse, KanBoardItem } from "../../../../../features/auth/types";
import { KanBoard } from "../../../../../features/kanboard/domain/KanBoard";
import { CreateKanBoardRequest } from "../../../../../features/kanboard/application/request/CreateKanBoardRequest";

describe("KanBoardMapper", () => {
  describe("findAllResponseToDomain", () => {
    it("should map response to domain correctly", () => {
      const response: getKanBoardsResponse = {
        totalElements: 2,
        totalPages: 1,
        content: [
          {
            id: "1",
            name: "Board 1",
            userId: "user-1",
            color: "#fff",
            archived: false,
            collaborative: true,
            imageUrl: null,
            createdAt: "2024-01-01T00:00:00Z",
            updatedAt: "2024-01-02T00:00:00Z",
          },
          {
            id: "2",
            name: "Board 2",
            userId: "user-2",
            color: "#000",
            archived: true,
            collaborative: false,
            imageUrl: "img.png",
            createdAt: "2024-01-01T00:00:00Z",
            updatedAt: "2024-01-02T00:00:00Z",
          },
        ],
        empty: false,
        first: true,
        last: false,
        number: 0,
        numberOfElements: 2,
        pageable: {},
        size: 10,
        sort: {},
      };

      const result = KanBoardMapper.findAllResponseToDomain(response);

      expect(result.total).toBe(2);
      expect(result.pages).toBe(1);
      expect(result.boards).toHaveLength(2);
      expect(result.boards[0]).toBeInstanceOf(KanBoard);
      expect(result.boards[0].getName()).toBe("Board 1");
    });

    it("should throw error when response is null", () => {
      // @ts-expect-error testing invalid input
      expect(() => KanBoardMapper.findAllResponseToDomain(null)).toThrow("No response to map");
    });
  });

  test("should map CreateKanBoardRequest to json payload", () => {
    const request = new CreateKanBoardRequest("My Board", "#123456");

    const result = KanBoardMapper.toCreateKanBoardRequest(request);

    expect(result.name).toBe("My Board");
    expect(result.color).toBe("#123456");
    expect(result.archived).toBe(false);
    expect(result.collaborative).toBe(false);
    expect(result.imageUrl).toBe("");
  });

  describe("toKanBoard", () => {
    it("should map KanBoardItem to KanBoard domain", () => {
      const data: KanBoardItem = {
        id: "123",
        name: "Test Board",
        userId: "user-123",
        color: "#ff0000",
        archived: false,
        collaborative: true,
        imageUrl: null,
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2024-01-02T00:00:00Z",
      };

      const result = KanBoardMapper.toKanBoard(data);

      expect(result).toBeInstanceOf(KanBoard);
      expect(result.getId()).toBe("123");
      expect(result.getName()).toBe("Test Board");
      expect(result.getUserId()).toBe("user-123");
      expect(result.getColor()).toBe("#ff0000");
      expect(result.isArchived()).toBe(false);
      expect(result.isCollaborative()).toBe(true);
    });
  });
});

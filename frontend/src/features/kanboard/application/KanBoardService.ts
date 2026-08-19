import { RequestHandler } from "../../../shared/utils/RequestHandler";
import { NotificationDto } from "../../../shared/features/notification/domain/dto/NotificationDto";
import type { CreateKanBoardRequest } from "./request/CreateKanBoardRequest";
import { KanBoardMapper } from "./mapper/KanBoardMapper";
import type { getKanBoardsResponse, getTasksByKanBoardIdResponse } from "../../auth/types";
import type { KanBoard } from "../domain/KanBoard";
import type { Task } from "../domain/Task";
import { TaskMapper } from "./mapper/TaskMapper";
import type { ApiErrorResponse } from "../../../types";
import type { CreateKanBoardTaskRequest } from "../presentation/request/CreateKanBoardTaskRequest";
import { CreateTaskRequest } from "../presentation/request/CreateTaskRequest";
import {
  EmptySearchTermException,
  FailedToCreateTaskIntoProjectException,
  FailedToDeleteKanBoardException,
  FailedToFindTasksException,
  FailedToFindYourKanBoardException,
  FailedToLoadKanBoardsException,
  FailedToUpdateKanBoardException,
} from "../presentation/exceptions/exceptions";
import { OAuth2ResourceService } from "../../../shared/utils/OAuth2ResourceService";
import { JsonParsingError } from "../../../shared/exceptions/exceptions";

export const KAN_BOARD_RESOURCE = "kanboard";

export class KanBoardService extends OAuth2ResourceService {
  constructor(resource: string, requestHandler: RequestHandler) {
    super(resource, requestHandler);
  }

  async getKanBoards(): Promise<{
    total: number;
    pages: number;
    boards: KanBoard[];
  }> {
    const response = await super.findAll();

    if (!response.ok) {
      try {
        const data: ApiErrorResponse = await response.json();
        throw new FailedToLoadKanBoardsException(data.message);
      } catch (error) {
        throw new FailedToLoadKanBoardsException();
      }
    }

    const responseData: getKanBoardsResponse = await response.json();
    return KanBoardMapper.findAllResponseToDomain(responseData);
  }

  async createKanBoard(request: CreateKanBoardRequest): Promise<{ notification: NotificationDto; created: boolean }> {
    try {
      const kanBoard = KanBoardMapper.toCreateKanBoardRequest(request);
      const response = await super.create(kanBoard);

      if (!response.ok) {
        const data: ApiErrorResponse = await response.json();
        return {
          notification: new NotificationDto.Builder()
            .danger()
            .message(data.message || "Failed to create kanban board. Please try again.")
            .build(),
          created: false,
        };
      }

      return {
        notification: new NotificationDto.Builder().success().message("Your kan board has been created").build(),
        created: true,
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      return {
        notification: new NotificationDto.Builder().danger().message(message).build(),
        created: false,
      };
    }
  }

  async getKanBoardById(id: string): Promise<KanBoard> {
    const response = await super.read(id);

    if (!response.ok) {
      throw new FailedToFindYourKanBoardException();
    }

    try {
      const data = await response.json();
      return KanBoardMapper.toKanBoard(data);
    } catch (error) {
      throw new JsonParsingError(error?.message);
    }
  }

  async createNewTaskInKanBoard(request: CreateKanBoardTaskRequest): Promise<Array<Task>> {
    request.validate();
    //TODO MAKE URL CONSTRUCT EASIER
    const url = `${super.getRequestHandler().getBaseUrl()}${super.getResource()}/${request.getKanBoardId()}/task`;
    const response = await super
      .getRequestHandler()
      .perform(
        new RequestHandler.RequestBuilder()
          .patch()
          .withCredentials()
          .content(
            new CreateTaskRequest.Builder()
              .title(request.getTitle())
              .description(request.getDescription())
              .status(request.getStatus())
              .build()
              .toJson(),
          )
          .url(url)
          .build(),
      );

    if (!response.ok) {
      const data: ApiErrorResponse = await response.json();
      if (data.message) throw new Error(data.message);
      throw new FailedToCreateTaskIntoProjectException();
    }

    let data: getTasksByKanBoardIdResponse;
    try {
      data = await response.json();
    } catch (error) {
      throw new JsonParsingError(error?.message);
    }

    return TaskMapper.toTaskList(data);
  }

  //TODO NEEDS VI TESTING
  async getTasksByKanBoardId(boardId: string): Promise<Array<Task>> {
    const url: string = `${super.getRequestHandler().getBaseUrl()}${super.getResource()}/${boardId}/tasks`;

    const response = await super
      .getRequestHandler()
      .perform(new RequestHandler.RequestBuilder().get().withCredentials().url(url).build());

    if (!response.ok) {
      try {
        const data: ApiErrorResponse = await response.json();
        if (data.message) throw new Error(data.message);
        throw new FailedToFindTasksException();
      } catch (error) {
        throw new FailedToFindTasksException();
      }
    }

    const data: getTasksByKanBoardIdResponse = await response.json();
    return TaskMapper.toTaskList(data);
  }

  async updateKanBoard(data: { name: string; color: string }, kanBoard: KanBoard | undefined): Promise<boolean> {
    if (!kanBoard) {
      throw new FailedToFindYourKanBoardException();
    }
    kanBoard?.updateNameAndColor(data.name, data.color);
    const response = await super.update(kanBoard.toJsonWithoutTasks());

    if (!response.ok) {
      const data: ApiErrorResponse = await response.json();
      if (data.message) throw new Error(data.message);
      throw new FailedToUpdateKanBoardException();
    }
    return true;
  }

  async deleteKanBoard(id: string | undefined): Promise<boolean> {
    if (!id) {
      throw new FailedToDeleteKanBoardException();
    }
    const response = await super.delete(id);
    if (!response.ok) {
      const data: ApiErrorResponse = await response.json();
      if (data.message) throw new Error(data.message);
      throw new FailedToDeleteKanBoardException();
    }
    return true;
  }

  //TODO NEEDS TESTING
  async searchKanBoard(value: string) : Promise<Array<KanBoard>> {
    if (!value) {
      throw new EmptySearchTermException();
    }

    const response = await super.search(new Map([["name", value]]));
    if (!response.ok) {
      const data: ApiErrorResponse = await response.json();
      if (data.message) throw new Error(data.message);
      throw new FailedToLoadKanBoardsException();
    }

    const data: Array<KanBoard> = await response.json();
    return KanBoardMapper.toKanBoardList(data);
  }
}

const kanBoardService = new KanBoardService(
  KAN_BOARD_RESOURCE,
  new RequestHandler(import.meta.env.VITE_APP_BACKEND_URL),
);
export { kanBoardService };

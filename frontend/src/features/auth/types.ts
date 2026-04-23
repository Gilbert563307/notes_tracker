import type { TaskProps } from "../kanboard/domain/Task";
import type { User } from "./domain/User";

export type CreateUserResponse = {
  created: boolean;
  message: string;
  user: User | null;
};

export type getTasksByKanBoardIdResponse = Array<TaskProps>;

export type getKanBoardsResponse = {
  content: KanBoardItem[];
  empty: boolean;
  first: boolean;
  last: boolean;
  number: number;
  numberOfElements: number;
  pageable: Pageable;
  size: number;
  sort: Sort;
  totalElements: number;
  totalPages: number;
};

export type KanBoardItem = {
  id: string;
  name: string;
  userId: string;
  color: string;
  archived: boolean;
  collaborative: boolean;
  imageUrl: string | null;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
};

export type Pageable = {
  offset: number;
  pageNumber: number;
  pageSize: number;
  paged: boolean;
  sort: Sort;
  unpaged: boolean;
};

export type Sort = {
  empty: boolean;
  sorted: boolean;
  unsorted: boolean;
};

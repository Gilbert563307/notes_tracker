import type { TaskProps } from "../../domain/Task";

export type TaskInformationResponse = {
  task: TaskProps;
  projectName: string;
  assignee: string;
  reporter: string;
};


export interface Pageable {
    offset: number;
    pageNumber: number;
    pageSize: number;
    paged: boolean;
    sort: {
        empty: boolean;
        sorted: boolean;
        unsorted: boolean;
    };
    unpaged: boolean;
}

export interface findAllResponse<T> {
    content: T[];
    empty: boolean;
    first: boolean;
    last: boolean;
    number: number;
    numberOfElements: number;
    pageable: Pageable;
    size: number;
    sort: {
        empty: boolean;
        sorted: boolean;
        unsorted: boolean;
    };
    totalElements: number;
    totalPages: number;
}
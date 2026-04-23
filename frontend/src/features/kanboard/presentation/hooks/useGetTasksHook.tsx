import { useState } from "react";
import type { Task } from "../../domain/Task";
import usePaginationHook from "../../../../shared/features/pagination/presentation/hooks/usePaginationHook";

export default function useGetTasksHook() {
  const [data, setData] = useState<{ tasks: Array<Task>; total: number; pages: number }>({
    tasks: [],
    total: 0,
    pages: 0,
  });

  async function fetchTasks() {}
  usePaginationHook({ methodToCall: fetchTasks });
  return {
    tasks: data.tasks,
    total: data.total,
    pages: data.pages,
  };
}

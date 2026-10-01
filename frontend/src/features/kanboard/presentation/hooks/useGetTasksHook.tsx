import { useEffect, useState } from "react";
import type { Task } from "../../domain/Task";
import usePaginationHook from "../../../../shared/features/pagination/presentation/hooks/usePaginationHook";
import { taskController } from "../TaskController";

export default function useGetTasksHook() {
  const [data, setData] = useState<{ tasks: Array<Task>; totalElements: number; totalPages: number }>({
    tasks: [],
    totalElements: 0,
    totalPages: 0,
  });

  async function fetchTasks() {
    const response = await taskController.getTasksByCurrentUser();
    setData(response);
  }
  // usePaginationHook({ methodToCall: fetchTasks });
  useEffect(() => {
    fetchTasks();
  }, []);

  return {
    tasks: data.tasks,
    total: data.totalElements,
    pages: data.totalPages,
  };
}

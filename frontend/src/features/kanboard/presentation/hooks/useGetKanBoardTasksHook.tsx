import { useEffect, useState } from "react";
import type { Task } from "../../domain/Task";
import { kanBoardController } from "../KanBoardController";

export default function useGetKanBoardTasksHook({ boardId }: { boardId: string }) {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    let isMounted: boolean = true;

    async function fetchTasks() {
      if (!boardId) return;
      const response = await kanBoardController.getTasksByKanBoardId(boardId);
      if (!isMounted) return;
      if (response.tasks.length === 0) return;
      setTasks(response.tasks);
    }

    fetchTasks();

    return () => {
      isMounted = false;
    };
  }, []);
  return { tasks };
}

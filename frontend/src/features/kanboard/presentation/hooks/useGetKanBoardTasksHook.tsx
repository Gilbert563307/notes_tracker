import { useEffect, useState } from "react";
import type { Task } from "../../domain/Task";
import { kanBoardController } from "../KanBoardController";

export default function useGetKanBoardTasksHook({ kanBoardId }: { kanBoardId: string }) {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    let isMounted: boolean = true;

    async function fetchTasks() {
      if (!kanBoardId) return;
      const response = await kanBoardController.getTasksByKanBoardId(kanBoardId);
      if (!isMounted) return;
      if (response.length === 0) return;
      setTasks(response);
    }

    fetchTasks();

    return () => {
      isMounted = false;
    };
  }, []);
  return { tasks };
}

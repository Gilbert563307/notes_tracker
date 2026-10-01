import { kanBoardController } from "../KanBoardController";
import { useQuery } from "@tanstack/react-query";

export default function useGetKanBoardTasksHook({ kanBoardId }: { kanBoardId: string }) {
  async function fetchTasks() {
    return await kanBoardController.getTasksByKanBoardId(kanBoardId);
  }
  const { isPending, error, data } = useQuery({ queryKey: ["tasks"], queryFn: fetchTasks });
  return { isPending, error, tasks: data };
}

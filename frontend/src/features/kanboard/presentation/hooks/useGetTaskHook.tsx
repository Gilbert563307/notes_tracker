import { useParams } from "react-router";
import { Task } from "../../domain/Task";
import { taskController } from "../TaskController";
import { useQuery } from "@tanstack/react-query";

export default function useGetTaskHook() {
  const { taskId } = useParams();

  async function fetchTaskById(id: string) {
    if (!id) return new Task.Builder().skipValidation().build();
    return await taskController.getTaskById(id);
  }

  const { isPending, error, data } = useQuery({ queryKey: ["task"], queryFn: () => fetchTaskById(taskId) });
  return { isPending, error, task: data };
}

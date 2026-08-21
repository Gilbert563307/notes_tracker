import useGetTaskHook from "../../features/kanboard/presentation/hooks/useGetTaskHook";
import UpdateTaskComponent from "../../features/kanboard/presentation/components/task/UpdateTaskComponent";
import { taskController } from "../../features/kanboard/presentation/TaskController";
import { useNavigate } from "react-router";
import useSetPageTitleHook from "../../shared/hooks/useSetPageTitleHook";
import type { Task } from "../../features/kanboard/domain/Task";

export default function UpdateTaskPage() {
  const navigate = useNavigate();
  useSetPageTitleHook({ title: "Tasks" });
  const { task } = useGetTaskHook();

  async function deleteTask() {
    if (!task.getId()) return;
    const response = await taskController.deleteTaskById(task.getId());
    if (!response) return;
    navigate("/tasks");
  }

  async function updateTask(updateTaskData: Task) {
    if (!task.getId()) return;
    await taskController.updateTask(updateTaskData);
  }

  return <UpdateTaskComponent task={task} deleteTask={deleteTask} updateTask={updateTask} />;
}

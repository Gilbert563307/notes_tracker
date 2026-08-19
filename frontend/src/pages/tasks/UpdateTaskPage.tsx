import useGetTaskHook from "../../features/kanboard/presentation/hooks/useGetTaskHook";
import UpdateTaskComponent from "../../features/kanboard/presentation/components/UpdateTaskComponent";
import { taskController } from "../../features/kanboard/presentation/TaskController";
import { useNavigate } from "react-router";

export default function UpdateTaskPage() {
  const navigate = useNavigate();
  const { task } = useGetTaskHook();

  async function deleteTask() {
    if (!task.getId()) return;
    const response = await taskController.deleteTaskById(task.getId());
    if (!response) return;
    navigate("/tasks");
  }

  return <UpdateTaskComponent task={task} deleteTask={deleteTask} />;
}

import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { Task } from "../../domain/Task";
import { taskController } from "../TaskController";

export default function useGetTaskHook() {
  const { taskId } = useParams();
  const [task, setTask] = useState(new Task.Builder().skipValidation().build());

  useEffect(() => {
    const fetchTaskById = async (taskId: string) => {
      if (!taskId) return;

      const response = await taskController.getTaskById(taskId);
      if (!response) return;
      setTask(response);
    };

    fetchTaskById(taskId);
  }, [taskId]);

  return { task };
}

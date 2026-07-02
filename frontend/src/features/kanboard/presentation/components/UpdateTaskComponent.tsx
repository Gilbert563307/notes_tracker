import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Task, type TaskStatus } from "../../domain/Task";

type props = {
  task: Task;
};

type customFieldsType = {
  status: TaskStatus;
  priority: number;
  description: string;
};

export default function UpdateTaskComponent({ task }: props) {
  const [customFields, setCustomFields] = useState<customFieldsType>({
    status: "BACKLOG",
    priority: 0,
    description: "",
  });

  function handleCustomFieldChange(field: "status" | "priority" | "description", value: TaskStatus | number | string) {
    setCustomFields((prevFields) => ({ ...prevFields, [field]: value }));
  }

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({});

  const onSubmit = (data) => {
    const { title } = data;

    const updatedTask = new Task.Builder()
      .id(task.getId())
      .title(title)
      .description(customFields.description)
      .status(customFields.status)
      .priority(customFields.priority)
      .assigneId(task.getAssigneId())
      .archived(task.isArchived())
      .createdAt(task.getCreatedAt())
      .updatedAt(task.getUpdatedAt())
      .build();
  };

  return <div>UpdateTaskComponent</div>;
}

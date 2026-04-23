import React from "react";
import useSetPageTitleHook from "../../shared/hooks/useSetPageTitleHook";
import useGetTasksHook from "../../features/kanboard/presentation/hooks/useGetTasksHook";

export default function ListTasksPage() {
  useSetPageTitleHook({ title: "Tasks " });
  const { tasks, totalTasks, totalPages } = useGetTasksHook();

  return <div>ListTasksPage</div>;
}

import React from "react";
import { useParams } from "react-router";
import useGetKanBoardTasksHook from "../../features/kanboard/presentation/hooks/useGetKanBoardTasksHook";

export default function ReadKanBoardPage() {
  const { kanBoardId } = useParams();

  const { tasks } = useGetKanBoardTasksHook({ kanBoardId: kanBoardId });

  return <div>ReadKanBoardPage</div>;
}

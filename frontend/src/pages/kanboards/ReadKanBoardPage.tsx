import { useParams } from "react-router";
import { KanBoard } from "../../features/kanboard/domain/KanBoard";
import { Task } from "../../features/kanboard/domain/Task";
import "../../features/kanboard/presentation/css/readkanboardpage.css";
import KanBoardColumn from "../../features/kanboard/presentation/components/KanBoardColumn";
import {
  KANBOARD_PAGE_ACTIONS,
  useReadKanBoardPageContext,
} from "../../features/kanboard/presentation/context/ReadKanBoardPageContext";

import { useEffect } from "react";
const HEADERS = KanBoard.getDefaultHeaders();

export default function ReadKanBoardPage() {
  const { state, dispatch } = useReadKanBoardPageContext();
  const { kanBoardId } = useParams();

  function handleDragEnter(event: DragEvent) {
    console.log(event)
  }

  function handleOnDrop(e){
    console.log("drop", e)
  }

  function handleDragStart(taskId: string) {
    console.log(taskId)
  }

  function getTasksByHeaderId(tasks: Array<Task>, headerId: string) {
    return tasks.filter((task) => task.getStatus() === headerId);
  }

  useEffect(() => {
    dispatch({ type: KANBOARD_PAGE_ACTIONS.LIST_TASKS_BY_KANBOARD_ID, payload: kanBoardId });
  }, []);

  return (
    <section className="read-kanboard-page">
      <article className="main-board">
        <article className="main-columns">
          {HEADERS.map((header) => (
            <KanBoardColumn
              key={header.id}
              headerId={header.id}
              title={header.title}
              tasks={getTasksByHeaderId(state.tasks, header.id)}
              kanBoardId={kanBoardId}
              onDragEnter={handleDragEnter}
              handleDragStart={handleDragStart}
              handleOnDrop={handleOnDrop}
            ></KanBoardColumn>
          ))}
        </article>
      </article>
    </section>
  );
}

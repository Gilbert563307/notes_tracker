import { useParams } from "react-router";
import { KanBoard } from "../../features/kanboard/domain/KanBoard";
import { Task, type TaskStatus } from "../../features/kanboard/domain/Task";
import "../../features/kanboard/presentation/css/readkanboardpage.css";
import KanBoardColumn from "../../features/kanboard/presentation/components/KanBoardColumn";
import {
  KANBOARD_PAGE_ACTIONS,
  useReadKanBoardPageContext,
} from "../../features/kanboard/presentation/context/ReadKanBoardPageContext";

import { useEffect, useRef, useState } from "react";
import { taskController } from "../../features/kanboard/presentation/TaskController";

const HEADERS = KanBoard.getDefaultHeaders();
const TWO_HUNDRED_FITY_MIL_DELA: number = 250;

export default function ReadKanBoardPage() {
  const { state, dispatch } = useReadKanBoardPageContext();
  const { kanBoardId } = useParams();
  const [draggingTask, setDraggingTask] = useState<Task>(new Task.Builder().skipValidation().build());

  // Ref to store the timeout ID for cleanup
  const timeoutRef = useRef(null);

  //todo figure out something smarter for this
  function handleDragEnter(newStatus: TaskStatus) {
    if (!draggingTask) return;
    const shouldTaskBeUpdated = draggingTask.shouldTaskBeUpdated(newStatus);
    if (!shouldTaskBeUpdated) return;
    draggingTask.updateStatus(newStatus);
    //update task in local state
    dispatch({
      type: KANBOARD_PAGE_ACTIONS.UPDATE_LOCAL_TASKS_STATE,
      payload: { toUpdateTask: draggingTask, currentTasksList: state.tasks },
    });

    // Clear any existing timeout to prevent duplicate calls
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    updateTask(draggingTask);
    timeoutRef.current = setTimeout(async () => await updateTask(draggingTask), TWO_HUNDRED_FITY_MIL_DELA);
  }

  async function updateTask(task: Task) {
    await taskController.updateTask(task);
  }

  function handleDragStart(task: Task) {
    setDraggingTask(task);
  }

  function getTasksByHeaderId(tasks: Array<Task>, headerId: string) {
    return tasks.filter((task) => task.getStatus() === headerId);
  }

  useEffect(() => {
    dispatch({ type: KANBOARD_PAGE_ACTIONS.LIST_TASKS_BY_KANBOARD_ID, payload: kanBoardId });
    return () => clearTimeout(timeoutRef.current);
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
              onDragEnter={() => handleDragEnter(header.id)}
              handleDragStart={handleDragStart}
            ></KanBoardColumn>
          ))}
        </article>
      </article>
    </section>
  );
}

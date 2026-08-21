import type { Task, TaskStatus } from "../../domain/Task";
import { Link } from "react-router";
import CreateCardButton from "./CreateCardButton";
import { CreateKanBoardTaskRequest } from "../request/CreateKanBoardTaskRequest";
import { kanBoardController } from "../KanBoardController";
import { KANBOARD_PAGE_ACTIONS, useReadKanBoardPageContext } from "../context/ReadKanBoardPageContext";

type componentProps = {
  title: string;
  headerId: TaskStatus;
  tasks: Array<Task>;
  kanBoardId: string;
  onDragEnter: () => void;
  handleDragStart: () => void;
  handleOnDrop: () => void;
};

export default function KanBoardColumn({
  title,
  headerId,
  tasks,
  kanBoardId,
  onDragEnter,
  handleDragStart,
  handleOnDrop,
}: componentProps) {
  const { dispatch } = useReadKanBoardPageContext();

  async function createTaskInKanBoard(data: { title: string; description: string }) {
    const response = await kanBoardController.createNewTaskInKanBoard(
      new CreateKanBoardTaskRequest({ title: data.title, description: data.description, status: headerId }, kanBoardId),
    );

    if (response?.length === 0) return;
    dispatch({ type: KANBOARD_PAGE_ACTIONS.LIST_TASKS_BY_KANBOARD_ID, payload: kanBoardId });
  }

  return (
    <div className="card-own" onDragEnter={onDragEnter}>
      <p className="card-parent-header">
        {title} <span className="badge rounded-pill text-bg-light">{tasks.length}</span>
      </p>

      <div className="card-body-own">
        <div className="board-tasks" onDrop={handleOnDrop}>
          {tasks.length > 0 ? (
            tasks.map((task) => {
              const id = task.getId();
              const readTaskUrl = `/tasks/read/${id}`;

              return (
                <div
                  key={id}
                  onDragStart={() => handleDragStart(id)}
                  draggable
                  className="board-card-item shadow-sm rounded"
                >
                  <Link
                    to={readTaskUrl}
                    title={task.getTitle()}
                    state={{ task: task }}
                    className="read-link board-card-title"
                  >
                    {task.getTitle()}
                  </Link>
                  {/* TODO */}
                  {/* <div className="board-card-information">
                    <span className="badge text-bg-light">
                      {task.created_at.toLocaleString()}
                    </span>
                  </div> */}
                </div>
              );
            })
          ) : (
            <p className="empty-column-message">No tasks available</p>
          )}
        </div>
      </div>

      <CreateCardButton headerId={headerId} createTaskInKanBoard={createTaskInKanBoard} />
    </div>
  );
}

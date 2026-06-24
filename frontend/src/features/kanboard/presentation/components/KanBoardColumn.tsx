import type { Task } from "../../domain/Task";
import { Link, useNavigate } from "react-router";
import CreateCardButton from "./CreateCardButton";
import { CreateKanBoardTaskRequest } from "../request/CreateKanBoardTaskRequest";
import { kanBoardController } from "../KanBoardController";

type componentProps = {
  title: string;
  headerId: string;
  tasks: Array<Task>;
  kanBoardId: string;
  onDragEnter: () => void;
  handleDragStart: () => void;
};

export default function KanBoardColumn({
  title,
  headerId,
  tasks,
  kanBoardId,
  onDragEnter,
  handleDragStart,
}: componentProps) {
  
  
  async function createTaskInKanBoard(data: { title: string; description: string }) {
    const response = await kanBoardController.createNewTaskInKanBoard(
      new CreateKanBoardTaskRequest({ title: data.title, description: data.description }, kanBoardId),
    );

    if (response?.length === 0) return;
   
  }

  return (
    <div className="card-own" onDragEnter={onDragEnter}>
      <p className="card-parent-header">
        {title} <span className="badge rounded-pill text-bg-light">{tasks.length}</span>
      </p>

      <div className="card-body-own">
        <div className="board-tasks">
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

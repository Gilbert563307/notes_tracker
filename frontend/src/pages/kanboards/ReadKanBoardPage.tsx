import { useParams } from "react-router";
import useGetKanBoardTasksHook from "../../features/kanboard/presentation/hooks/useGetKanBoardTasksHook";
import { KanBoard } from "../../features/kanboard/domain/KanBoard";
import { Task } from "../../features/kanboard/domain/Task";
import "../../features/kanboard/presentation/css/readkanboardpage.css";
import AddTaskToKanBoardButton from "../../features/kanboard/presentation/components/AddTaskToKanBoardButton";

export default function ReadKanBoardPage() {
  const { kanBoardId } = useParams();
  const { tasks } = useGetKanBoardTasksHook({ kanBoardId });

  console.log(tasks);

  const columns = KanBoard.getDefaultHeaders();
  const kanBoardName = "kanboard name";

  return (
    <section className="container-fluid  min-vh-100 p-4">
      {/* Search Header */}
      <div className="row mb-4">
        <div className="col">
          <div className="input-group bg-white shadow-sm rounded border-0">
            <span className="input-group-text bg-white border-0 text-primary">
              <i className="fa-solid fa-magnifying-glass kanboard-search-glass"></i>
            </span>
            <input type="text" className="form-control border-0 shadow-none" placeholder="Search.." />
          </div>
        </div>
      </div>

      {/* Kanban Board Horizontal Scroll Wrapper */}
      <article className="d-flex flex-nowrap overflow-auto pb-3 kan-board-article">
        {columns.map((col) => {
          const columnTasks = [];

          return (
            <div key={col.id} style={{ minWidth: "350px", flex: "0 0 auto" }} className="kan-board-column">
              {/* Column Header */}
              <div className="d-flex align-items-center justify-content-between px-1 mb-1 ">
                <div className="d-flex align-items-center">
                  <span className={`me-2 ${col.color}`} style={{ fontSize: "1.2rem" }}>
                    <i className="fa-solid fa-o"></i>
                  </span>
                  <strong className="kanboard-card-title">{col.title}</strong>
                  <span className="badge rounded-pill bg-secondary bg-opacity-25 text-secondary small">
                    {columnTasks.length}
                  </span>
                </div>
                <div className="kanboard-action-buttons">
                  <button className="text-muted small btn btn-light" type="button">
                    <span>...</span>
                  </button>
                  <button type="button" className="btn btn-light">
                    <i className="fa-solid fa-plus"></i>
                  </button>
                </div>
              </div>

              <p className="text-muted mb-3 ps-1" style={{ fontSize: "0.75rem", minHeight: "1rem" }}>
                {col.description}
              </p>

              {/* Task Cards Container */}
              <div className="d-flex flex-column" style={{ gap: "0.75rem" }}>
                {columnTasks.map((task) => (
                  <div key={task.getId()} className="card shadow-sm border-0 rounded-3 kanban-card">
                    <div className="card-body p-3">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <small className="text-muted font-monospace" style={{ fontSize: "0.7rem" }}>
                          projectName #{task.getId()}
                        </small>
                        <div
                          className="rounded-circle bg-secondary bg-opacity-10 border"
                          style={{ width: "20px", height: "20px" }}
                        ></div>
                      </div>

                      <p className="card-text mb-0" style={{ fontSize: "0.85rem", color: "#333", lineHeight: "1.4" }}>
                        {task.getTitle()}
                      </p>
                    </div>
                  </div>
                ))}

                {/* The "Add item" button at the end of the column - */}
                <AddTaskToKanBoardButton kanBoardId={kanBoardId} />
              </div>
            </div>
          );
        })}

        {/* Global Add Column Button */}
        {/* <div className="pt-1">
          <button
            className="btn btn-white bg-white shadow-sm border-0 text-muted"
            style={{ width: "40px", height: "40px" }}
          >
            +
          </button>
        </div> */}
      </article>
    </section>
  );
}

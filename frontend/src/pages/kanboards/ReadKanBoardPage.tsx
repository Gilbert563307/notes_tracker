import { useParams } from "react-router";
import useGetKanBoardTasksHook from "../../features/kanboard/presentation/hooks/useGetKanBoardTasksHook";
import { KanBoard } from "../../features/kanboard/domain/KanBoard";
import { Task } from "../../features/kanboard/domain/Task";
import "../../features/kanboard/presentation/css/readkanboardpage.css";
import { Show } from "../../shared/features/show/Show";
import AddTaskToKanBoardButton from "../../features/kanboard/presentation/components/AddTaskToKanBoardButton";

// Helper to create mock tasks using your Builder pattern
const mockTasks = [
  new Task.Builder()
    .id("59")
    .title("Als docent wil ik een GAME aan een skilltree kunnen koppelen")
    .status("TODO")
    .assigneId("user1")
    .build(),
  new Task.Builder()
    .id("60")
    .title("Als docent wil ik een pagina waarop ik een skilltree kan bekijken")
    .status("TODO")
    .assigneId("user1")
    .build(),
  new Task.Builder()
    .id("164")
    .title("Frontend testing combination game domein, dto & service & controller")
    .status("DOING")
    .assigneId("user2")
    .build(),
  new Task.Builder().id("138").title("antwoord spel preview").status("REVIEW").assigneId("user3").build(),
];

export default function ReadKanBoardPage() {
  const { kanBoardId } = useParams();
  const { tasks } = useGetKanBoardTasksHook({ kanBoardId });

  // Use real tasks if available, fallback to mockTasks
  const allTasks = tasks && tasks.length > 0 ? tasks : mockTasks;

  function getTasksByStatus(statusId: string) {
    // Map column IDs to your TaskStatus type
    const statusMap: Record<string, string> = {
      todo: "TODO",
      "in-progress": "DOING",
      "in-review": "REVIEW",
      done: "DONE",
    };
    const target = statusMap[statusId] || statusId.toUpperCase();
    return allTasks.filter((task) => task.getStatus() === target);
  }

  const columns = KanBoard.getDefaultHeaders();
  const kanBoardName = "kanboard name";

  return (
    <div className="container-fluid bg-light min-vh-100 p-4">
      {/* Search Header */}
      <div className="row mb-4">
        <div className="col">
          <div className="input-group bg-white shadow-sm rounded border-0">
            <span className="input-group-text bg-white border-0 text-primary">
              <i className="fa-solid fa-magnifying-glass"></i>
            </span>
            <input type="text" className="form-control border-0 shadow-none" placeholder='"Search.."' />
          </div>
        </div>
      </div>

      {/* Kanban Board Horizontal Scroll Wrapper */}
      <div className="d-flex flex-nowrap overflow-auto pb-3" style={{ gap: "1.5rem" }}>
        {columns.map((col) => {
          const columnTasks = getTasksByStatus(col.id);

          return (
            <div key={col.id} style={{ minWidth: "350px", flex: "0 0 auto" }}>
              {/* Column Header */}
              <div className="d-flex align-items-center justify-content-between px-1 mb-1">
                <div className="d-flex align-items-center">
                  <span className={`me-2 ${col.color}`} style={{ fontSize: "1.2rem" }}>
                    ○
                  </span>
                  <strong className="text-dark me-2">{col.title}</strong>
                  <span className="badge rounded-pill bg-secondary bg-opacity-25 text-secondary small">
                    {columnTasks.length}
                  </span>
                </div>
                <div className="text-muted small">
                  <span className="me-2" style={{ cursor: "pointer" }}>
                    ...
                  </span>
                  <span style={{ cursor: "pointer" }}>+</span>
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
                <AddTaskToKanBoardButton kanBoardName={kanBoardName} />
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
      </div>
    </div>
  );
}

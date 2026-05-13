import useGetKanBoardsHook from "../../features/kanboard/presentation/hooks/useGetKanBoardsHook";
import useSetPageTitleHook from "../../shared/hooks/useSetPageTitleHook";
import { Link } from "react-router";
import "../../features/kanboard/presentation/css/listkanboardspage.css";

export default function ListKanBoardsPage() {
  useSetPageTitleHook({ title: "Kanban" });

  const { boards } = useGetKanBoardsHook();

  return (
    <article className="kanboard-page container py-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className=" mb-1">Projects</h2>
          <p className="text-muted mb-0">Manage your workspace boards</p>
        </div>

        <Link to="/kanboards/create" className="add-task-button task-btn-plain">
          New project
        </Link>
      </div>

      {/* Search */}
      <div className="mb-4">
        <input type="text" className="form-control search-input" placeholder="Search boards..." />
      </div>

      {/* List container */}
      <div className="projects-container">
        <div className="projects-header">{boards.length} recently viewed</div>

        {boards.map((board, index) => {
          const itemId = board.getId();

          return (
            <div className="project-row" key={itemId}>
              <Link to={`/kanboards/read/${itemId}`} className="project-main">
                <div className="project-icon">
                  <i className="fa-solid fa-table-columns"></i>
                </div>

                <div className="project-info">
                  <div className="project-top">
                    <span className="project-name">{board.getName()}</span>

                    <span className="project-badge">Private</span>
                  </div>

                  <div className="project-meta">
                    #{index} updated {board.getUpdatedDaysAgoDifference()} days ago
                  </div>
                </div>
              </Link>

              <Link to={`/kanboards/update/${itemId}`} className="project-options">
                <i className="fa-solid fa-ellipsis"></i>
              </Link>
            </div>
          );
        })}
      </div>
    </article>
  );
}

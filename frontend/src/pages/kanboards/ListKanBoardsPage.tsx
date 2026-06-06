import useGetKanBoardsHook from "../../features/kanboard/presentation/hooks/useGetKanBoardsHook";
import useSetPageTitleHook from "../../shared/hooks/useSetPageTitleHook";
import { Link } from "react-router";
import "../../features/kanboard/presentation/css/listkanboardspage.css";

export default function ListKanBoardsPage() {
  useSetPageTitleHook({ title: "Kanban" });

  const { boards } = useGetKanBoardsHook();

  return (
    <article className="kanboard-page">
      <article>
        <h5>Welcome to Kanban</h5>
        <p>
          Built to be flexible and adaptable, Projects gives you a live canvas to filter, sort, and group issues and
          pull requests in a table, board, or roadmap. Tailor them to your needs with custom fields, saved views,
          workflows, and insights.
        </p>
      </article>
      <article>
        <div className="search-section">
          {/* <label htmlFor="search-project" className="form-label">
            Search
          </label> */}
          <input type="text" className="form-control" id="search-project" aria-describedby="Search project bar"></input>
        </div>
        <div className="notes-tracker-btn-group">
          <button className="notes-tracker-btn notes-tracker-btn-primary">
            <i className="fa-solid fa-plus"></i> New Project
          </button>
        </div>
      </article>

      <article className="kanboard-options">
        <article className="kanboard-options-header">
          <button> Open</button>
          <button> Archived</button>
        </article>
      </article>
    </article>
  );
}

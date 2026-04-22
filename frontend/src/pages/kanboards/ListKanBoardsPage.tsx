import useGetKanBoardsHook from "../../features/kanboard/presentation/hooks/useGetKanBoardsHook";
import useSetPageTitleHook from "../../shared/hooks/useSetPageTitleHook";
import { Link } from "react-router";
import "../../features/kanboard/presentation/css/listkanboardspage.css";

export default function ListKanBoardsPage() {
  useSetPageTitleHook({ title: "Kanban" });
  const { boards } = useGetKanBoardsHook();

  return (
    <article className="kanboard-article">
      <div className="kanban-button-div">
        <p className="kanban-p">Your workspace's</p>
        <Link aria-describedby="create task button" className="add-task-button task-btn-plain " to="/kanboards/create">
          create
        </Link>
      </div>
      <div className="cards kanboard-article-cards">
        {boards.map((board) => {
          const itemId = board.getId();
          const boardsUrl = `/kanboards/read/${itemId}`;
          const updateBoardsUrl = `/kanboards/update/${itemId}`;
          return (
            <div className="card" key={itemId}>
              <Link to={boardsUrl}>
                <div className="card-color" style={{ backgroundColor: board.getColor() }} />
              </Link>
              <div className="card-label">
                {board.getName()}
                <Link to={updateBoardsUrl}>
                  <button className="kanboard-options-button">
                    <i className="fa-solid fa-pencil"></i>
                  </button>
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </article>
  );
}

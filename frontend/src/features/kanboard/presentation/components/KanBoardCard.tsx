import type { KanBoard } from "../../domain/KanBoard";
import "../css/kanboardcard.css";
import { Link } from "react-router";

export default function KanBoardCard({ kanBoard }: { kanBoard: KanBoard }) {
  const itemId = kanBoard.getId();
  const boardsUrl = `/kanboards/read/${itemId}`;
  const updateBoardsUrl = `/kanboards/update/${itemId}`;

  return (
    <div className="kanboard-card">
      <Link to={boardsUrl}>
        <div className="kanboard-card-color" style={{ backgroundColor: kanBoard.getColor() }} />
      </Link>
      <div className="kanboard-card-label">
        {kanBoard.getName()}
        <Link to={updateBoardsUrl}>
          <button className="kanboard-options-button">
            <i className="fa-solid fa-pencil"></i>
          </button>
        </Link>
      </div>
    </div>
  );
}

import useGetKanBoardsHook from "../../features/kanboard/presentation/hooks/useGetKanBoardsHook";
import useSetPageTitleHook from "../../shared/hooks/useSetPageTitleHook";
import { Link } from "react-router";
import "../../features/kanboard/presentation/css/listkanboardspage.css";
import type { KanBoard } from "../../features/kanboard/domain/KanBoard";
import KanBoardCard from "../../features/kanboard/presentation/components/KanboardCard";
import useDebounceHook from "../../shared/hooks/useDebounceHook";
import { useEffect, useState } from "react";

const TWO_SECOND_DELAY = 1000;
export default function ListKanBoardsPage() {
  useSetPageTitleHook({ title: "Kanban" });
  const [searchTerm, setSearchTerm] = useState("");

  const { boards, searchProject, fetchKanBoards } = useGetKanBoardsHook();
  const debouncedSearchTerm = useDebounceHook(searchTerm, TWO_SECOND_DELAY);

  useEffect(() => {
    if (debouncedSearchTerm) {
      searchProject(debouncedSearchTerm);
    }
  }, [debouncedSearchTerm]);

  function handleSearch(e: Event) {
    setSearchTerm(e.target.value);
    setFiltersActive(true);
  }

  async function resetOptions() {
    await fetchKanBoards();
  }

  return (
    <article className="kanboard-page">
      <article>
        <h5>Your workspace's</h5>
      </article>
      <article>
        <div className="search-section">
          <label htmlFor="search-project" className="form-label d-none">
            Search
          </label>
          <input
            type="text"
            className="form-control"
            id="search-project"
            onChange={(e) => handleSearch(e)}
            aria-describedby="Search project bar"
          ></input>
        </div>
        <div className="notes-tracker-btn-group">
          <Link to="/kanboards/create">
            <button className="notes-tracker-btn notes-tracker-btn-primary">
              <i className="fa-solid fa-plus"></i> New Project
            </button>
          </Link>
        </div>
      </article>

      <article className="kanboard-options">
        <article className="kanboard-options-header">
          {/* <FilterButton filtersActive={filtersActive}></FilterButton> */}
          <button className="notes-tracker-btn notes-tracker-btn-secondary" onClick={resetOptions}>
            Reset
          </button>
        </article>
      </article>

      <article className="kanboard-list">
        {boards.map((item: KanBoard) => {
          return <KanBoardCard key={item.getId()} kanBoard={item}></KanBoardCard>;
        })}
      </article>
    </article>
  );
}

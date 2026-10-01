import useGetKanBoardsHook from "../../features/kanboard/presentation/hooks/useGetKanBoardsHook";
import useSetPageTitleHook from "../../shared/hooks/useSetPageTitleHook";
import { Link } from "react-router";
import "../../features/kanboard/presentation/css/listkanboardspage.css";
import type { KanBoard } from "../../features/kanboard/domain/KanBoard";
import KanBoardCard from "../../features/kanboard/presentation/components/KanboardCard";

import { useDebounce, } from "use-debounce";
import { useState } from "react";

const ONE_SECOND_DELAY = 1000;
export default function ListKanBoardsPage() {
  useSetPageTitleHook({ title: "Kanban" });

  const { boards, mutation, isPending, error, reset } = useGetKanBoardsHook();
  const [searchTerm, setSearchTerm] = useState("");
  const [debounceValue] = useDebounce(searchTerm, ONE_SECOND_DELAY);

  function handleSearch(e: Event) {
    setSearchTerm(e.target.value);
    console.log(debounceValue)
    // mutation.mutate(debounceValue);
    // //TODO WORKS A LITTLT BIT BUGGY BUT NO big deal
    // if (value === "" || value === undefined) {
    //   resetOptions();
    //   return;
    // }
    // setSearchTerm(value);
  }

  if (isPending) return "Loading...";
  if (error) return "An error has occurred: " + error.message;

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
          <button className="notes-tracker-btn notes-tracker-btn-secondary" onClick={reset}>
            <i className="fa-solid fa-rotate-left"></i> Reset
          </button>
        </div>
      </article>

      {/* <article className="kanboard-options">
        <article className="kanboard-options-header">
         <FilterButton filtersActive={filtersActive}></FilterButton>
        </article>
      </article> */}

      <article className="kanboard-list">
        {boards &&
          boards.map((item: KanBoard) => {
            return <KanBoardCard key={item.getId()} kanBoard={item}></KanBoardCard>;
          })}
      </article>
    </article>
  );
}

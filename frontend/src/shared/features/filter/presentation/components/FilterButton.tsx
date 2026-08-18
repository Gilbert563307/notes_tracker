import React from "react";
import FilterButtonNumber from "./FilterButtonNumber";

export default function FilterButton({filtersActive}) {
  return (
    <button className="notes-tracker-btn notes-tracker-btn-secondary filter-btn">
      Filters {filtersActive ? <FilterButtonNumber value={1}/> : "0"}
    </button>
  );
}

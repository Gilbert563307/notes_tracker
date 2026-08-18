import { useEffect, useState } from "react";
import { kanBoardController } from "../KanBoardController";
import type { KanBoard } from "../../domain/KanBoard";

export default function useGetKanBoardsHook() {
  const [data, setData] = useState<{
    total: number;
    pages: number;
    boards: KanBoard[];
  }>({ total: 0, pages: 0, boards: [] });

  useEffect(() => {
    let isMounted: boolean = true;

    async function fetchBoards() {
      const response = await kanBoardController.getKanBoards();
      if (!isMounted) return;
      if (!response) return;
      if (response.total === 0) return;
      setData(response);
    }

    fetchBoards();

    return () => {
      isMounted = false;
    };
  }, []);

  async function searchProject(value: string) {
    const results = await kanBoardController.searchKanBoard(value);

    console.log(results);
    if (results != undefined && results?.length > 0) {
      //TODO FIX IN FUTURE THIS SEARCH ENDPOINT NEEDS SOME PAGINATION
      // setData((prevData) => {
      //   return { total: 0, pages: 0, boards: results };
      // });
      setData({ total: 0, pages: 0, boards: results });

      console.log(data);
    }
  }

  async function fetchKanBoards() {
    const response = await kanBoardController.getKanBoards();
    if (!response) return;
    if (response.total === 0) return;
    setData(response);
  }
  return { boards: data.boards, total: data.total, pages: data.pages, searchProject, fetchKanBoards };
}

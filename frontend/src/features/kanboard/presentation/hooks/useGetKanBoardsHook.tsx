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
      if (response.data.total === 0) return;
      setData(response.data);
    }

    fetchBoards();

    return () => {
      isMounted = false;
    };
  }, []);
  return { boards: data.boards, total: data.total, pages: data.pages };
}

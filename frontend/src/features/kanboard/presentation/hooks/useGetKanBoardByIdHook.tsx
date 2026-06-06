import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { KanBoard } from "../../domain/KanBoard";
import { kanBoardController } from "../KanBoardController";

export default function useGetKanBoardByIdHook() {
  const { kanBoardId } = useParams();
  const [kanBoard, setKanBoard] = useState<KanBoard | undefined>(undefined);

  useEffect(() => {
    async function fetchKanBoardById(id: string | undefined) {
      if (!id) return;
      const response = await kanBoardController.getKanBoardById(id);
      if (response && response instanceof KanBoard) {
       
        setKanBoard(response);
      }
    }
    fetchKanBoardById(kanBoardId);
  }, [kanBoardId]);
  return { kanBoard };
}

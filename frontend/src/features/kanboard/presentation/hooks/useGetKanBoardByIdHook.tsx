import { useParams } from "react-router";
import { kanBoardController } from "../KanBoardController";
import { useQuery } from "@tanstack/react-query";

export default function useGetKanBoardByIdHook() {
  const { kanBoardId } = useParams();

  async function fetchKanBoardById(id: string) {
    return await kanBoardController.getKanBoardById(id);
  }

  const { isPending, error, data } = useQuery({ queryKey: ["kanBoard"], queryFn: () => fetchKanBoardById(kanBoardId) });
  return { isPending, error, kanBoard: data };
}

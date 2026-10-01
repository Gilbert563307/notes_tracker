import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { kanBoardController } from "../KanBoardController";

export default function useGetKanBoardsHook() {
  // Access the client
  const queryClient = useQueryClient();

  async function searchProject(value: string) {
    return await kanBoardController.searchKanBoard(value);
  }

  async function fetchKanBoards() {
    return await kanBoardController.getKanBoards();
  }

  // Mutations TODO fix bug when search project is empty the list stays null
  const mutation = useMutation({
    mutationFn: searchProject,
    onSuccess: (data) => {
      queryClient.setQueryData(["kanBoards"], data);
    },
  });

  function reset() {
    queryClient.invalidateQueries({ queryKey: ["kanBoards"] });
  }

  const { isPending, error, data } = useQuery({
    queryKey: ["kanBoards"],
    queryFn: fetchKanBoards,
  });

  return { isPending, error, boards: data?.boards, mutation, reset };
}

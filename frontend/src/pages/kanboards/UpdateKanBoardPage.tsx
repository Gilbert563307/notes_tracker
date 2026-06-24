import { useNavigate } from "react-router";
import KanBoardForm from "../../features/kanboard/presentation/components/KanBoardForm";

import useGetKanBoardByIdHook from "../../features/kanboard/presentation/hooks/useGetKanBoardByIdHook";
import { kanBoardController } from "../../features/kanboard/presentation/KanBoardController";

export default function UpdateKanBoardPage() {
  const { kanBoard } = useGetKanBoardByIdHook();
  const navigate = useNavigate();

  if (kanBoard === undefined) {
    return <p>Loading details...</p>;
  }

  async function onSubmit(data: { name: string; color: string }) {
    const updated = await kanBoardController.updateKanBoard(data, kanBoard);
    if (updated) {
      navigate("/kanboards");
    }
  }

  async function deleteKanBoard() {
    const deleted = await kanBoardController.deleteKanBoard(kanBoard?.getId());
    if (deleted) {
      navigate("/kanboards");
    }
  }

  return (
    <KanBoardForm
      onSubmit={onSubmit}
      board={kanBoard}
      submitButtonValue="Save changes"
      deleteKanBoard={deleteKanBoard}
    />
  );
}

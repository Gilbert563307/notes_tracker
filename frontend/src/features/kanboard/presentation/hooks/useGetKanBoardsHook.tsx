import React, { useEffect, useState } from "react";
import { kanBoardController } from "../KanBoardController";

export default function useGetKanBoardsHook() {
  const [boards, setBoards] = useState([]);

  async function getKanBoards() {
    const response = await kanBoardController.getKanBoards();
    console.log(response)
  }

  useEffect(() => {
    getKanBoards();
  }, []);
  return { boards };
}

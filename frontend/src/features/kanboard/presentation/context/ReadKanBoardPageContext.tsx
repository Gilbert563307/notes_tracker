import { createContext, useContext, useMemo, useReducer, useCallback } from "react";

import type { Task } from "../../domain/Task";
import { kanBoardController } from "../KanBoardController";

type KANBOARD_PAGE_ACTIONS = "LIST_TASKS_BY_KANBOARD_ID" | "OPTION";

// eslint-disable-next-line react-refresh/only-export-components
export const KANBOARD_PAGE_ACTIONS = {
  LIST_TASKS_BY_KANBOARD_ID: "LIST_TASKS_BY_KANBOARD_ID",
} as const;


type REDUCER_ACTIONS = "SET_TASKS" | "OPTION";

type State = {
  tasks: Task[];
  task: Task | null;
};

const initialState: State = {
  tasks: [],
  task: null,
};

type ContextType = {
  state: State;
  dispatch: React.Dispatch<{ type: KANBOARD_PAGE_ACTIONS; payload: any }>;
};


const context = createContext<ContextType | null>(null);

// eslint-disable-next-line react-refresh/only-export-components
export function useReadKanBoardPageContext() {
  const ctx = useContext(context);
  if (!ctx) {
    throw new Error("useReadKanBoardPageContext must be used inside provider");
  }
  return ctx;
}

export default function ReadKanBoardPageContext({ children }) {

  function reducer(state: State, action: {payload: any, type: REDUCER_ACTIONS}): State {
    switch (action.type) {
      case "SET_TASKS":
        return {
          ...state,
          tasks: action.payload,
        };

      default:
        return state;
    }
  }

  const [state, dispatchAction] = useReducer(reducer, initialState);

  async function collectListTasksByBoardId(boardId: string) {
    const tasks = await kanBoardController.getTasksByKanBoardId(boardId);

    if (!tasks?.length) return;

    dispatchAction({
      type: "SET_TASKS",
      payload: tasks,
    });
  }

  const dispatch = useCallback(async (action: { type: KANBOARD_PAGE_ACTIONS; payload: any }) => {
    switch (action.type) {
      case KANBOARD_PAGE_ACTIONS.LIST_TASKS_BY_KANBOARD_ID:
        await collectListTasksByBoardId(action.payload);
        break;

      default:
        break;
    }
  }, []);

  const value = useMemo(
    () => ({
      state,
      dispatch,
    }),
    [state, dispatch],
  );

  return <context.Provider value={value}>{children}</context.Provider>;
}

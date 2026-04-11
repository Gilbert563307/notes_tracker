import { createContext, useContext } from "react";

export type ApplicationInitState = {
  title: string;
  setTitle: (title: string) => void;
};

export const ApplicationContext = createContext<ApplicationInitState | undefined>(undefined);

export function useApplicationContext() {
  const authContext = useContext(ApplicationContext);

  if (!authContext) {
    throw new Error("useMainControllerContext must be used within an Application Provider");
  }

  return authContext;
}

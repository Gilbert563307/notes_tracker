import React from "react";
import { useApplicationContext } from "../context/ApplicationProviderConfig";

/**
 * Custom hook to set the page title using the useApplicationContext context.
 * The title to set for the page.
 */
export default function useSetPageTitleHook({ title }: { title: string }) {
  const { setTitle } = useApplicationContext();

  React.useEffect(() => {
    setTitle(title);
  }, [title, setTitle]);

  return null;
}

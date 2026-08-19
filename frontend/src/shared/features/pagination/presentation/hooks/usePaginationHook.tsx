import { useCallback, useEffect } from "react";
import { PAGE_CHANGED_EVENT } from "../../../../../config/config";

type PageChangedEvent = CustomEvent<{ page?: number }>;

export default function usePaginationHook({ methodToCall }: { methodToCall: () => void }) {
  const handleEvent = useCallback(
    (event: PageChangedEvent) => {
      const pageNumber = event.detail?.page;
      if (!pageNumber) return;
      methodToCall();
    },
    [methodToCall],
  );

  useEffect(() => {
    document.addEventListener(PAGE_CHANGED_EVENT, handleEvent);

    return () => {
      document.removeEventListener(PAGE_CHANGED_EVENT, handleEvent);
    };
  }, [handleEvent]);
}

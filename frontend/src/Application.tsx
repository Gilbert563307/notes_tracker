import { useState } from "react";
import { useAuthProvider } from "./shared/context/AuthProviderConfig";
import DefaultLayout from "./shared/layout/DefaultLayout";
import GuestLayout from "./shared/layout/GuestLayout";
import { ApplicationContext } from "./shared/context/ApplicationProviderConfig";
import NotificationV4 from "./shared/features/notification/presentation/components/NotificationV4";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// React query client
const queryClient = new QueryClient();

export default function Application() {
  const { auth } = useAuthProvider();
  const [title, setTitle] = useState<string>("");

  return (
    <QueryClientProvider client={queryClient}>
      <ApplicationContext.Provider value={{ title, setTitle }}>
        <NotificationV4 />
        {auth != null ? <DefaultLayout /> : <GuestLayout />}
      </ApplicationContext.Provider>
    </QueryClientProvider>
  );
}

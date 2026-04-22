import React, { useState } from "react";
import { useAuthProvider } from "./shared/context/AuthProviderConfig";
import DefaultLayout from "./shared/layout/DefaultLayout";
import GuestLayout from "./shared/layout/GuestLayout";
import { ApplicationContext } from "./shared/context/ApplicationProviderConfig";
import NotificationV4 from "./shared/features/notification/components/NotificationV4";

export default function Application() {
  const { auth } = useAuthProvider();
  const [title, setTitle] = useState<string>("");

  return (
    <ApplicationContext.Provider value={{ title, setTitle }}>
      <NotificationV4 />
      {auth != null ? <DefaultLayout /> : <GuestLayout />}
    </ApplicationContext.Provider>
  );
}

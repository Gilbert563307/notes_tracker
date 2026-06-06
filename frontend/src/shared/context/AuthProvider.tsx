import { useEffect, useState } from "react";
import { UseCookieStorage } from "../utils/UseCookieStorage";
import { AUTH_STORAGE_KEYS, AuthProviderContext } from "./AuthProviderConfig";
import { Authentication, type AuthenticationCookie } from "../../features/auth/application/response/Authentication";
import { UseSessionStorage } from "../utils/UseSessionStorage";

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const [auth, setAuth] = useState<Authentication | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  async function login(auth: Authentication) {
    setAuth(auth);
  }

  useEffect(() => {
    async function loadAuth() {
      const data = await new UseSessionStorage().getItem(AUTH_STORAGE_KEYS.AUTH);
      if (data) {
        const parsedData: AuthenticationCookie = JSON.parse(data);
        setAuth(Authentication.from(parsedData));
      }
      setLoading(false);
    }
    loadAuth();
  }, []);

  //TODO remove there and set into component
  async function logout() {
    setAuth(null);
    const cookieStorage = new UseCookieStorage();
    await cookieStorage.deleteCookie(AUTH_STORAGE_KEYS.AUTH);
  }

  return (
    <AuthProviderContext.Provider value={{ auth, login, logout, loading }}>{children}</AuthProviderContext.Provider>
  );
}

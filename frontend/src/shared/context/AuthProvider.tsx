import { useEffect, useState } from "react";
import { UseCookieStorage } from "../utils/UseCookieStorage";
import { AUTH_STORAGE_KEYS, AuthProviderContext } from "./AuthProviderConfig";
import { AuthResponse, type AuthResponseCookie } from "../../features/auth/presentation/response/AuthResponse";

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const [auth, setAuth] = useState<AuthResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  async function login(auth: AuthResponse) {
    const day = 24 * 60 * 60 * 1000;

    const cookie = new UseCookieStorage.CookieBuilder()
      .name(AUTH_STORAGE_KEYS.AUTH)
      .value(JSON.stringify(auth.toJson()))
      .expires(Date.now() + day)
      .build();

    await UseCookieStorage.createCookie(cookie);
    setAuth(auth);
  }

  useEffect(() => {
    async function loadAuth() {
      const cookie = await new UseCookieStorage().readCookie(AUTH_STORAGE_KEYS.AUTH);
      if (cookie && cookie.value) {
        const parsedData: AuthResponseCookie = JSON.parse(cookie.value);
        setAuth(AuthResponse.from(parsedData));
        console.log(auth);
      }
      setLoading(false);
    }

    loadAuth();
  }, []);

  async function logout() {
    setAuth(null);
    const cookieStorage = new UseCookieStorage();
    await cookieStorage.deleteCookie(AUTH_STORAGE_KEYS.AUTH);
  }

  return (
    <AuthProviderContext.Provider value={{ auth, login, logout, loading }}>{children}</AuthProviderContext.Provider>
  );
}

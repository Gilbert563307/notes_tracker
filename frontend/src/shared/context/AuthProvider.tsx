import { useState } from "react";
import type { AuthResponse } from "../../auth/controller/response/AuthResponse";
import { UseCookieStorage } from "../helpers/UseCookieStorage";
import { AUTH_STORAGE_KEYS, AuthProviderContext } from "./AuthProviderConfig";

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const [auth, setAuth] = useState<AuthResponse | null>(null);

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

  async function logout() {
    setAuth(null);
    const cookieStorage = new UseCookieStorage();
    await cookieStorage.deleteCookie(AUTH_STORAGE_KEYS.AUTH);
  }

  return (
    <AuthProviderContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthProviderContext.Provider>
  );
}
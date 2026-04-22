import { createContext, useContext } from "react";
import type { Authentication } from "../../features/auth/application/response/Authentication";


export const AUTH_STORAGE_KEYS = {
  AUTH: "AUTH",
};

export type AuthContextValue = {
  auth: Authentication | null;
  login: (auth: Authentication) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
};

export const AuthProviderContext = createContext<AuthContextValue | undefined>(undefined);

/**
 * Custom hook to access authentication context and functions.
 */
export function useAuthProvider() {
  const authContext = useContext(AuthProviderContext);

  if (!authContext) {
    throw new Error("useAuthProvider must be used within an AuthProvider");
  }

  return authContext;
}

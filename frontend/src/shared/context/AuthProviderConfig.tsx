import { createContext, useContext } from "react";
import type { AuthResponse } from "../../features/auth/application/response/AuthResponse";

export const AUTH_STORAGE_KEYS = {
  AUTH: "AUTH",
};

export type AuthContextValue = {
  auth: AuthResponse | null;
  login: (auth: AuthResponse) => Promise<void>;
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

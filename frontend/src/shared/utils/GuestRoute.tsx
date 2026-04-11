import { Navigate } from "react-router";
import { useAuthProvider } from "../context/AuthProviderConfig";
import type { JSX } from "react";
import { LANDING_PAGE_ROUTE } from "../../config";

export default function GuestRoute({ children }: { children: JSX.Element }) {
  const { auth, loading } = useAuthProvider();

  if (loading) {
    return <div>Loading...</div>;
  }

  // If logged in, block guest pages
  if (auth) {
    return <Navigate to={LANDING_PAGE_ROUTE} replace />;
  }
  return children;
}

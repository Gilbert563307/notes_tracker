import React, { type JSX } from "react";
import { Navigate } from "react-router";
import {  useAuthProvider } from "../context/AuthProviderConfig";

export default function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { auth, loading } = useAuthProvider();

  // still checking cookie / session
  if (loading) {
    return <div>Loading...</div>;
  }

  // not logged in → redirect
  if (!auth) {
    return <Navigate to="/auth/login" replace />;
  }

  // logged in → allow access
  return children;
}

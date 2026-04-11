import React from "react";
import { createBrowserRouter } from "react-router";
import ErrorPage from "./pages/ErrorPage";
import CreateKanBoardPage from "./pages/kanboards/CreateKanBoardPage";
import ListKanBoardsPage from "./pages/kanboards/ListKanBoardsPage";
import UpdateKanBoardPage from "./pages/kanboards/UpdateKanBoardPage";
import AuthProvider from "./shared/context/AuthProvider";
import LandingPage from "./pages/LandingPage";
import ProtectedRoute from "./shared/utils/ProtectedRoute";
import AuthVerifyPage from "./pages/auth/AuthVerifyPage";
import GuestRoute from "./shared/utils/GuestRoute";
import Application from "./Application";
import AuthRegisterPage from "./pages/auth/AuthRegisterPage";

const routes = [
  {
    path: "/",
    element: (
      <AuthProvider>
        <Application />
      </AuthProvider>
    ),
    children: [
      {
        index: true,
        path: "",
        element: (
          <ProtectedRoute>
            <LandingPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/kanboards",
        element: (
          <ProtectedRoute>
            <ListKanBoardsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/kanboards/create",
        element: (
          <ProtectedRoute>
            <CreateKanBoardPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/kanboards/update/:kanBoardId",
        element: (
          <ProtectedRoute>
            <UpdateKanBoardPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/auth/register",
        element: (
          <GuestRoute>
            <AuthRegisterPage />
          </GuestRoute>
        ),
      },
      {
        path: "/auth/verify",
        element: (
          <GuestRoute>
            <AuthVerifyPage />
          </GuestRoute>
        ),
      },
    ],
  },
  {
    errorElement: <ErrorPage />,
  },
];
const router = createBrowserRouter(routes, { basename: "/app" });

export default router;

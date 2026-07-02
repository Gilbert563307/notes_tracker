import { createBrowserRouter } from "react-router";
import ErrorPage from "./pages/ErrorPage";
import CreateKanBoardPage from "./pages/kanboards/CreateKanBoardPage";

import UpdateKanBoardPage from "./pages/kanboards/UpdateKanBoardPage";
import AuthProvider from "./shared/context/AuthProvider";
import LandingPage from "./pages/LandingPage";
import ProtectedRoute from "./shared/utils/ProtectedRoute";

import GuestRoute from "./shared/utils/GuestRoute";
import Application from "./Application";
import SettingsPage from "./pages/settings/SettingsPage";
import ReadKanBoardPage from "./pages/kanboards/ReadKanBoardPage";
import ListKanBoardsPage from "./pages/kanboards/ListKanBoardsPage";
import CreateTaskPage from "./pages/tasks/CreateTaskPage";
import ListTasksPage from "./pages/tasks/ListTasksPage";
import AuthLoginPage from "./pages/auth/AuthLoginPage";
import AuthVerifyPage from "./pages/auth/AuthVerifyPage";
import ReadKanBoardPageContext from "./features/kanboard/presentation/context/ReadKanBoardPageContext";
import ReadTaskPage from "./pages/tasks/ReadTaskPage";
import UpdateTaskPage from "./pages/tasks/UpdateTaskPage";

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
        path: "/kanboards/read/:kanBoardId",
        element: (
          <ProtectedRoute>
            <ReadKanBoardPageContext>
              <ReadKanBoardPage />
            </ReadKanBoardPageContext>
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
        path: "/tasks",
        element: (
          <ProtectedRoute>
            <ListTasksPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/tasks/create",
        element: (
          <ProtectedRoute>
            <CreateTaskPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/tasks/read/:taskId",
        element: (
          <ProtectedRoute>
            <ReadTaskPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/tasks/update/:taskId",
        element: (
          <ProtectedRoute>
            <UpdateTaskPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/folders",
        element: "hello folders",
      },
      {
        path: "/drive",
        element: "hello drive",
      },
      {
        path: "/settings",
        element: (
          <ProtectedRoute>
            <SettingsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/auth/login",
        element: (
          <GuestRoute>
            <AuthLoginPage />
          </GuestRoute>
        ),
      },
      {
        path: "/auth/verify",
        element: <AuthVerifyPage />,
      },
    ],
  },
  {
    errorElement: <ErrorPage />,
  },
];
const router = createBrowserRouter(routes, { basename: import.meta.env.VITE_APP_ROUTER_BASE_URL });

export default router;

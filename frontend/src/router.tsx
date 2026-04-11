import React from "react";
import { createBrowserRouter } from "react-router";
import ErrorPage from "./pages/ErrorPage";
import CreateKanBoardPage from "./pages/kanboards/CreateKanBoardPage";
import ListKanBoardsPage from "./pages/kanboards/ListKanBoardsPage";
import UpdateKanBoardPage from "./pages/kanboards/UpdateKanBoardPage";
import AuthProvider from "./shared/context/AuthProvider";

const routes = [
  {
    path: " /",
    element: (
      <AuthProvider>
        <div>hello</div>
      </AuthProvider>
    ),
    children: [
      {
        path: "/kanboards",
        element: <ListKanBoardsPage></ListKanBoardsPage>,
      },
      {
        path: "/kanboards/create",
        element: <CreateKanBoardPage></CreateKanBoardPage>,
      },
      {
        path: "/kanboards/update/:kanBoardId",
        element: <UpdateKanBoardPage />,
      },
    ],
  },
  {
    errorElement: <ErrorPage />,
  },
];
const router = createBrowserRouter(routes, { basename: "/app" });

export default router;

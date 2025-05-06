import { createBrowserRouter } from "react-router-dom";
import ProtectedRoute from "./protected-route";
import SuccessSignUp from "../components/sign-up-and-log-in/sing-up-successful";
import Layout from "../Layout";
import ErrorPage from "../pages/error-page";
import Home from "../pages/Home";
import LogIn from "../pages/log-in-page";
import Profile from "../pages/personal-office";
import SignUp from "../pages/register";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Home /> },
      {
        path: "sign-up",
        element: <SignUp />,
      },
      {
        path: "log-in",
        element: <LogIn />,
      },
      {
        path: "success-sign-up",
        element: <SuccessSignUp />,
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: "profile",
            element: <Profile />,
          },
        ],
      },
    ],
  },
]);

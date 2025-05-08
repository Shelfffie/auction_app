import { createBrowserRouter } from "react-router-dom";
import AnotherUserProfile from "../pages/user.profile";
import ProtectedRoute from "./protected-route";
import SuccessSignUp from "../components/sign-up-and-log-in/sing-up-successful";
import Layout from "../Layout";
import ErrorPage from "../pages/error-page";
import Home from "../pages/Home";
import LogIn from "../pages/log-in-page";
import Profile from "../pages/personal-office";
import SignUp from "../pages/register";
import CreateLotPage from "../pages/auctions/create-lot";
import LotId from "../components/auctions/lot-id";

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
        path: "user/:id",
        element: <AnotherUserProfile />,
      },
      {
        path: "lot",
        element: <LotId />,
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: "profile",
            element: <Profile />,
          },
          {
            element: <ProtectedRoute allowedRoles={["admin", "organizer"]} />,
            children: [{ path: "lot/create", element: <CreateLotPage /> }],
          },
        ],
      },
    ],
  },
]);

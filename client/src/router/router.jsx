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
import LotPage from "../pages/lot-id";
import ShowLotPage from "../pages/auctions/show-auction";
import EndedLotsPage from "../pages/auctions/ended-lots-list";
import ShowLotByIdPage from "../pages/auctions/showLotsByIdPage";
import ShowLotsByBidsPage from "../pages/auctions/showLotsByBids";
import UserControl from "../pages/admin/control-users";

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
        path: "lot/:id",
        element: <LotPage />,
      },
      {
        path: "lots",
        element: <ShowLotPage />,
      },
      {
        path: "lots/ended",
        element: <EndedLotsPage />,
      },
      {
        path: "lots/user/:userId",
        element: <ShowLotByIdPage />,
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
          {
            path: "my-lots",
            element: <ShowLotByIdPage />,
          },
          {
            path: "my-bids",
            element: <ShowLotsByBidsPage />,
          },
          {
            element: <ProtectedRoute allowedRoles={["admin"]} />,
            children: [{ path: "admin-panel", element: <UserControl /> }],
          },
        ],
      },
    ],
  },
]);

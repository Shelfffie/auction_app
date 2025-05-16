import { createBrowserRouter } from "react-router-dom";
import AnotherUserProfile from "../pages/user.profile";
import ProtectedRoute from "./protected-route";
import RedirectIfAuth from "./redirectIfAuth";
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
import AdminPage from "../pages/admin/control-page";
import SendRequestPage from "../pages/sendRequest";
import RequestAboutId from "../pages/admin/request-id-page";
import ShowActiveRequests from "../pages/admin/active-requests";
import AdminPanel from "../pages/admin/admin-panel";
import RequestsHistory from "../pages/admin/requests.-history";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Home /> },
      {
        path: "sign-up",
        element: (
          <RedirectIfAuth>
            <SignUp />
          </RedirectIfAuth>
        ),
      },
      {
        path: "log-in",
        element: (
          <RedirectIfAuth>
            <LogIn />
          </RedirectIfAuth>
        ),
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
        path: "request",
        element: <SendRequestPage />,
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
            children: [
              { path: "admin-panel", element: <AdminPanel /> },
              { path: "users-and-lots", element: <AdminPage /> },
              { path: "request/:id", element: <RequestAboutId /> },
              { path: "requests", element: <ShowActiveRequests /> },
              { path: "requests/history", element: <RequestsHistory /> },
            ],
          },
        ],
      },
    ],
  },
]);

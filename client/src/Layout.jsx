import React from "react";
import "./../styles/layout.css";
import { useAuth } from "./hooks/authContext";
import { Outlet } from "react-router-dom";

const Layout = () => {
  const { isLoading } = useAuth();

  if (isLoading) {
    return <div className="loading">Завантаження....</div>;
  }

  return (
    <main className="layout">
      <Outlet />
    </main>
  );
};

export default Layout;

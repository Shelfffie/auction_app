import React from "react";
import "./../styles/layout.css";
import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";

const Layout = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const userId = localStorage.getItem("token");
    setIsLoggedIn(!!userId);

    const timer = setTimeout(() => {
      setLoading(false);
    });

    return () => clearTimeout(timer);
  }, [location]);

  if (loading) {
    return <div className="loading">Завантаження....</div>;
  }

  return (
    <main className="layout">
      <Outlet context={{ isLoggedIn, setIsLoggedIn }} />
    </main>
  );
};

export default Layout;

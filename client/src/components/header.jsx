import React from "react";
import { useAuth } from "../hooks/authContext";
import { useEffect, useState } from "react";
import { Link, useOutletContext } from "react-router-dom";
import { HashLink } from "react-router-hash-link";
import "../../styles/header.css";

function Header() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div className="loading">Завантаження....</div>;
  }

  const isLoggedIn = !!user;
  const [userRole, setUserRole] = useState(null);
  useEffect(() => {
    const headerNav = document.querySelector("header");
    let Scroll = window.pageYOffset || document.documentElement.scrollTop;

    const handleScroll = () => {
      const currentScroll =
        window.pageYOffset || document.documentElement.scroll;

      if (currentScroll < 164) {
        headerNav.classList.remove("hide-header");
        Scroll = currentScroll;
        return;
      }

      if (currentScroll > Scroll) {
        headerNav.classList.add("hide-header");
      } else {
        headerNav.classList.remove("hide-header");
      }
      Scroll = currentScroll <= 0 ? 0 : currentScroll;
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!isLoggedIn) return;

    fetch(`http://localhost:3000/api/profile`, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setUserRole(data.user_role);
      })
      .catch((err) => console.error("Помилка завантаження ролі:", err));
  }, [isLoggedIn]);

  return (
    <header className="header">
      <div className="donut-on">
        <Link to="/">
          <p>DonutON</p>
        </Link>
      </div>
      <nav className="header-nav">
        <p className="header-item">
          <HashLink smooth to="/#about-auctions">
            ПРО <br /> АУКЦІОНИ
          </HashLink>
        </p>
        <a href="" className="header-item">
          ПЕРЕГЛЯНУТИ <br />
          ЛОТИ
        </a>
        {isLoggedIn && (userRole === "organizer" || userRole === "admin") && (
          <p className="header-item">
            <Link to="/lot/create">
              СТВОРИТИ
              <br /> ЛОТ
            </Link>
          </p>
        )}
        {isLoggedIn ? (
          <Link to="/profile">
            <p className="log-in-button">Профіль</p>
          </Link>
        ) : (
          <Link to="/log-in">
            <p className="log-in-button">Авторизуватися</p>
          </Link>
        )}
      </nav>
    </header>
  );
}

export default Header;

import React from "react";
import { useEffect } from "react";
import "../../styles/header.css";

function Header() {
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

  return (
    <header className="header">
      <div className="donut-on">
        <a href="">DonutON</a>
      </div>
      <nav className="header-nav">
        <a href="" className="header-item">
          ПРО <br /> АУКЦІОНИ
        </a>
        <a href="" className="header-item">
          ПЕРЕГЛЯНУТИ <br />
          ЛОТИ
        </a>
        <a href="" className="header-item">
          ВИСТАВИТИ
          <br /> ЛОТ
        </a>
        <a href="" className="log-in-button">
          Авторизуватися
        </a>
      </nav>
    </header>
  );
}

export default Header;

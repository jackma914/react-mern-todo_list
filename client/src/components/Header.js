import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useGlobalContext } from "../context/GlobalContext";

function Header() {
  const { user, logout } = useGlobalContext();
  const { pathname } = useLocation();

  return (
    <div className="main-header">
      <div className="main-header__inner">
        <div className="main-header__left">
          <Link to="/">Doit</Link>
        </div>

        <div className="main-header__right">
          {user ? (
            <button className="btn" onClick={logout}>
              로그아웃
            </button>
          ) : pathname === "/" ? (
            <Link to="/register" className="btn">
              회원가입
            </Link>
          ) : (
            <Link to="/" className="btn">
              로그인
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export default Header;

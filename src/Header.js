import React from "react";
import "./Header.css";
import SearchIcon from "@material-ui/icons";

function Header() {
  return (
    <div className="header">
      <img
        className="header_logo"
        src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Amazon_logo.svg/250px-Amazon_logo.svg.png"
        alt=""
      />
      <div className="header__search">
        <input type="text" className="header__searchInput" />
        <SearchIcon className="header__searchIcon"></SearchIcon>
      </div>
      <div className="header__nav">
        <div className="header__option">
          <span className="header__optionLineOne">안녕</span>
          <span className="header__optionLineTwo">로그인</span>
        </div>
        <div className="header__option">
          {" "}
          <span className="header__optionLineOne">돌아가기</span>
          <span className="header__optionLineTwo">주문내역</span>
        </div>
        <div className="header__option">
          {" "}
          <span className="header__optionLineOne">반가워요</span>
          <span className="header__optionLineTwo">구독</span>
        </div>
      </div>
    </div>
  );
}

export default Header;

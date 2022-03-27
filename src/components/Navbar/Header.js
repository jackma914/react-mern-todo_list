import React, { useState, useEffect } from "react";
import "./Header.css";
import SearchIcon from "@material-ui/icons/Search";
import ShoppingBasket from "@material-ui/icons/ShoppingBasket";
import { Link } from "react-router-dom";
import { connect } from "react-redux";

function Header({ cart }) {
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    let count = 0;
    cart.forEach((item) => {
      count += item.qty;
    });

    setCartCount(count);
  }, [cart, cartCount]);

  return (
    <div className="header">
      <Link to="/">
        <img
          className="header_logo"
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Amazon_logo.svg/250px-Amazon_logo.svg.png"
          alt=""
        />
      </Link>
      <div className="header__search">
        <input type="text" className="header__searchInput" />
        <SearchIcon className="header__searchIcon"></SearchIcon>
      </div>

      <div className="header__nav">
        <div className="header__option">
          <span className="header__optionLineOne"></span>
          <span className="header__optionLineTwo">로그인</span>
        </div>
        <div className="header__option">
          {" "}
          <span className="header__optionLineOne"></span>
          <span className="header__optionLineTwo">주문내역</span>
        </div>
        <div className="header__option">
          {" "}
          <span className="header__optionLineOne">반가워요</span>
          <span className="header__optionLineTwo">구독</span>
        </div>
        <Link to="/cart">
          <div className="header__optionBasket">
            <ShoppingBasket />
            <span className="header__basket">{cartCount}</span>
          </div>
        </Link>
      </div>
    </div>
  );
}

const mapStateToProps = (state) => {
  console.log(state);
  return {
    cart: state.baskets.cart,
  };
};

export default connect(mapStateToProps)(Header);

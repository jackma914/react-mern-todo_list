import React from "react";
import "./Home.css";
import Product from "./Product.js";

function Home() {
  return (
    <div className="home">
      <div className="home__container">
        <img
          src="https://images.idgesg.net/images/article/2017/09/firetvad2-100736366-orig.jpg"
          alt=""
          className="home__image"
        />
        <div className="home__row">
          <Product />
        </div>
        <div className="home__row">
          <Product />
        </div>
        <div className="home__row">
          <Product />
          <Product />
          <Product />
        </div>
      </div>
    </div>
  );
}

export default Home;

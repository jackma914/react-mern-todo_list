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
          <Product
            id="2323"
            title="제품1입니다"
            price={3000}
            image="https://en.pimg.jp/024/292/158/1/24292158.jpg"
            rating={5}
          />
          <Product
            id="2323"
            title="제품1입니다"
            price={3000}
            image="https://en.pimg.jp/024/292/158/1/24292158.jpg"
            rating={5}
          />
        </div>
        <div className="home__row">
          <Product
            id="2323"
            title="제품1입니다"
            price={3000}
            image="https://en.pimg.jp/024/292/158/1/24292158.jpg"
            rating={5}
          />
          <Product
            id="2323"
            title="제품1입니다"
            price={3000}
            image="https://en.pimg.jp/024/292/158/1/24292158.jpg"
            rating={5}
          />
        </div>
        <div className="home__row">
          <Product
            id="2323"
            title="제품1입니다"
            price={3000}
            image="https://en.pimg.jp/024/292/158/1/24292158.jpg"
            rating={5}
          />
        </div>
      </div>
    </div>
  );
}

export default Home;

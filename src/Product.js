import React, { useState, useContext, useReducer } from "react";

import "./Product.css";
import { connect } from "react-redux";
import { addBasket } from "./store/action";

function Product({ id, image, title, price, rating }) {
  return (
    <div key={id} className="product">
      <div className="product__info">
        <p>{title}</p>
        <p className="product__price">
          <small>가격</small>
          <strong>{price}</strong>
          <small>원</small>
        </p>

        <div className="product__rating">
          {Array(rating)
            .fill()
            .map(() => {
              return <p>★</p>;
            })}
        </div>
      </div>
      <img src={image} alt="" />
      <button
        onClick={() => {
          // addBasket();
        }}
      >
        장바구니에 담기
      </button>
    </div>
  );
}

export default Product;

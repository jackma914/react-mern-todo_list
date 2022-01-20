import React, { useState, useContext, useReducer } from "react";

import { initialState, indexReducer } from "./store/Reducer";
import "./Product.css";

function Product({ id, image, title, price, rating }) {
  const [state, dispatch] = useReducer(indexReducer, initialState);

  return (
    <div className="product">
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
          dispatch({
            type: "ADD_BASKET",
            item: { title: title, image: image },
          });
        }}
      >
        장바구니에 담기
      </button>
    </div>
  );
}

export default Product;

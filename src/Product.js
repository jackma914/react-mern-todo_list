import React, { useState, useContext, useReducer } from "react";
import "./Product.css";
import reducer, { initialState } from "./store/Recuder";

function Product({ id, image, title, price, rating }) {
  const [{ basket }, dispatch] = useReducer(reducer, []);
  // console.log(state);
  console.log(basket);

  const addToBasket = () => {
    dispatch({
      type: "ADD_TO_BASKET",
      payload: {
        item: { title: title, image: image },
      },
    });
  };

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
      <button onClick={addToBasket}>장바구니에 담기</button>
    </div>
  );
}

export default Product;

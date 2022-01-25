import React, { useState, useContext, useReducer } from "react";

import "./Product.css";
import { connect } from "react-redux";
import { addProduct } from "./redux/addProduct/actions";

function Product(props) {
  console.log(props.basket);

  const item = {
    id: props.id,
    title: props.title,
    price: props.price,
  };

  return (
    <div className="product" key={props.id}>
      <div className="product__info">
        <p>{props.title}</p>
        <p className="product__price">
          <small>가격</small>
          <strong>{props.price}</strong>
          <small>원</small>
        </p>

        <div className="product__rating">
          {Array(props.rating)
            .fill()
            .map(() => {
              return <p>★</p>;
            })}
        </div>
      </div>
      <img src={props.image} alt="" />
      <button
        onClick={() => {
          props.addProduct(item);
        }}
      >
        버튼
      </button>
      {/* {props.basket} */}
    </div>
  );
}
const mapStateToProps = (state) => {
  return {
    basket: state.basket,
  };
};

const mapDispatchToProps = {
  addProduct: (number) => addProduct(number),
};
export default connect(mapStateToProps, mapDispatchToProps)(Product);

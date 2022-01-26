import React from "react";
import "./Product.css";

function Product({ productData }) {
  return (
    <div className="product">
      <div className="product__info">
        <p>{productData.title}</p>
        <p className="product__price">
          <small>가격</small>
          <strong>{productData.price}</strong>
          <small>원</small>
        </p>

        <div className="product__rating">
          {Array(productData.rating)
            .fill()
            .map(() => {
              return <p>★</p>;
            })}
        </div>
      </div>
      <img src={productData.image} alt="" />
      <button onClick={() => {}}>View Item</button>
      <button onClick={() => {}}>Add To Cart</button>
    </div>
  );
}

export default Product;

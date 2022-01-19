import React, { useContext } from "react";
import "./Product.css";
// import { useStateValue } from "./StateProvider";
import { UserContext } from "./store/users";

function Product({ id, image, title, price, rating }) {
  // const [{ basket }, dispatch] = UserContext();

  // const addToBasket = () => {
  //   dispatch({
  //     type: "ADD_TO_BASKET",
  //     item: {
  //       id: id,
  //       title: title,
  //       image: image,
  //       price: price,
  //       rating: rating,
  //     },
  //   });
  // };
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
      <button onClick={() => {}}>장바구니에 담기</button>
    </div>
  );
}

export default Product;

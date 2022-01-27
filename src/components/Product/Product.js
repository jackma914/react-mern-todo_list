import React from "react";
import "./Product.css";
import { addProduct } from "../../redux/addProduct/actions";
import { connect } from "react-redux";

function Product({ productData, addProduct }) {
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
      <button onClick={() => addProduct(productData.id)}>Add To Cart</button>
    </div>
  );
}

const mapDispatchToProps = (dispatch) => {
  return {
    addProduct: (id) => dispatch(addProduct(id)),
    // loadCurrentItem: (item) => dispatch(loadCurrentItem(item)),
  };
};

export default connect(null, mapDispatchToProps)(Product);

import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import CartItem from "./CartItem/CartItem";

const Cart = ({ cart }) => {
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    let items = 0;
    let price = 0;

    cart.forEach((item) => {
      items += item.qty;
      price += item.qty * item.price;
    });

    setTotalItems(items);
    setTotalPrice(price);
  }, [cart, totalPrice, totalItems, setTotalPrice, setTotalItems]);

  return (
    <div className="cart">
      <div className="cart__item">
        {cart.map((item) => (
          <CartItem key={item.id} item={item} />
        ))}
      </div>
      <div className="cart__summary">
        <h4 className="summary__title">Cart Summary</h4>
        <div className="summary__price">
          <span>TOTAL:({totalItems} items)</span>
          <span>$ {totalPrice}</span>
        </div>
        <button className="summart__checkoutBtn">Proceed To Checkout</button>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    cart: state.baskets.cart,
  };
};

export default connect(mapStateToProps)(Cart);

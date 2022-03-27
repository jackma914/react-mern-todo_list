import React from "react";
import "./Home.css";
import Product from "./Product.js";
import { connect } from "react-redux";

function Home({ products }) {
  return (
    <div className="home">
      {products.map((product) => (
        <Product key={product.id} productData={product} />
      ))}
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    products: state.baskets.products,
  };
};

export default connect(mapStateToProps)(Home);

import { ADD_PRODUCT } from "./types";

export const addProduct = (basket) => {
  return {
    type: ADD_PRODUCT,
    payload: basket,
  };
};

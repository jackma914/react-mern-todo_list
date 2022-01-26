import { ADD_PRODUCT } from "./types";

export const addProduct = (itemID) => {
  return {
    type: ADD_PRODUCT,
    payload: { id: itemID },
  };
};

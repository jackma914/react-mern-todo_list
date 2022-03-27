import { ADD_PRODUCT, ADJUST_ITEM_QTY } from "./types";

export const addProduct = (itemID) => {
  return {
    type: ADD_PRODUCT,
    payload: { id: itemID },
  };
};
export const adjustItemQty = (itemID, qty) => {
  return {
    type: ADJUST_ITEM_QTY,
    payload: {
      id: itemID,
      qty,
    },
  };
};

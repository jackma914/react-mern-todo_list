import { ADD_BASKET } from "./type";

const initialState = {
  basket: [],
};

const addBasketReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_BASKET:
      return {
        ...state,
        basket: [...state.basket, action.item],
      };
    default:
      return state;
  }
};

export default addBasketReducer;

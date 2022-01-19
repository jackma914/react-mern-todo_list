export const initialState = {
  basket: [],
};

const reducer = (initialState, action) => {
  switch (action.type) {
    case "ADD_TO_BASKET":
      return {
        ...initialState,
        basket: [initialState.basket, action.payload],
      };

    default:
      return initialState;
  }
};

export default reducer;

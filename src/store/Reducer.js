import { createContext, useContext, useReducer } from "react";

export const initialState = {
  basket: [],
};

export const indexReducer = (state, action) => {
  switch (action.type) {
    case "ADD_BASKET":
      return {
        ...state,
        basket: [...state.basket, action.item],
      };

    default:
      return state;
  }
};

export const ProfileDispatch = createContext();

export default function StateBasket(props) {
  // const [state, dispatch] = useReducer(indexReducer, initialState);

  const user = {
    title: "hihi",
  };
  return (
    <ProfileDispatch.Provider value={user}>
      {props.children}
    </ProfileDispatch.Provider>
  );
}

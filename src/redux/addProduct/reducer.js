import { ADD_PRODUCT } from "./types";

const initialState = {
  basket: [],
};

const addProductReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_PRODUCT:
      return {
        ...state,
        basket: [...state.basket, action.payload],
      };

    //default는 앞에 정의한 case 이외의 경우일 기본값으로 사용하기 위해 state를 리턴해줍니다.
    default:
      return state;
  }
};
export default addProductReducer;

import { ADD_PRODUCT } from "./types";

const initialState = {
  products: [
    {
      id: 1,
      title: "제품 1 번입니다",
      price: 11,
      image:
        "https://images.idgesg.net/images/article/2017/09/firetvad2-100736366-orig.jpg",
      rating: 5,
    },
    {
      id: 2,
      title: "제품 2 번입니다",
      price: 1500,
      image:
        "https://cdn.011st.com/11dims/resize/1000x1000/quality/75/11src/asin/B003NS5P6A/B.jpg?1640341032847",
      rating: 3,
    },
    {
      id: 3,
      title: "제품 3 번입니다",
      price: 250,
      image:
        "https://cdn.011st.com/11dims/resize/600x600/quality/75/11src/pd/22/1/2/3/7/8/1/LlXcl/1163123781_B.jpg",
      rating: 1,
    },
  ],
  cart: [],
  currentItem: null,
};
const addProductReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_PRODUCT:
      // get the items data from the products array
      const item = state.products.find((prod) => prod.id === action.payload.id);
      // check if item is in cart already
      const inCart = state.cart.find((item) =>
        item.id === action.payload.id ? true : false
      );
      return {};

    //default는 앞에 정의한 case 이외의 경우일 기본값으로 사용하기 위해 state를 리턴해줍니다.
    default:
      return state;
  }
};
export default addProductReducer;

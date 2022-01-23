import { ADD_BASKET } from "./type";

export const addBasket = (title, image) => {
  return {
    type: ADD_BASKET,
    item: { title: title, image: image },
  };
};

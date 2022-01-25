import { createStore } from "redux";
import addProductReducer from "./addProduct/reducer";

const store = createStore(addProductReducer);

export default store;

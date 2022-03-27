import { combineReducers } from "redux";

import addProductReducer from "./addProduct/reducer";

const rootReducer = combineReducers({
  baskets: addProductReducer,
});

export default rootReducer;

import { combineReducers } from "redux";

import AuthReducers from "./auth";
import PostReducers from "./post";

const rootReducer = combineReducers({
  AuthReducers,
  PostReducers,
});

export default rootReducer;

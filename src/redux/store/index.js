// redux/store.js
import { applyMiddleware } from "redux";
import { userReducer } from "../reducers/userReducer";
import logger from "redux-logger"; // Import Redux logger middleware
import { configureStore } from "@reduxjs/toolkit";

const store = configureStore({
  reducer: userReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
});
export default store;

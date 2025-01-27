// redux/store.js
import { userReducer } from "../reducers/userReducer";
import logger from "redux-logger"; // Import Redux logger middleware
import { configureStore } from "@reduxjs/toolkit";

// This deals with setup - i dont even understand what goes o here but it works :)
const store = configureStore({
  reducer: userReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
});
export default store;

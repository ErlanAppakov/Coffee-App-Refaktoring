import { configureStore } from "@reduxjs/toolkit";
import modalReducer from "./slices/modalSlice";
import userReducer from "./slices/userSlice";
import cartReducer from "./slices/cartSlice";
import searchReducer from "./slices/searchSlice";

export const store = configureStore({
  reducer: {
    modal: modalReducer,
    user: userReducer,
    cart: cartReducer,
    search: searchReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

import { useDispatch, useSelector } from "react-redux";

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector = (selector: (state: RootState) => any) => useSelector(selector);

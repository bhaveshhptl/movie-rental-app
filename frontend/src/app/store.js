import { configureStore } from "@reduxjs/toolkit";

import authReducer from "../features/auth/authSlice";
import movieReducer from "../features/movies/movieSlice";
import cartReducer from "../features/cart/cartSlice";
import rentalReducer from "../features/rental/rentalSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    movies: movieReducer,
    cart: cartReducer,
    rental: rentalReducer,
  },
});
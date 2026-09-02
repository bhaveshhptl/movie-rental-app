import {
  createAsyncThunk,
  createSlice,
} from "@reduxjs/toolkit";

import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} from "./cartAPI";

export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async (_, { getState, rejectWithValue }) => {
    try {
      const accessToken =
        getState().auth.accessToken;

      const response =
        await getCart(accessToken);

      return response.cart;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Unable to retrieve cart"
      );
    }
  }
);

export const addMovieToCart = createAsyncThunk(
  "cart/addMovie",
  async (
    { movieId, rentalDays },
    { getState, rejectWithValue }
  ) => {
    try {
      const accessToken =
        getState().auth.accessToken;

      const response = await addToCart(
        accessToken,
        movieId,
        rentalDays
      );

      return response.cart;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Unable to add movie to cart"
      );
    }
  }
);

export const changeRentalDays = createAsyncThunk(
  "cart/changeRentalDays",
  async (
    { movieId, rentalDays },
    { getState, rejectWithValue }
  ) => {
    try {
      const accessToken =
        getState().auth.accessToken;

      const response =
        await updateCartItem(
          accessToken,
          movieId,
          rentalDays
        );

      return response.cart;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Unable to update cart"
      );
    }
  }
);

export const deleteCartItem = createAsyncThunk(
  "cart/deleteCartItem",
  async (
    movieId,
    { getState, rejectWithValue }
  ) => {
    try {
      const accessToken =
        getState().auth.accessToken;

      await removeFromCart(
        accessToken,
        movieId
      );

      return movieId;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Unable to remove movie"
      );
    }
  }
);

export const emptyCart = createAsyncThunk(
  "cart/emptyCart",
  async (_, { getState, rejectWithValue }) => {
    try {
      const accessToken =
        getState().auth.accessToken;

      await clearCart(accessToken);

      return true;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Unable to clear cart"
      );
    }
  }
);

const initialState = {
  items: [],
  totalCost: 0,
  loading: false,
  error: null,
};

const cartSlice = createSlice({
  name: "cart",

  initialState,

  reducers: {
    clearCartError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder

      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;

        state.items =
          action.payload?.items || [];

        state.totalCost =
          action.payload?.totalCost || 0;
      })

      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(addMovieToCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(
        addMovieToCart.fulfilled,
        (state, action) => {
          state.loading = false;

          state.items =
            action.payload?.items || [];

          state.totalCost =
            action.payload?.totalCost || 0;
        }
      )

      .addCase(
        addMovieToCart.rejected,
        (state, action) => {
          state.loading = false;
          state.error = action.payload;
        }
      )

      .addCase(
        changeRentalDays.fulfilled,
        (state, action) => {
          state.items =
            action.payload?.items || [];

          state.totalCost =
            action.payload?.totalCost || 0;
        }
      )

      .addCase(
        changeRentalDays.rejected,
        (state, action) => {
          state.error = action.payload;
        }
      )

      .addCase(
        deleteCartItem.fulfilled,
        (state, action) => {
          state.items =
            state.items.filter(
              (item) =>
                String(item.movieId) !==
                String(action.payload)
            );

          // We'll refresh the authoritative total
          // when the cart page loads.
        }
      )

      .addCase(
        deleteCartItem.rejected,
        (state, action) => {
          state.error = action.payload;
        }
      )

      .addCase(emptyCart.fulfilled, (state) => {
        state.items = [];
        state.totalCost = 0;
      })

      .addCase(
        emptyCart.rejected,
        (state, action) => {
          state.error = action.payload;
        }
      );
  },
});

export const {
  clearCartError,
} = cartSlice.actions;

export default cartSlice.reducer;
import {
  createAsyncThunk,
  createSlice,
} from "@reduxjs/toolkit";

import {
  checkoutCart,
  getRentalHistory,
} from "./rentalAPI";

export const checkout = createAsyncThunk(
  "rental/checkout",
  async (_, { getState, rejectWithValue }) => {
    try {
      const accessToken =
        getState().auth.accessToken;

      const response =
        await checkoutCart(accessToken);

      return response.rental;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Unable to complete checkout"
      );
    }
  }
);

export const fetchRentalHistory =
  createAsyncThunk(
    "rental/fetchHistory",
    async (_, { getState, rejectWithValue }) => {
      try {
        const accessToken =
          getState().auth.accessToken;

        const response =
          await getRentalHistory(
            accessToken
          );

        return response.rentals;
      } catch (error) {
        return rejectWithValue(
          error.response?.data?.message ||
            "Unable to retrieve rental history"
        );
      }
    }
  );

const initialState = {
  rentals: [],
  lastRental: null,

  loading: false,
  historyLoading: false,

  error: null,
  historyError: null,
};

const rentalSlice = createSlice({
  name: "rental",

  initialState,

  reducers: {
    clearRentalError: (state) => {
      state.error = null;
    },

    clearHistoryError: (state) => {
      state.historyError = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // -------------------------
      // CHECKOUT
      // -------------------------

      .addCase(checkout.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(
        checkout.fulfilled,
        (state, action) => {
          state.loading = false;

          state.lastRental =
            action.payload;
        }
      )

      .addCase(
        checkout.rejected,
        (state, action) => {
          state.loading = false;
          state.error = action.payload;
        }
      )

      // -------------------------
      // RENTAL HISTORY
      // -------------------------

      .addCase(
        fetchRentalHistory.pending,
        (state) => {
          state.historyLoading = true;
          state.historyError = null;
        }
      )

      .addCase(
        fetchRentalHistory.fulfilled,
        (state, action) => {
          state.historyLoading = false;

          state.rentals =
            action.payload || [];
        }
      )

      .addCase(
        fetchRentalHistory.rejected,
        (state, action) => {
          state.historyLoading = false;
          state.historyError =
            action.payload;
        }
      );
  },
});

export const {
  clearRentalError,
  clearHistoryError,
} = rentalSlice.actions;

export default rentalSlice.reducer;
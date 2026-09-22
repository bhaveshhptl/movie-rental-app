import {
  createAsyncThunk,
  createSlice,
} from "@reduxjs/toolkit";

import {
  getAllUsers,
  getAllRentals,
  getOverdueRentals,
  getActiveMovies,
  getDailyTransactions,
  imposePenalty,
  makeAdmin,
  removeAdmin,
  markRentalReturned,
} from "./adminAPI";

// =====================================================
// HELPERS
// =====================================================

const getErrorMessage = (
  error,
  fallback
) =>
  error.response?.data?.message ||
  fallback;

// =====================================================
// FETCH USERS
// =====================================================

export const fetchAdminUsers =
  createAsyncThunk(
    "admin/fetchUsers",

    async (_, { rejectWithValue }) => {
      try {
        const data =
          await getAllUsers();

        return data.users;
      } catch (error) {
        return rejectWithValue(
          getErrorMessage(
            error,
            "Unable to fetch users"
          )
        );
      }
    }
  );

// =====================================================
// FETCH OVERDUE RENTALS
// =====================================================

export const fetchOverdueRentals =
  createAsyncThunk(
    "admin/fetchOverdueRentals",

    async (_, { rejectWithValue }) => {
      try {
        const data =
          await getOverdueRentals();

        // Supports both:
        //
        // { rentals: [...] }
        //
        // and
        //
        // { data: [...] }
        //
        // depending on backend response.

        return (
          data.rentals ||
          data.data ||
          []
        );
      } catch (error) {
        return rejectWithValue(
          getErrorMessage(
            error,
            "Unable to fetch overdue rentals"
          )
        );
      }
    }
  );

export const fetchActiveMovies = createAsyncThunk(
  "admin/fetchActiveMovies",
  async (_, { rejectWithValue }) => {
    try {
      const data = await getActiveMovies();
      return data.movies || [];
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "Unable to fetch active movies"));
    }
  }
);

// =====================================================
// FETCH DAILY TRANSACTIONS
// =====================================================

export const fetchDailyTransactions =
  createAsyncThunk(
    "admin/fetchDailyTransactions",

    async (
      date,
      { rejectWithValue }
    ) => {
      try {
        const data =
          await getDailyTransactions(
            date
          );

        return {
          date: data.date || date,
          transactions:
            data.transactions || [],
        };
      } catch (error) {
        return rejectWithValue(
          getErrorMessage(
            error,
            "Unable to fetch transactions"
          )
        );
      }
    }
  );

// =====================================================
// IMPOSE PENALTY
// =====================================================

export const applyPenalty =
  createAsyncThunk(
    "admin/applyPenalty",

    async (
      {
        rentalId,
        movieId,
        penaltyPerDay,
      },
      { rejectWithValue }
    ) => {
      try {
        const data =
          await imposePenalty(
            rentalId,
            movieId,
            penaltyPerDay
          );

        return data.rental;
      } catch (error) {
        return rejectWithValue(
          getErrorMessage(
            error,
            "Unable to apply penalty"
          )
        );
      }
    }
  );

export const fetchAllRentals =
  createAsyncThunk(
    "admin/fetchAllRentals",

    async (_, { rejectWithValue }) => {
      try {
        const data =
          await getAllRentals();

        return data.rentals || [];
      } catch (error) {
        return rejectWithValue(
          getErrorMessage(
            error,
            "Unable to fetch rental history"
          )
        );
      }
    }
  );

export const returnRental =
  createAsyncThunk(
    "admin/returnRental",

    async (
      rentalId,
      { rejectWithValue }
    ) => {
      try {
        const data =
          await markRentalReturned(
            rentalId
          );

        return data.rental;
      } catch (error) {
        return rejectWithValue(
          getErrorMessage(
            error,
            "Unable to mark rental as returned"
          )
        );
      }
    }
  );

// =====================================================
// MAKE ADMIN
// =====================================================

export const promoteUser =
  createAsyncThunk(
    "admin/promoteUser",

    async (
      userId,
      { rejectWithValue }
    ) => {
      try {
        const data =
          await makeAdmin(userId);

        return data.user;
      } catch (error) {
        return rejectWithValue(
          getErrorMessage(
            error,
            "Unable to promote user"
          )
        );
      }
    }
  );

// =====================================================
// REMOVE ADMIN
// =====================================================

export const demoteAdmin =
  createAsyncThunk(
    "admin/demoteAdmin",

    async (
      userId,
      { rejectWithValue }
    ) => {
      try {
        const data =
          await removeAdmin(userId);

        return data.user;
      } catch (error) {
        return rejectWithValue(
          getErrorMessage(
            error,
            "Unable to remove admin privileges"
          )
        );
      }
    }
  );

// =====================================================
// INITIAL STATE
// =====================================================

const initialState = {
  users: [],
  rentals: [],
  overdueRentals: [],
  activeMovies: [],
  transactions: [],

  selectedDate: null,

  usersLoading: false,
  overdueLoading: false,
  transactionsLoading: false,

  actionLoading: false,

  error: null,
  actionError: null,
};

// =====================================================
// SLICE
// =====================================================

const adminSlice = createSlice({
  name: "admin",

  initialState,

  reducers: {
    clearAdminError: (state) => {
      state.error = null;
    },

    clearAdminActionError: (state) => {
      state.actionError = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // =================================================
      // USERS
      // =================================================

      .addCase(
        fetchAdminUsers.pending,
        (state) => {
          state.usersLoading = true;
          state.error = null;
        }
      )

      .addCase(
        fetchAdminUsers.fulfilled,
        (state, action) => {
          state.usersLoading = false;

          state.users =
            action.payload || [];
        }
      )

      .addCase(
        fetchAdminUsers.rejected,
        (state, action) => {
          state.usersLoading = false;

          state.error =
            action.payload;
        }
      )

      // =================================================
      // OVERDUE RENTALS
      // =================================================

      .addCase(
        fetchOverdueRentals.pending,
        (state) => {
          state.overdueLoading = true;
          state.error = null;
        }
      )

      .addCase(
        fetchOverdueRentals.fulfilled,
        (state, action) => {
          state.overdueLoading = false;

          state.overdueRentals =
            action.payload || [];
        }
      )

      .addCase(
        fetchOverdueRentals.rejected,
        (state, action) => {
          state.overdueLoading = false;

          state.error =
            action.payload;
        }
      )

      .addCase(fetchActiveMovies.pending, (state) => {
        state.overdueLoading = true;
        state.error = null;
      })
      .addCase(fetchActiveMovies.fulfilled, (state, action) => {
        state.overdueLoading = false;
        state.activeMovies = action.payload || [];
      })
      .addCase(fetchActiveMovies.rejected, (state, action) => {
        state.overdueLoading = false;
        state.error = action.payload;
      })

      // =================================================
      // TRANSACTIONS
      // =================================================

      .addCase(
        fetchDailyTransactions.pending,
        (state) => {
          state.transactionsLoading = true;
          state.error = null;
        }
      )

      .addCase(
        fetchDailyTransactions.fulfilled,
        (state, action) => {
          state.transactionsLoading =
            false;

          state.selectedDate =
            action.payload.date;

          state.transactions =
            action.payload.transactions;
        }
      )

      .addCase(
        fetchDailyTransactions.rejected,
        (state, action) => {
          state.transactionsLoading =
            false;

          state.error =
            action.payload;
        }
      )

      .addCase(
        fetchAllRentals.pending,
        (state) => {
          state.rentalsLoading = true;
          state.error = null;
        }
      )

      .addCase(
        fetchAllRentals.fulfilled,
        (state, action) => {
          state.rentalsLoading = false;

          state.rentals =
            action.payload || [];
        }
      )

      .addCase(
        fetchAllRentals.rejected,
        (state, action) => {
          state.rentalsLoading = false;

          state.error =
            action.payload;
        }
      )

      .addCase(
        returnRental.pending,
        (state) => {
          state.actionLoading = true;
          state.actionError = null;
        }
      )

      .addCase(
        returnRental.fulfilled,
        (state, action) => {
          state.actionLoading = false;

          const updatedRental =
            action.payload;

          // Update history
          const historyIndex =
            state.rentals.findIndex(
              (rental) =>
                rental.id ===
                updatedRental.id
            );

          if (historyIndex !== -1) {
            state.rentals[historyIndex] =
              updatedRental;
          }

          // Remove from overdue list if present
          state.overdueRentals =
            state.overdueRentals.filter(
              (rental) =>
                rental.rentalId !==
                updatedRental.id
            );

          state.activeMovies = state.activeMovies.filter(
            (movie) => movie.rentalId !== updatedRental.id
          );
        }
      )

      .addCase(
        returnRental.rejected,
        (state, action) => {
          state.actionLoading = false;

          state.actionError =
            action.payload;
        }
      )
      // =================================================
      // PENALTY
      // =================================================

      .addCase(
        applyPenalty.pending,
        (state) => {
          state.actionLoading = true;
          state.actionError = null;
        }
      )

      .addCase(
        applyPenalty.fulfilled,
        (state, action) => {
          state.actionLoading = false;

          const updatedRental =
            action.payload;

          const index =
            state.overdueRentals.findIndex(
              (rental) =>
                rental.rentalId === updatedRental.id &&
                rental.movieId === action.meta.arg.movieId
            );

          if (index !== -1) {
            state.overdueRentals[index] = {
              ...state.overdueRentals[index],
              ...updatedRental.items.find((item) => item.movieId === action.meta.arg.movieId),
              rentalStatus: updatedRental.status,
            };
          }
        }
      )

      .addCase(
        applyPenalty.rejected,
        (state, action) => {
          state.actionLoading = false;

          state.actionError =
            action.payload;
        }
      )

      // =================================================
      // PROMOTE USER
      // =================================================

      .addCase(
        promoteUser.pending,
        (state) => {
          state.actionLoading = true;
          state.actionError = null;
        }
      )

      .addCase(
        promoteUser.fulfilled,
        (state, action) => {
          state.actionLoading = false;

          const updatedUser =
            action.payload;

          const index =
            state.users.findIndex(
              (user) =>
                user.id ===
                updatedUser.id
            );

          if (index !== -1) {
            state.users[index] =
              updatedUser;
          }
        }
      )


      .addCase(
        promoteUser.rejected,
        (state, action) => {
          state.actionLoading = false;

          state.actionError =
            action.payload;
        }
      )

      // =================================================
      // DEMOTE ADMIN
      // =================================================

      .addCase(
        demoteAdmin.pending,
        (state) => {
          state.actionLoading = true;
          state.actionError = null;
        }
      )

      .addCase(
        demoteAdmin.fulfilled,
        (state, action) => {
          state.actionLoading = false;

          const updatedUser =
            action.payload;

          const index =
            state.users.findIndex(
              (user) =>
                user.id ===
                updatedUser.id
            );

          if (index !== -1) {
            state.users[index] =
              updatedUser;
          }
        }
      )

      .addCase(
        demoteAdmin.rejected,
        (state, action) => {
          state.actionLoading = false;

          state.actionError =
            action.payload;
        }
      );
  },
});

export const {
  clearAdminError,
  clearAdminActionError,
} = adminSlice.actions;

export default adminSlice.reducer;

import {
  createAsyncThunk,
  createSlice,
} from "@reduxjs/toolkit";

import { getMovies } from "./movieAPI";

export const fetchMovies = createAsyncThunk(
  "movies/fetchMovies",
  async (params, { getState, rejectWithValue }) => {
    try {
      const { accessToken } = getState().auth;

      return await getMovies({
        ...params,
        accessToken,
      });
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to fetch movies"
      );
    }
  }
);

const initialState = {
  movies: [],

  pagination: {
    currentPage: 1,
    pageSize: 8,
    totalItems: 0,
    totalPages: 0,
  },

  loading: false,

  error: null,
};

const movieSlice = createSlice({
  name: "movies",

  initialState,

  reducers: {
    clearMovieError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder

      .addCase(fetchMovies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(
        fetchMovies.fulfilled,
        (state, action) => {
          state.loading = false;

          state.movies = action.payload.movies;

          state.pagination =
            action.payload.pagination;
        }
      )

      .addCase(
        fetchMovies.rejected,
        (state, action) => {
          state.loading = false;

          state.error = action.payload;
        }
      );
  },
});

export const {
  clearMovieError,
} = movieSlice.actions;

export default movieSlice.reducer;
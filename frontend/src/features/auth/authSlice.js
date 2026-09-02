import {
  createAsyncThunk,
  createSlice,
} from "@reduxjs/toolkit";

import {
  registerUser,
  loginUser,
  getCurrentUser,
  refreshAccessToken,
  logoutUser,
} from "./authAPI";

// =====================================================
// REGISTER
// =====================================================

export const register = createAsyncThunk(
  "auth/register",

  async (userData, { rejectWithValue }) => {
    try {
      const data =
        await registerUser(userData);

      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
        "Registration failed"
      );
    }
  }
);

// =====================================================
// LOGIN
// =====================================================

export const login = createAsyncThunk(
  "auth/login",

  async (
    credentials,
    { rejectWithValue }
  ) => {
    try {
      const data =
        await loginUser(credentials);

      // ------------------------------------------------
      // Only the refresh token is persisted.
      //
      // Access token stays in Redux memory.
      // ------------------------------------------------

      localStorage.setItem(
        "refreshToken",
        data.refreshToken
      );

      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
        "Login failed"
      );
    }
  }
);

// =====================================================
// GET CURRENT USER
// =====================================================

export const fetchCurrentUser =
  createAsyncThunk(
    "auth/fetchCurrentUser",

    async (
      accessToken,
      { rejectWithValue }
    ) => {
      try {
        const data =
          await getCurrentUser(
            accessToken
          );

        return data;
      } catch (error) {
        return rejectWithValue(
          error.response?.data?.message ||
          "Unable to fetch user"
        );
      }
    }
  );

// =====================================================
// REFRESH ACCESS TOKEN
// =====================================================

export const refreshToken =
  createAsyncThunk(
    "auth/refreshToken",

    async (
      _,
      { rejectWithValue }
    ) => {
      try {
        const storedRefreshToken =
          localStorage.getItem(
            "refreshToken"
          );

        if (!storedRefreshToken) {
          return rejectWithValue(
            "No refresh token available"
          );
        }

        const data =
          await refreshAccessToken(
            storedRefreshToken
          );

        // ------------------------------------------------
        // Backend rotates refresh token.
        // ------------------------------------------------

        if (data.refreshToken) {
          localStorage.setItem(
            "refreshToken",
            data.refreshToken
          );
        }

        return data;
      } catch (error) {
        localStorage.removeItem(
          "refreshToken"
        );

        return rejectWithValue(
          error.response?.data?.message ||
          "Session expired"
        );
      }
    }
  );

// =====================================================
// INITIALIZE AUTH
// =====================================================
//
// Runs when the application starts.
//
// If refresh token exists:
//
// refresh token
//      ↓
// new access token
//      ↓
// fetch current user
//
// If no refresh token exists:
//
// application is simply initialized as logged out.
// =====================================================

export const initializeAuth =
  createAsyncThunk(
    "auth/initialize",

    async (
      _,
      {
        dispatch,
        rejectWithValue,
      }
    ) => {
      const storedRefreshToken =
        localStorage.getItem(
          "refreshToken"
        );

      if (!storedRefreshToken) {
        return null;
      }

      try {
        const refreshResult =
          await dispatch(
            refreshToken()
          ).unwrap();

        await dispatch(
          fetchCurrentUser(
            refreshResult.accessToken
          )
        ).unwrap();

        return true;
      } catch (error) {
        localStorage.removeItem(
          "refreshToken"
        );

        return rejectWithValue(
          error || "Session expired"
        );
      }
    }
  );

// =====================================================
// LOGOUT
// =====================================================

export const logout = createAsyncThunk(
  "auth/logout",

  async (
    _,
    { rejectWithValue }
  ) => {
    try {
      const storedRefreshToken =
        localStorage.getItem(
          "refreshToken"
        );

      if (storedRefreshToken) {
        await logoutUser(
          storedRefreshToken
        );
      }

      localStorage.removeItem(
        "refreshToken"
      );

      return true;
    } catch (error) {
      // ------------------------------------------------
      // Even if backend logout fails,
      // local authentication must be cleared.
      // ------------------------------------------------

      localStorage.removeItem(
        "refreshToken"
      );

      return rejectWithValue(
        error.response?.data?.message ||
        "Logout failed"
      );
    }
  }
);

// =====================================================
// INITIAL STATE
// =====================================================

const initialState = {
  user: null,

  accessToken: null,

  isAuthenticated: false,

  loading: false,

  error: null,

  initialized: false,
};

// =====================================================
// SLICE
// =====================================================

const authSlice = createSlice({
  name: "auth",

  initialState,

  reducers: {
    clearAuthError: (state) => {
      state.error = null;
    },

    setAccessToken: (
      state,
      action
    ) => {
      state.accessToken =
        action.payload;
    },

    clearAuth: (state) => {
      state.user = null;
      state.accessToken = null;
      state.isAuthenticated = false;
    },
  },

  extraReducers: (builder) => {
    builder

      // =================================================
      // REGISTER
      // =================================================

      .addCase(
        register.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )

      .addCase(
        register.fulfilled,
        (state) => {
          state.loading = false;
          state.error = null;
        }
      )

      .addCase(
        register.rejected,
        (state, action) => {
          state.loading = false;
          state.error =
            action.payload;
        }
      )

      // =================================================
      // LOGIN
      // =================================================

      .addCase(
        login.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )

      .addCase(
        login.fulfilled,
        (state, action) => {
          state.loading = false;
          state.error = null;

          state.user =
            action.payload.user;

          state.accessToken =
            action.payload.accessToken;

          state.isAuthenticated = true;

          state.initialized = true;
        }
      )

      .addCase(
        login.rejected,
        (state, action) => {
          state.loading = false;
          state.error =
            action.payload;

          state.user = null;
          state.accessToken = null;

          state.isAuthenticated =
            false;

          state.initialized = true;
        }
      )

      // =================================================
      // CURRENT USER
      // =================================================

      .addCase(
        fetchCurrentUser.pending,
        (state) => {
          state.loading = true;
        }
      )

      .addCase(
        fetchCurrentUser.fulfilled,
        (state, action) => {
          state.loading = false;
          state.error = null;

          state.user =
            action.payload.user;

          state.isAuthenticated =
            true;

          state.initialized = true;
        }
      )

      .addCase(
        fetchCurrentUser.rejected,
        (state, action) => {
          state.loading = false;

          state.user = null;
          state.accessToken = null;

          state.isAuthenticated =
            false;

          state.initialized = true;

          state.error =
            action.payload;
        }
      )

      // =================================================
      // REFRESH TOKEN
      // =================================================

      .addCase(
        refreshToken.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )

      .addCase(
        refreshToken.fulfilled,
        (state, action) => {
          state.loading = false;
          state.error = null;

          state.accessToken =
            action.payload.accessToken;

          state.isAuthenticated =
            true;
        }
      )

      .addCase(
        refreshToken.rejected,
        (state, action) => {
          state.loading = false;

          state.user = null;
          state.accessToken = null;

          state.isAuthenticated =
            false;

          state.error =
            action.payload;
        }
      )

      // =================================================
      // INITIALIZE AUTH
      // =================================================

      .addCase(
        initializeAuth.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )

      .addCase(
        initializeAuth.fulfilled,
        (state) => {
          state.loading = false;
          state.initialized = true;
          state.error = null;
        }
      )

      .addCase(
        initializeAuth.rejected,
        (state, action) => {
          state.loading = false;

          state.user = null;
          state.accessToken = null;

          state.isAuthenticated =
            false;

          state.initialized = true;

          state.error =
            action.payload;
        }
      )

      // =================================================
      // LOGOUT
      // =================================================

      .addCase(
        logout.pending,
        (state) => {
          state.loading = true;
        }
      )

      .addCase(
        logout.fulfilled,
        (state) => {
          state.loading = false;

          state.user = null;
          state.accessToken = null;

          state.isAuthenticated =
            false;

          state.error = null;
        }
      )

      .addCase(
        logout.rejected,
        (state, action) => {
          state.loading = false;

          state.user = null;
          state.accessToken = null;

          state.isAuthenticated =
            false;

          state.error =
            action.payload;
        }
      );
  },
});

// =====================================================
// ACTIONS
// =====================================================

export const {
  clearAuthError,
  setAccessToken,
  clearAuth,
} = authSlice.actions;

// =====================================================
// REDUCER
// =====================================================

export default authSlice.reducer;
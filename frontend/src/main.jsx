import React from "react";
import ReactDOM from "react-dom/client";

import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";

import App from "./App";
import { store } from "./app/store";

import {
  setAccessToken,
  clearAuth,
} from "./features/auth/authSlice";

import { configureAuthHandlers } from "./services/api";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

import "./styles/app.css";

// =====================================================
// CONNECT AXIOS WITH REDUX AUTH STATE
// =====================================================

configureAuthHandlers({
  // ---------------------------------------------------
  // Get current access token from Redux
  // ---------------------------------------------------

  getAccessToken: () =>
    store.getState().auth.accessToken,

  // ---------------------------------------------------
  // Get refresh token from localStorage
  // ---------------------------------------------------

  getRefreshToken: () =>
    localStorage.getItem(
      "refreshToken"
    ),

  // ---------------------------------------------------
  // Store newly generated access token
  // ---------------------------------------------------

  setAccessToken: (accessToken) => {
    store.dispatch(
      setAccessToken(accessToken)
    );
  },

  // ---------------------------------------------------
  // Store rotated refresh token
  // ---------------------------------------------------

  setRefreshToken: (refreshToken) => {
    localStorage.setItem(
      "refreshToken",
      refreshToken
    );
  },

  // ---------------------------------------------------
  // Clear authentication
  // ---------------------------------------------------

  clearAuth: () => {
    localStorage.removeItem(
      "refreshToken"
    );

    store.dispatch(clearAuth());
  },
});

// =====================================================
// RENDER APPLICATION
// =====================================================

ReactDOM.createRoot(
  document.getElementById("root")
).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
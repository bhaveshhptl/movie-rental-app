import {
  useEffect,
  useRef,
} from "react";

import {
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import {
  useDispatch,
  useSelector,
} from "react-redux";

import {
  Spinner,
} from "react-bootstrap";

import {
  initializeAuth,
} from "./features/auth/authSlice";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Cart from "./pages/Cart";
import Profile from "./pages/Profile";

function AuthInitializer() {
  const dispatch = useDispatch();

  const initialized =
    useSelector(
      (state) =>
        state.auth.initialized
    );

  const initializationStarted =
    useRef(false);

  useEffect(() => {
    // --------------------------------------------------
    // React StrictMode runs effects twice in development.
    //
    // Prevent duplicate initialization.
    // --------------------------------------------------

    if (initializationStarted.current) {
      return;
    }

    initializationStarted.current = true;

    dispatch(initializeAuth());
  }, [dispatch]);

  if (!initialized) {
    return (
      <div
        className="
          min-vh-100
          d-flex
          align-items-center
          justify-content-center
          bg-dark
          text-white
        "
      >
        <div className="text-center">
          <Spinner
            animation="border"
            variant="danger"
            className="mb-3"
          />

          <div>
            Restoring your session...
          </div>
        </div>
      </div>
    );
  }

  return null;
}

function Placeholder({ title }) {
  return (
    <div className="container py-5 text-white">
      <h2>{title}</h2>

      <p className="text-secondary">
        This page will be implemented next.
      </p>
    </div>
  );
}

function App() {
  return (
    <>
      <AuthInitializer />

      <Routes>
        <Route
          path="/"
          element={
            <Navigate
              to="/login"
              replace
            />
          }
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/home"
          element={<Home />}
        />

        <Route
          path="/cart"
          element={<Cart />}
        />

        <Route
          path="/profile"
          element={<Profile />}
        />
      </Routes>
    </>
  );
}

export default App;
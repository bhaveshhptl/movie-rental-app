import {
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Cart from "./pages/Cart";
import Profile from "./pages/Profile";

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
  );
}

export default App;
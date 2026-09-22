import {
  Navigate,
  Outlet,
} from "react-router-dom";

import {
  useSelector,
} from "react-redux";

import {
  Spinner,
} from "react-bootstrap";

function AdminRoute() {
  const {
    initialized,
    isAuthenticated,
    user,
  } = useSelector(
    (state) => state.auth
  );

  // --------------------------------------------------
  // Wait until authentication restoration finishes
  // --------------------------------------------------

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
          />

          <div className="mt-3">
            Checking authorization...
          </div>
        </div>
      </div>
    );
  }

  // --------------------------------------------------
  // Not logged in
  // --------------------------------------------------

  if (!isAuthenticated || !user) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  // --------------------------------------------------
  // Only admin + super_admin
  // --------------------------------------------------

  const isAdmin =
    user.role === "admin" ||
    user.role === "super_admin";

  if (!isAdmin) {
    return (
      <Navigate
        to="/home"
        replace
      />
    );
  }

  return <Outlet />;
}

export default AdminRoute;
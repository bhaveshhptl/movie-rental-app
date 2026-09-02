import {
  Container,
  Nav,
  Navbar,
} from "react-bootstrap";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  useDispatch,
  useSelector,
} from "react-redux";

import {
  logout,
} from "../features/auth/authSlice";

function AppNavBar() {
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const user =
    useSelector(
      (state) => state.auth.user
    );

  const handleLogout = async () => {
    await dispatch(logout());

    navigate("/login", {
      replace: true,
    });
  };

  return (
    <Navbar
      bg="dark"
      variant="dark"
      expand="lg"
      className="border-bottom border-secondary"
    >
      <Container>
        <Navbar.Brand
          as={Link}
          to="/home"
          className="fw-bold"
        >
          Movie Rental
        </Navbar.Brand>

        <Navbar.Toggle
          aria-controls="main-navbar"
        />

        <Navbar.Collapse id="main-navbar">
          <Nav className="me-auto">
            <Nav.Link
              as={Link}
              to="/home"
            >
              Movies
            </Nav.Link>

            <Nav.Link
              as={Link}
              to="/cart"
            >
              Cart
            </Nav.Link>

            <Nav.Link
              as={Link}
              to="/profile"
            >
              Profile
            </Nav.Link>
          </Nav>

          <Nav>
            {user && (
              <Navbar.Text className="me-3">
                {user.name}
              </Navbar.Text>
            )}

            <Nav.Link
              onClick={handleLogout}
              className="text-danger"
            >
              Logout
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default AppNavBar;
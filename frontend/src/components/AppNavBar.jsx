import {
  Container,
  Navbar,
  Nav,
  Button,
  Dropdown,
} from "react-bootstrap";

import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function AppNavbar() {
  const navigate = useNavigate();

  const { user } = useSelector(
    (state) => state.auth
  );

  return (
    <Navbar
      expand="lg"
      variant="dark"
      className="app-navbar"
    >
      <Container>
        <Navbar.Brand
          onClick={() => navigate("/home")}
          className="fw-bold"
          style={{ cursor: "pointer" }}
        >
          🎬 Movie Rental
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="main-navbar" />

        <Navbar.Collapse id="main-navbar">
          <Nav className="me-auto">
            <Nav.Link
              onClick={() => navigate("/home")}
            >
              Movies
            </Nav.Link>
          </Nav>

          <div className="d-flex align-items-center gap-2">

            <Button
              variant="outline-light"
              onClick={() => navigate("/cart")}
            >
              🛒 Cart
            </Button>

            <Dropdown align="end">
              <Dropdown.Toggle
                variant="danger"
                id="profile-dropdown"
              >
                👤 {user?.name || "Profile"}
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item
                  onClick={() =>
                    navigate("/profile")
                  }
                >
                  Profile
                </Dropdown.Item>

                <Dropdown.Item
                  onClick={() =>
                    navigate("/profile")
                  }
                >
                  Rental History
                </Dropdown.Item>

                <Dropdown.Divider />

                <Dropdown.Item>
                  Logout
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>

          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default AppNavbar;
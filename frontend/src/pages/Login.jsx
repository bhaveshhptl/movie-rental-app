import { useState } from "react";

import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Alert,
  Spinner,
} from "react-bootstrap";

import { Link, useNavigate } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";

import { login } from "../features/auth/authSlice.js";

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    loading,
    error,
  } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const result = await dispatch(login(formData));

    if (login.fulfilled.match(result)) {
      navigate("/home");
    }
  };

  return (
    <Container className="min-vh-100 d-flex align-items-center justify-content-center">
      <Row className="w-100 justify-content-center">
        <Col xs={12} sm={10} md={6} lg={4}>
          <Card className="bg-dark text-white border-secondary shadow">
            <Card.Body className="p-4">

              <div className="text-center mb-4">
                <h2 className="fw-bold">
                  Movie Rental
                </h2>

                <p className="text-secondary mb-0">
                  Sign in to continue
                </p>
              </div>

              {error && (
                <Alert variant="danger">
                  {error}
                </Alert>
              )}

              <Form onSubmit={handleSubmit}>

                <Form.Group className="mb-3">
                  <Form.Label>
                    Email
                  </Form.Label>

                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>
                    Password
                  </Form.Label>

                  <Form.Control
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    required
                  />
                </Form.Group>

                <Button
                  variant="danger"
                  type="submit"
                  className="w-100"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Spinner
                        size="sm"
                        animation="border"
                        className="me-2"
                      />

                      Logging in...
                    </>
                  ) : (
                    "Login"
                  )}
                </Button>

              </Form>

              <div className="text-center mt-4">
                <span className="text-secondary">
                  Don't have an account?{" "}
                </span>

                <Link
                  to="/register"
                  className="text-danger text-decoration-none"
                >
                  Register
                </Link>
              </div>

            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Login;
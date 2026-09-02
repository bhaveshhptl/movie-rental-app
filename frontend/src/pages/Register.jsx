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

import { register } from "../features/auth/authSlice.js";

function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    loading,
    error,
  } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    name: "",
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

    const result = await dispatch(
      register(formData)
    );

    if (register.fulfilled.match(result)) {
      navigate("/login");
    }
  };

  return (
    <Container className="min-vh-100 d-flex align-items-center justify-content-center">
      <Row className="w-100 justify-content-center">
        <Col xs={12} sm={10} md={6} lg={5}>
          <Card className="bg-dark text-white border-secondary shadow">
            <Card.Body className="p-4">

              <div className="text-center mb-4">
                <h2 className="fw-bold">
                  Create Account
                </h2>

                <p className="text-secondary mb-0">
                  Join Movie Rental
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
                    Name
                  </Form.Label>

                  <Form.Control
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your name"
                    required
                  />
                </Form.Group>

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
                    placeholder="Create a password"
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

                      Creating account...
                    </>
                  ) : (
                    "Create Account"
                  )}
                </Button>

              </Form>

              <div className="text-center mt-4">
                <span className="text-secondary">
                  Already have an account?{" "}
                </span>

                <Link
                  to="/login"
                  className="text-danger text-decoration-none"
                >
                  Login
                </Link>
              </div>

            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Register;
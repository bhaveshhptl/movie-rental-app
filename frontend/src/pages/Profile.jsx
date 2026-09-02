import { useEffect } from "react";

import {
  Alert,
  Badge,
  Card,
  Col,
  Container,
  Row,
  Spinner,
} from "react-bootstrap";

import { useDispatch, useSelector } from "react-redux";

import AppNavbar from "../components/AppNavbar";

import {
  fetchRentalHistory,
} from "../features/rental/rentalSlice";

function Profile() {
  const dispatch = useDispatch();

  const { user } = useSelector(
    (state) => state.auth
  );

  const {
    rentals,
    historyLoading,
    historyError,
  } = useSelector(
    (state) => state.rental
  );

  useEffect(() => {
    dispatch(fetchRentalHistory());
  }, [dispatch]);

  const isOverdue = (item, rental) => {
    if (
      rental.status === "returned" ||
      rental.status === "completed"
    ) {
      return false;
    }

    return (
      new Date(item.dueDate) <
      new Date()
    );
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  return (
    <>
      <AppNavbar />

      <Container className="py-4">

        <h2 className="fw-bold mb-4">
          My Profile
        </h2>

        {/* USER DETAILS */}

        <Card className="bg-dark text-white border-secondary mb-5">
          <Card.Body>

            <h4 className="mb-4">
              Personal Details
            </h4>

            <Row>
              <Col md={4}>
                <div className="text-secondary">
                  Name
                </div>

                <div className="fs-5">
                  {user?.name || "N/A"}
                </div>
              </Col>

              <Col md={4}>
                <div className="text-secondary">
                  Email
                </div>

                <div className="fs-5">
                  {user?.email || "N/A"}
                </div>
              </Col>

              <Col md={4}>
                <div className="text-secondary">
                  Role
                </div>

                <div className="fs-5 text-capitalize">
                  {user?.role || "user"}
                </div>
              </Col>
            </Row>

          </Card.Body>
        </Card>

        {/* RENTAL HISTORY */}

        <div className="d-flex justify-content-between align-items-center mb-3">

          <div>
            <h3 className="fw-bold mb-1">
              Rental History
            </h3>

            <p className="text-secondary">
              Your previous and active rentals
            </p>
          </div>

          <Badge bg="secondary">
            {rentals.length} rental
            {rentals.length !== 1
              ? "s"
              : ""}
          </Badge>

        </div>

        {historyError && (
          <Alert variant="danger">
            {historyError}
          </Alert>
        )}

        {historyLoading ? (
          <div className="text-center py-5">
            <Spinner
              animation="border"
              variant="danger"
            />
          </div>
        ) : rentals.length === 0 ? (
          <Card className="bg-dark text-white border-secondary p-5 text-center">
            <h4>
              No rental history
            </h4>

            <p className="text-secondary mb-0">
              Your rented movies will appear
              here.
            </p>
          </Card>
        ) : (
          rentals.map((rental) => (
            <Card
              key={rental.id}
              className="bg-dark text-white border-secondary mb-4"
            >
              <Card.Body>

                <div className="d-flex justify-content-between align-items-center mb-3">

                  <div>
                    <h5>
                      Rental #{rental.id}
                    </h5>

                    <small className="text-secondary">
                      Rented on{" "}
                      {formatDate(
                        rental.rentalDate
                      )}
                    </small>
                  </div>

                  <Badge
                    bg={
                      rental.status ===
                        "returned" ||
                      rental.status ===
                        "completed"
                        ? "secondary"
                        : "success"
                    }
                  >
                    {rental.status}
                  </Badge>

                </div>

                <hr />

                {rental.items?.map(
                  (item) => {
                    const overdue =
                      isOverdue(
                        item,
                        rental
                      );

                    return (
                      <div
                        key={
                          item.movieId
                        }
                        className={`rental-history-item ${
                          overdue
                            ? "overdue-rental"
                            : "active-rental"
                        }`}
                      >

                        <Row className="align-items-center">

                          <Col md={5}>
                            <h6 className="mb-1">
                              {
                                item.movieTitle
                              }
                            </h6>

                            <small className="text-secondary">
                              ₹
                              {
                                item.dailyRate
                              }{" "}
                              / day
                            </small>
                          </Col>

                          <Col md={2}>
                            <small className="text-secondary">
                              Duration
                            </small>

                            <div>
                              {
                                item.rentalDays
                              }{" "}
                              day
                              {item.rentalDays >
                              1
                                ? "s"
                                : ""}
                            </div>
                          </Col>

                          <Col md={2}>
                            <small className="text-secondary">
                              Due Date
                            </small>

                            <div>
                              {formatDate(
                                item.dueDate
                              )}
                            </div>
                          </Col>

                          <Col
                            md={3}
                            className="text-md-end"
                          >

                            <div className="fw-bold">
                              ₹
                              {
                                item.lineTotal
                              }
                            </div>

                            <Badge
                              bg={
                                overdue
                                  ? "danger"
                                  : "success"
                              }
                              className="mt-1"
                            >
                              {overdue
                                ? "Overdue"
                                : rental.status ===
                                  "returned"
                                  ? "Returned"
                                  : "Active"}
                            </Badge>

                          </Col>

                        </Row>

                      </div>
                    );
                  }
                )}

                <hr />

                <div className="text-end fw-bold">
                  Total: ₹
                  {rental.totalCost}
                </div>

              </Card.Body>
            </Card>
          ))
        )}

      </Container>
    </>
  );
}

export default Profile;
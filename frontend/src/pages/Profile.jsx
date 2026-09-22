import { useEffect } from "react";
import { Alert, Badge, Card, Col, Container, Row, Spinner } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import AppNavbar from "../components/AppNavBar";
import { fetchRentalHistory } from "../features/rental/rentalSlice";

const formatDate = (date) => new Date(date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });

function Profile() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const { rentals, historyLoading, historyError } = useSelector((state) => state.rental);
  useEffect(() => { dispatch(fetchRentalHistory()); }, [dispatch]);
  const movies = rentals.flatMap((rental) => (rental.items || []).map((item) => ({ ...item, rental })))
    .sort((a, b) => new Date(b.rental.rentalDate) - new Date(a.rental.rentalDate));

  return <>
    <AppNavbar />
    <Container className="py-4">
      <h2 className="fw-bold mb-4">My Profile</h2>
      <Card className="bg-dark text-white border-secondary mb-5"><Card.Body><h4 className="mb-4">Personal Details</h4><Row>
        <Col md={4}><div className="text-secondary">Name</div><div className="fs-5">{user?.name || "N/A"}</div></Col>
        <Col md={4}><div className="text-secondary">Email</div><div className="fs-5">{user?.email || "N/A"}</div></Col>
        <Col md={4}><div className="text-secondary">Role</div><div className="fs-5 text-capitalize">{user?.role || "user"}</div></Col>
      </Row></Card.Body></Card>
      <div className="d-flex justify-content-between align-items-center mb-3"><div><h3 className="fw-bold mb-1">My Movies</h3><p className="text-secondary">Every movie you have rented, shown individually.</p></div><Badge bg="secondary">{movies.length} movie{movies.length !== 1 ? "s" : ""}</Badge></div>
      {historyError && <Alert variant="danger">{historyError}</Alert>}
      {historyLoading ? <div className="text-center py-5"><Spinner animation="border" variant="danger" /></div> : movies.length === 0 ? <Card className="bg-dark text-white border-secondary p-5 text-center"><h4>No rental history</h4><p className="text-secondary mb-0">Your rented movies will appear here.</p></Card> : movies.map(({ rental, ...item }) => {
        const isReturned = rental.status === "returned";
        const overdue = !isReturned && item.dueDate && new Date(item.dueDate) < new Date();
        const penalty = Number(item.penalty || 0);
        return <Card key={`${rental.id}-${item.movieId}`} className="bg-dark text-white border-secondary mb-3"><Card.Body><Row className="align-items-center">
          <Col md={5}><h5 className="mb-1">{item.movieTitle}</h5><small className="text-secondary">Rented {formatDate(rental.rentalDate)} · ₹{item.dailyRate} / day</small></Col>
          <Col md={2}><small className="text-secondary">Duration</small><div>{item.rentalDays} day{item.rentalDays > 1 ? "s" : ""}</div></Col>
          <Col md={2}><small className="text-secondary">Amount</small><div className="fw-bold">₹{Number(item.lineTotal || 0) + penalty}</div>{penalty > 0 && <small className="text-danger">Includes ₹{penalty} penalty</small>}</Col>
          <Col md={3} className="text-md-end"><Badge bg={isReturned ? "secondary" : overdue ? "danger" : "success"}>{isReturned ? "Returned" : overdue ? "Overdue" : "Active"}</Badge></Col>
        </Row></Card.Body></Card>;
      })}
    </Container>
  </>;
}

export default Profile;

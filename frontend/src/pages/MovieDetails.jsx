import { useEffect, useState } from "react";
import { Alert, Badge, Button, Col, Container, Form, Row, Spinner } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import AppNavbar from "../components/AppNavBar";
import { addMovieToCart } from "../features/cart/cartSlice";
import { getMovie } from "../features/movies/movieAPI";

function MovieDetails() {
  const { movieId } = useParams();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const rentals = useSelector((state) => state.rental.rentals);
  const [movie, setMovie] = useState(null);
  const [days, setDays] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [adding, setAdding] = useState(false);
  const isAdminBrowse = user?.role === "admin";
  const hasActiveRental = rentals.some((rental) =>
    rental.status !== "returned" && (rental.items || []).some((item) => String(item.movieId) === String(movieId))
  );

  useEffect(() => {
    setLoading(true);
    getMovie(movieId).then(setMovie).catch((requestError) => {
      setError(requestError.response?.data?.message || "Unable to load this movie.");
    }).finally(() => setLoading(false));
  }, [movieId]);

  const rent = async () => {
    if (hasActiveRental) {
      window.alert("This movie is already in your active rentals.");
      return;
    }
    setAdding(true);
    const result = await dispatch(addMovieToCart({ movieId: movie.id, rentalDays: days }));
    setAdding(false);
    if (addMovieToCart.fulfilled.match(result)) window.alert("Movie added to your cart.");
  };

  return <>
    <AppNavbar />
    <Container className="py-5">
      <Button as={Link} to="/home" variant="outline-light" className="mb-4">← Back to movies</Button>
      {loading && <div className="text-center py-5"><Spinner animation="border" variant="danger" /></div>}
      {error && <Alert variant="danger">{error}</Alert>}
      {movie && <Row className="g-5 align-items-start">
        <Col md={5}><img src={movie.posterUrl} alt={movie.title} className="img-fluid rounded shadow movie-detail-poster" /></Col>
        <Col md={7} className="text-white">
          <Badge bg="danger" className="mb-3">{movie.genre}</Badge>
          <h1 className="fw-bold">{movie.title}</h1>
          <p className="text-secondary fs-5">{movie.releaseYear}</p>
          <p className="lead text-light">{movie.description}</p>
          <div className="border-top border-secondary pt-4 mt-4">
            <div className="fs-3 fw-bold mb-1">₹{movie.dailyRate} <span className="fs-6 text-secondary fw-normal">/ day</span></div>
            <p className="text-secondary">{movie.availableCopies} of {movie.copies} copies currently available</p>
            {!isAdminBrowse && <div className="d-flex gap-3 align-items-end flex-wrap">
              <Form.Group><Form.Label>Rental duration</Form.Label><Form.Select value={days} onChange={(event) => setDays(Number(event.target.value))}>{[1,2,3,4,5,6,7].map((day) => <option key={day} value={day}>{day} day{day > 1 ? "s" : ""}</option>)}</Form.Select></Form.Group>
              <Button variant="danger" size="lg" onClick={rent} disabled={adding || !movie.availableCopies || hasActiveRental}>{adding ? "Adding..." : hasActiveRental ? "Already Rented" : !movie.availableCopies ? "Unavailable" : "Add to Cart"}</Button>
            </div>}
          </div>
        </Col>
      </Row>}
    </Container>
  </>;
}

export default MovieDetails;

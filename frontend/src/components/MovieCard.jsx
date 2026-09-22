import { useState } from "react";

import {
  Alert,
  Button,
  Card,
  Form,
} from "react-bootstrap";

import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import {
  addMovieToCart,
} from "../features/cart/cartSlice";

function MovieCard({ movie }) {
  const [addedToCart, setAddedToCart] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const rentals = useSelector((state) => state.rental.rentals);
  const isAdminBrowse = user?.role === "admin";
  const hasActiveRental = rentals.some(
    (rental) => rental.status !== "returned" &&
      (rental.items || []).some((item) => String(item.movieId) === String(movie.id))
  );

  const [rentalDays, setRentalDays] =
    useState(1);

  const cartError = useSelector(
    (state) => state.cart.error
  );

  const handleAddToCart = async () => {
    if (hasActiveRental) {
      window.alert("This movie is already in your active rentals.");
      return;
    }
    setAddingToCart(true);

    const result = await dispatch(
      addMovieToCart({
        movieId: movie.id,
        rentalDays,
      })
    );

    setAddingToCart(false);

    if (addMovieToCart.fulfilled.match(result)) {
      setAddedToCart(true);

      setTimeout(() => {
        setAddedToCart(false);
      }, 2000);
    }
  };

  return (
    <Card
      className="h-100 bg-dark text-white border-secondary movie-card"
      role="button"
      onClick={() => navigate(`/movies/${movie.id}`)}
      style={{ cursor: "pointer" }}
    >
      <Card.Img
        variant="top"
        src={movie.posterUrl}
        alt={movie.title}
        className="movie-poster"
      />

      <Card.Body className="d-flex flex-column">
        <Card.Title>
          {movie.title}
        </Card.Title>

        <Card.Text className="text-secondary">
          {movie.genre} • {movie.releaseYear}
        </Card.Text>

        <Card.Text className="small text-secondary">
          {movie.description}
        </Card.Text>

        {!isAdminBrowse && <div className="mt-auto" onClick={(event) => event.stopPropagation()}>

          <div className="mb-2">
            <strong>
              ₹{movie.dailyRate}
            </strong>{" "}
            <span className="text-secondary">
              / day
            </span>
          </div>

          <Form.Select
            value={rentalDays}
            onChange={(event) =>
              setRentalDays(
                Number(event.target.value)
              )
            }
            className="mb-2"
          >
            <option value={1}>1 day</option>
            <option value={2}>2 days</option>
            <option value={3}>3 days</option>
            <option value={4}>4 days</option>
            <option value={5}>5 days</option>
            <option value={6}>6 days</option>
            <option value={7}>7 days</option>
          </Form.Select>

          {cartError && (
            <Alert
              variant="danger"
              className="small py-2"
            >
              {cartError}
            </Alert>
          )}

          <Button
            variant="danger"
            className="w-100"
            onClick={handleAddToCart}
            disabled={
              addingToCart ||
              movie.availableCopies <= 0 ||
              hasActiveRental
            }
          >
            {addingToCart
              ? "Adding..."
              : addedToCart
                ? "✓ Added to Cart"
                : hasActiveRental
                  ? "Already Rented"
                : movie.availableCopies <= 0
                  ? "Unavailable"
                  : "Add to Cart"}
          </Button>

        </div>}
      </Card.Body>
    </Card>
  );
}

export default MovieCard;

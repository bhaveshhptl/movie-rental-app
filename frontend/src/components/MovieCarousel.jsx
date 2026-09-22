import {
  Carousel,
  Button,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

function MovieCarousel({ movies, canRent = true }) {
  const navigate = useNavigate();
  const rentals = useSelector((state) => state.rental.rentals);
  const carouselMovies = movies.slice(0, 4);

  if (carouselMovies.length === 0) {
    return null;
  }

  return (
    <Carousel
      className="movie-carousel mb-5"
      interval={4000}
    >
      {carouselMovies.map((movie) => (
        <Carousel.Item
          key={movie.id}
          onClick={() => navigate(`/movies/${movie.id}`)}
          style={{ cursor: "pointer" }}
        >
          <img
            src={movie.posterUrl}
            alt={movie.title}
            className="carousel-image"
          />

          <Carousel.Caption>
            <h2 className="fw-bold">
              {movie.title}
            </h2>

            <p>
              {movie.description}
            </p>

            {canRent && <Button
              variant="danger"
              onClick={(event) => {
                event.stopPropagation();
                const alreadyRented = rentals.some(
                  (rental) => rental.status !== "returned" &&
                    (rental.items || []).some((item) => String(item.movieId) === String(movie.id))
                );
                if (alreadyRented) {
                  window.alert("This movie is already in your active rentals.");
                  return;
                }
                navigate("/cart");
              }}
            >
              Rent Now
            </Button>}
          </Carousel.Caption>
        </Carousel.Item>
      ))}
    </Carousel>
  );
}

export default MovieCarousel;

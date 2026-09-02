import {
  Carousel,
  Button,
} from "react-bootstrap";

function MovieCarousel({ movies }) {
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
        <Carousel.Item key={movie.id}>
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

            <Button variant="danger">
              Rent Now
            </Button>
          </Carousel.Caption>
        </Carousel.Item>
      ))}
    </Carousel>
  );
}

export default MovieCarousel;
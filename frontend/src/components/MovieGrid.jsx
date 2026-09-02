import {
  Row,
  Col,
  Spinner,
  Alert,
} from "react-bootstrap";

import MovieCard from "./MovieCard";

function MovieGrid({
  movies,
  loading,
  error,
}) {
  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner
          animation="border"
          variant="danger"
        />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="danger">
        {error}
      </Alert>
    );
  }

  if (movies.length === 0) {
    return (
      <div className="text-center py-5 text-secondary">
        No movies found.
      </div>
    );
  }

  return (
    <Row className="g-4">
      {movies.map((movie) => (
        <Col
          key={movie.id}
          xs={12}
          sm={6}
          md={4}
          lg={3}
        >
          <MovieCard movie={movie} />
        </Col>
      ))}
    </Row>
  );
}

export default MovieGrid;
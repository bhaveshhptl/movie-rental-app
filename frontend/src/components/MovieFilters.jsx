import {
  Row,
  Col,
  Form,
} from "react-bootstrap";

function MovieFilters({
  search,
  genre,
  onSearchChange,
  onGenreChange,
}) {
  return (
    <Row className="g-3 mb-4">

      <Col xs={12} md={8}>
        <Form.Control
          type="text"
          placeholder="Search movies..."
          value={search}
          onChange={(event) =>
            onSearchChange(event.target.value)
          }
        />
      </Col>

      <Col xs={12} md={4}>
        <Form.Select
          value={genre}
          onChange={(event) =>
            onGenreChange(event.target.value)
          }
        >
          <option value="">
            All Genres
          </option>

          <option value="Action">
            Action
          </option>

          <option value="Adventure">
            Adventure
          </option>

          <option value="Comedy">
            Comedy
          </option>

          <option value="Drama">
            Drama
          </option>

          <option value="Science Fiction">
            Science Fiction
          </option>

          <option value="Thriller">
            Thriller
          </option>
        </Form.Select>
      </Col>

    </Row>
  );
}

export default MovieFilters;
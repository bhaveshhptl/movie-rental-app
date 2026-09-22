import { Card, Spinner, Table } from "react-bootstrap";
import { formatDate } from "./helpers";

function AdminActiveMovies({ movies, loading }) {
  return <Card className="bg-dark text-white border-secondary mb-4">
    <Card.Header className="border-secondary"><div className="d-flex justify-content-between"><div><h4 className="mb-0">Active Movies by User</h4><small className="text-secondary">Movies that are still within their rental period.</small></div>{loading && <Spinner animation="border" size="sm" variant="danger" />}</div></Card.Header>
    <Card.Body className="p-0">{movies.length === 0 ? <div className="text-center text-secondary py-4">No active movies.</div> : <Table responsive variant="dark" hover className="mb-0 align-middle"><thead><tr><th>User</th><th>Movie</th><th>Rented</th><th>Due</th><th>Amount</th></tr></thead><tbody>{movies.map((movie) => <tr key={`${movie.rentalId}-${movie.movieId}`}><td>{movie.userName}</td><td className="fw-semibold">{movie.movieTitle}</td><td>{formatDate(movie.rentalDate)}</td><td>{movie.dueDate ? formatDate(movie.dueDate) : "—"}</td><td>₹{movie.lineTotal}</td></tr>)}</tbody></Table>}</Card.Body>
  </Card>;
}

export default AdminActiveMovies;

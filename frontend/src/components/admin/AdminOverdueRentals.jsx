import { Badge, Button, Card, Form, Spinner, Table } from "react-bootstrap";
import { formatDate } from "./helpers";

function AdminOverdueRentals({ overdueRentals, overdueLoading, actionLoading, penaltyAmounts, onPenaltyChange, onApplyPenalty, onReturn }) {
  return <Card className="bg-dark text-white border-secondary mb-4">
    <Card.Header className="border-secondary"><div className="d-flex justify-content-between align-items-center"><div><h4 className="mb-0">Overdue Movies by User</h4><small className="text-secondary">Set a penalty per day for each overdue movie.</small></div>{overdueLoading && <Spinner animation="border" size="sm" variant="danger" />}</div></Card.Header>
    <Card.Body className="p-0">{overdueRentals.length === 0 ? <div className="text-center text-secondary py-4">No overdue movies.</div> : <Table responsive variant="dark" hover className="mb-0 align-middle"><thead><tr><th>User</th><th>Movie</th><th>Due</th><th>Current Penalty</th><th>Actions</th></tr></thead><tbody>{overdueRentals.map((movie) => {
      const key = `${movie.rentalId}-${movie.movieId}`;
      return <tr key={key}><td>{movie.userName}</td><td className="fw-semibold">{movie.movieTitle}</td><td><Badge bg="danger">{formatDate(movie.dueDate)}</Badge></td><td>₹{Number(movie.penalty || 0)}</td><td><div className="d-flex gap-2 flex-wrap"><Form.Control type="number" min="1" size="sm" placeholder="₹ / day" value={penaltyAmounts[key] || ""} onChange={(event) => onPenaltyChange(key, event.target.value)} style={{ maxWidth: "110px" }} /><Button size="sm" variant="danger" disabled={actionLoading || !penaltyAmounts[key]} onClick={() => onApplyPenalty(movie)}>Apply / day</Button><Button size="sm" variant="success" disabled={actionLoading} onClick={() => onReturn(movie.rentalId)}>Mark Returned</Button></div></td></tr>;
    })}</tbody></Table>}</Card.Body>
  </Card>;
}

export default AdminOverdueRentals;

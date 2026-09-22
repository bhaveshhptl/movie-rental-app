import { Badge, Modal, Table } from "react-bootstrap";
import { formatDate } from "./helpers";

function RentalDetailsModal({ rental, user, onHide }) {
  if (!rental) return null;
  return <Modal show onHide={onHide} centered size="lg" contentClassName="bg-dark text-white border-secondary"><Modal.Header closeButton closeVariant="white"><Modal.Title>Rental {rental.id}</Modal.Title></Modal.Header><Modal.Body><p className="text-secondary mb-4">{user?.name || rental.userId} · {formatDate(rental.rentalDate)}</p><Table responsive variant="dark"><thead><tr><th>Movie</th><th>Days</th><th>Rate</th><th>Penalty</th><th>Amount</th></tr></thead><tbody>{(rental.items || []).map((item) => <tr key={item.movieId}><td>{item.movieTitle}</td><td>{item.rentalDays}</td><td>₹{item.dailyRate}</td><td>₹{item.penalty || 0}</td><td>₹{Number(item.lineTotal || 0) + Number(item.penalty || 0)}</td></tr>)}</tbody></Table><div className="text-end fw-bold">Transaction total: ₹{rental.totalCost}</div><Badge bg={rental.status === "returned" ? "secondary" : rental.status === "overdue" ? "danger" : "success"} className="mt-3">{rental.status}</Badge></Modal.Body></Modal>;
}

export default RentalDetailsModal;

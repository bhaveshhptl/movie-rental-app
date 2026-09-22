import { Modal, Table } from "react-bootstrap";
import { formatDate } from "./helpers";

function UserRentalHistoryModal({ user, rentals, onHide, onSelectRental }) {
  if (!user) return null;
  const history = rentals.filter((rental) => String(rental.userId) === String(user.id));
  return <Modal show onHide={onHide} centered size="lg" contentClassName="bg-dark text-white border-secondary"><Modal.Header closeButton closeVariant="white"><Modal.Title>{user.name}'s Rental History</Modal.Title></Modal.Header><Modal.Body>{history.length === 0 ? <p className="text-secondary mb-0">No rental history found.</p> : <Table responsive variant="dark" hover><thead><tr><th>Rental</th><th>Date</th><th>Movies</th></tr></thead><tbody>{history.map((rental) => <tr key={rental.id} role="button" style={{ cursor: "pointer" }} onClick={() => onSelectRental(rental)}><td className="fw-semibold">{rental.id}</td><td>{formatDate(rental.rentalDate)}</td><td>{(rental.items || []).length}</td></tr>)}</tbody></Table>}</Modal.Body></Modal>;
}

export default UserRentalHistoryModal;

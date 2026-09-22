import { Button, Card, Spinner, Table } from "react-bootstrap";
import { formatDate } from "./helpers";

function AdminRentalsTable({ rentals, users, rentalsLoading, actionLoading, onReturn, onViewRental }) {
  const userNames = new Map(users.map((user) => [String(user.id), user.name]));
  return <Card className="bg-dark text-white border-secondary mb-4"><Card.Header className="border-secondary"><h3 className="mb-1">Rental History</h3><p className="text-secondary mb-0">Transactions across all users. Select one to view its movies.</p></Card.Header><Card.Body className="p-0">
    {rentalsLoading ? <div className="text-center py-5"><Spinner animation="border" /></div> : rentals.length === 0 ? <div className="text-center py-5 text-secondary">No rental history found.</div> : <Table responsive hover variant="dark" className="mb-0"><thead><tr><th>Rental ID</th><th>User</th><th>Rental Date</th><th>Action</th></tr></thead><tbody>{rentals.map((rental) => <tr key={rental.id}><td><Button variant="link" className="p-0 text-light fw-bold" onClick={() => onViewRental(rental)}>{rental.id}</Button></td><td>{userNames.get(String(rental.userId)) || rental.userId}</td><td>{formatDate(rental.rentalDate)}</td><td>{rental.status === "returned" ? <span className="text-success">✓ Returned</span> : <Button size="sm" variant="success" disabled={actionLoading} onClick={() => onReturn(rental.id)}>{actionLoading ? <Spinner size="sm" animation="border" /> : "Mark Returned"}</Button>}</td></tr>)}</tbody></Table>}
  </Card.Body></Card>;
}

export default AdminRentalsTable;

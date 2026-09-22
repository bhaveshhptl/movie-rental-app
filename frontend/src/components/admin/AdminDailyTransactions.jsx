import { Badge, Card, Col, Form, Row, Spinner, Table } from "react-bootstrap";
import { formatDate } from "./helpers";

function AdminDailyTransactions({
  transactions,
  transactionsLoading,
  selectedDate,
  onDateChange,
}) {
  return (
    <Card className="bg-dark text-white border-secondary mb-4">
      <Card.Header className="border-secondary">
        <Row className="align-items-center g-3">
          <Col>
            <h4 className="mb-0">Daily Transactions</h4>
            <small className="text-secondary">
              View rentals created on a specific date.
            </small>
          </Col>
          <Col xs="auto">
            <Form.Control
              type="date"
              value={selectedDate}
              onChange={onDateChange}
            />
          </Col>
          {transactionsLoading && (
            <Col xs="auto">
              <Spinner animation="border" size="sm" variant="danger" />
            </Col>
          )}
        </Row>
      </Card.Header>

      <Card.Body className="p-0">
        {transactions.length === 0 ? (
          <div className="text-center text-secondary py-5">
            No transactions for {selectedDate}.
          </div>
        ) : (
          <div className="table-responsive">
            <Table responsive variant="dark" hover className="mb-0 align-middle">
              <thead>
                <tr>
                  <th>Rental ID</th>
                  <th>User</th>
                  <th>Date</th>
                  <th>Total</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction) => (
                  <tr key={transaction.id}>
                    <td>{transaction.id}</td>
                    <td>{transaction.userId}</td>
                    <td>{formatDate(transaction.rentalDate)}</td>
                    <td className="fw-bold">₹{transaction.totalCost}</td>
                    <td>
                      <Badge
                        bg={
                          transaction.status === "returned"
                            ? "success"
                            : "primary"
                        }
                      >
                        {transaction.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        )}
      </Card.Body>
    </Card>
  );
}

export default AdminDailyTransactions;
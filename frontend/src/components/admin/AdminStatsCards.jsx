import { Card, Col, Row } from "react-bootstrap";

function AdminStatsCards({ users, adminCount, overdueRentals, transactions }) {
  const stats = [
    { label: "Total Users", value: users.length },
    { label: "Admins", value: adminCount },
    { label: "Overdue Rentals", value: overdueRentals.length, danger: true },
    { label: "Transactions", value: transactions.length },
  ];

  return (
    <Row className="g-3 mb-4" data-testid="admin-stats-cards">
      {stats.map((stat) => (
        <Col md={6} xl={3} key={stat.label}>
          <Card className="bg-dark text-white border-secondary h-100">
            <Card.Body>
              <div className="text-secondary">{stat.label}</div>
              <div
                className={`display-6 fw-bold mt-2 ${
                  stat.danger ? "text-danger" : ""
                }`}
              >
                {stat.value}
              </div>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  );
}

export default AdminStatsCards;
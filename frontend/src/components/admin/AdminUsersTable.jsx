import { Badge, Button, Card, Spinner, Table } from "react-bootstrap";
import { formatDate } from "./helpers";

function AdminUsersTable({
  users,
  usersLoading,
  currentUser,
  actionLoading,
  onPromote,
  onDemote,
  onViewHistory,
}) {
  const isSuperAdmin = currentUser?.role === "super_admin";

  return (
    <Card className="bg-dark text-white border-secondary mb-4">
      <Card.Header className="border-secondary">
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <h4 className="mb-0">User Management</h4>
            <small className="text-secondary">
              Manage application users and administrators.
            </small>
          </div>
          {usersLoading && (
            <Spinner animation="border" size="sm" variant="danger" />
          )}
        </div>
      </Card.Header>

      <Card.Body className="p-0">
        <div className="table-responsive">
          <Table responsive variant="dark" hover className="mb-0 align-middle">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Created</th>
                {isSuperAdmin && <th className="text-end">Action</th>}
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr
                  key={user.id}
                  onClick={() => onViewHistory(user)}
                  style={{ cursor: "pointer" }}
                  title="View this user's rental history"
                >
                  <td className="fw-semibold">{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    <Badge
                      bg={
                        user.role === "super_admin"
                          ? "danger"
                          : user.role === "admin"
                          ? "warning"
                          : "secondary"
                      }
                      text={user.role === "admin" ? "dark" : undefined}
                    >
                      {user.role}
                    </Badge>
                  </td>
                  <td>{formatDate(user.createdAt)}</td>
                  {isSuperAdmin && (
                    <td className="text-end">
                      {user.role === "user" && (
                        <Button
                          size="sm"
                          variant="outline-warning"
                          disabled={actionLoading}
                          onClick={(event) => { event.stopPropagation(); onPromote(user.id); }}
                        >
                          Make Admin
                        </Button>
                      )}
                      {user.role === "admin" && (
                        <Button
                          size="sm"
                          variant="outline-danger"
                          disabled={actionLoading}
                          onClick={(event) => { event.stopPropagation(); onDemote(user.id); }}
                        >
                          Remove Admin
                        </Button>
                      )}
                      {user.role === "super_admin" && (
                        <span className="text-secondary">Protected</span>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </Card.Body>
    </Card>
  );
}

export default AdminUsersTable;

import { render, screen, fireEvent } from "@testing-library/react";
import AdminUsersTable from "../../../components/admin/AdminUsersTable";
import { makeUser, superAdmin } from "../../helpers/fixtures";

describe("AdminUsersTable", () => {
  const baseProps = {
    users: [makeUser()],
    usersLoading: false,
    currentUser: superAdmin,
    actionLoading: false,
    onPromote: jest.fn(),
    onDemote: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the table header", () => {
    render(<AdminUsersTable {...baseProps} />);
    expect(screen.getByText("User Management")).toBeInTheDocument();
    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("Email")).toBeInTheDocument();
    expect(screen.getByText("Role")).toBeInTheDocument();
    expect(screen.getByText("Created")).toBeInTheDocument();
  });

  it("renders user rows", () => {
    render(<AdminUsersTable {...baseProps} />);
    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.getByText("alice@example.com")).toBeInTheDocument();
    expect(screen.getByText("user")).toBeInTheDocument();
  });

  it("shows a spinner when usersLoading is true", () => {
    const { container } = render(
      <AdminUsersTable {...baseProps} usersLoading />
    );
    expect(container.querySelector(".spinner-border")).toBeInTheDocument();
  });

  it("shows 'Make Admin' button for regular users when current user is super_admin", () => {
    render(<AdminUsersTable {...baseProps} />);
    const btn = screen.getByRole("button", { name: /make admin/i });
    fireEvent.click(btn);
    expect(baseProps.onPromote).toHaveBeenCalledWith(1);
  });

  it("shows 'Remove Admin' button for admins when current user is super_admin", () => {
    const admin = makeUser({ id: 5, role: "admin" });
    render(
      <AdminUsersTable
        {...baseProps}
        users={[admin]}
      />
    );
    const btn = screen.getByRole("button", { name: /remove admin/i });
    fireEvent.click(btn);
    expect(baseProps.onDemote).toHaveBeenCalledWith(5);
  });

  it("shows 'Protected' text for super_admin users", () => {
    const another = makeUser({ id: 7, role: "super_admin" });
    render(<AdminUsersTable {...baseProps} users={[another]} />);
    expect(screen.getByText("Protected")).toBeInTheDocument();
  });

  it("hides the Action column when current user is not super_admin", () => {
    render(
      <AdminUsersTable
        {...baseProps}
        currentUser={makeUser({ role: "admin" })}
      />
    );
    expect(screen.queryByText("Action")).not.toBeInTheDocument();
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("disables action buttons when actionLoading is true", () => {
    render(<AdminUsersTable {...baseProps} actionLoading />);
    expect(screen.getByRole("button", { name: /make admin/i })).toBeDisabled();
  });

  it("handles missing currentUser gracefully", () => {
    render(<AdminUsersTable {...baseProps} currentUser={null} />);
    expect(screen.queryByText("Action")).not.toBeInTheDocument();
  });
});
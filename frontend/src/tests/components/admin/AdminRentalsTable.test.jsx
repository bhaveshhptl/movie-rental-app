import { render, screen, fireEvent } from "@testing-library/react";
import AdminRentalsTable from "../../../components/admin/AdminRentalsTable";
import { makeRental } from "../../helpers/fixtures";

describe("AdminRentalsTable", () => {
  const baseProps = {
    rentals: [makeRental()],
    rentalsLoading: false,
    actionLoading: false,
    onReturn: jest.fn(),
  };

  beforeEach(() => jest.clearAllMocks());

  it("renders the header and description", () => {
    render(<AdminRentalsTable {...baseProps} />);
    expect(screen.getByText("Rental History")).toBeInTheDocument();
    expect(
      screen.getByText(/view all rentals and manage their status/i)
    ).toBeInTheDocument();
  });

  it("shows loading state", () => {
    render(<AdminRentalsTable {...baseProps} rentalsLoading />);
    expect(screen.getByText(/loading rental history/i)).toBeInTheDocument();
  });

  it("shows empty state when no rentals", () => {
    render(<AdminRentalsTable {...baseProps} rentals={[]} />);
    expect(screen.getByText(/no rental history found/i)).toBeInTheDocument();
  });

  it("renders a rental row with formatted dates and total", () => {
    render(<AdminRentalsTable {...baseProps} />);
    expect(screen.getByText("101")).toBeInTheDocument();
    expect(screen.getByText("₹500")).toBeInTheDocument();
    expect(screen.getByText("active")).toBeInTheDocument();
  });

  it("renders 'Mark Returned' button for non-returned rentals and calls onReturn", () => {
    render(<AdminRentalsTable {...baseProps} />);
    const btn = screen.getByRole("button", { name: /mark returned/i });
    fireEvent.click(btn);
    expect(baseProps.onReturn).toHaveBeenCalledWith(101);
  });

  it("shows returned indicator for returned rentals", () => {
    render(
      <AdminRentalsTable
        {...baseProps}
        rentals={[
          makeRental({
            status: "returned",
            returnedDate: "2024-02-15T00:00:00.000Z",
          }),
        ]}
      />
    );
    expect(screen.getByText(/✓ returned/i)).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /mark returned/i })
    ).not.toBeInTheDocument();
  });

  it("renders overdue badge in danger variant", () => {
    const { container } = render(
      <AdminRentalsTable
        {...baseProps}
        rentals={[makeRental({ status: "overdue" })]}
      />
    );
    expect(container.querySelector(".badge.bg-danger")).toBeInTheDocument();
  });

  it("disables the return button when actionLoading is true", () => {
    render(<AdminRentalsTable {...baseProps} actionLoading />);
    expect(screen.getByRole("button")).toBeDisabled();
  });
});
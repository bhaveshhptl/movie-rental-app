import { render, screen } from "@testing-library/react";
import AdminStatsCards from "../../../components/admin/AdminStatsCards";
import { makeUser, makeRental, makeTransaction } from "../../helpers/fixtures";

describe("AdminStatsCards", () => {
  const defaultProps = {
    users: [makeUser(), makeUser({ id: 2 })],
    adminCount: 1,
    overdueRentals: [makeRental({ status: "overdue" })],
    transactions: [makeTransaction()],
  };

  it("renders all four stat cards", () => {
    render(<AdminStatsCards {...defaultProps} />);

    expect(screen.getByText("Total Users")).toBeInTheDocument();
    expect(screen.getByText("Admins")).toBeInTheDocument();
    expect(screen.getByText("Overdue Rentals")).toBeInTheDocument();
    expect(screen.getByText("Transactions")).toBeInTheDocument();
  });


  it("renders zero values when arrays are empty", () => {
    render(
      <AdminStatsCards
        users={[]}
        adminCount={0}
        overdueRentals={[]}
        transactions={[]}
      />
    );

    // 3 cards show 0 (total users, overdue, transactions) + admins 0
    expect(screen.getAllByText("0")).toHaveLength(4);
  });

  it("applies text-danger class to the overdue value", () => {
    render(<AdminStatsCards {...defaultProps} />);
    const overdueValue = screen
      .getByText("Overdue Rentals")
      .parentElement.querySelector(".display-6");
    expect(overdueValue).toHaveClass("text-danger");
  });
});
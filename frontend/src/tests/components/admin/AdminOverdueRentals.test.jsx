import { render, screen, fireEvent } from "@testing-library/react";
import AdminOverdueRentals from "../../../components/admin/AdminOverdueRentals";
import { makeRental } from "../../helpers/fixtures";

describe("AdminOverdueRentals", () => {
  const baseProps = {
    overdueRentals: [makeRental({ id: 55, status: "overdue", penalty: 100 })],
    overdueLoading: false,
    actionLoading: false,
    penaltyAmounts: {},
    onPenaltyChange: jest.fn(),
    onApplyPenalty: jest.fn(),
    onReturn: jest.fn(),
  };

  beforeEach(() => jest.clearAllMocks());

  it("renders header", () => {
    render(<AdminOverdueRentals {...baseProps} />);
    expect(screen.getByText("Overdue Rentals")).toBeInTheDocument();
  });

  it("shows empty state", () => {
    render(<AdminOverdueRentals {...baseProps} overdueRentals={[]} />);
    expect(screen.getByText(/no overdue rentals/i)).toBeInTheDocument();
  });

  it("shows spinner when overdueLoading", () => {
    const { container } = render(
      <AdminOverdueRentals {...baseProps} overdueLoading />
    );
    expect(container.querySelector(".spinner-border")).toBeInTheDocument();
  });

  it("renders row with current penalty value", () => {
    render(<AdminOverdueRentals {...baseProps} />);
    expect(screen.getByText("₹100")).toBeInTheDocument();
  });

  it("calls onPenaltyChange when input changes", () => {
    render(<AdminOverdueRentals {...baseProps} />);
    const input = screen.getByPlaceholderText("₹");
    fireEvent.change(input, { target: { value: "250" } });
    expect(baseProps.onPenaltyChange).toHaveBeenCalledWith(55, "250");
  });

  it("disables 'Apply Penalty' when no amount entered", () => {
    render(<AdminOverdueRentals {...baseProps} />);
    expect(
      screen.getByRole("button", { name: /apply penalty/i })
    ).toBeDisabled();
  });

  it("enables and fires 'Apply Penalty' when amount present", () => {
    render(
      <AdminOverdueRentals {...baseProps} penaltyAmounts={{ 55: "200" }} />
    );
    const btn = screen.getByRole("button", { name: /apply penalty/i });
    expect(btn).toBeEnabled();
    fireEvent.click(btn);
    expect(baseProps.onApplyPenalty).toHaveBeenCalledWith(55);
  });

  it("calls onReturn when 'Mark Returned' clicked", () => {
    render(<AdminOverdueRentals {...baseProps} />);
    fireEvent.click(screen.getByRole("button", { name: /mark returned/i }));
    expect(baseProps.onReturn).toHaveBeenCalledWith(55);
  });

  it("disables both buttons when actionLoading", () => {
    render(
      <AdminOverdueRentals
        {...baseProps}
        penaltyAmounts={{ 55: "200" }}
        actionLoading
      />
    );
    expect(screen.getByRole("button", { name: /apply penalty/i })).toBeDisabled();
    expect(screen.getByRole("button", { name: /mark returned/i })).toBeDisabled();
  });
});
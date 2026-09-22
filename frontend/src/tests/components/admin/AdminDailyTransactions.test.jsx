import { render, screen, fireEvent } from "@testing-library/react";
import AdminDailyTransactions from "../../../components/admin/AdminDailyTransactions";
import { makeTransaction } from "../../helpers/fixtures";

describe("AdminDailyTransactions", () => {
  const baseProps = {
    transactions: [makeTransaction()],
    transactionsLoading: false,
    selectedDate: "2024-02-01",
    onDateChange: jest.fn(),
  };

  beforeEach(() => jest.clearAllMocks());

  it("renders header and date input with selectedDate", () => {
    render(<AdminDailyTransactions {...baseProps} />);
    expect(screen.getByText("Daily Transactions")).toBeInTheDocument();
    expect(screen.getByDisplayValue("2024-02-01")).toBeInTheDocument();
  });

  it("shows spinner while loading", () => {
    const { container } = render(
      <AdminDailyTransactions {...baseProps} transactionsLoading />
    );
    expect(container.querySelector(".spinner-border")).toBeInTheDocument();
  });

  it("shows empty state with selected date", () => {
    render(
      <AdminDailyTransactions {...baseProps} transactions={[]} />
    );
    expect(
      screen.getByText(/no transactions for 2024-02-01/i)
    ).toBeInTheDocument();
  });

  it("renders transaction rows", () => {
    render(<AdminDailyTransactions {...baseProps} />);
    expect(screen.getByText("201")).toBeInTheDocument();
    expect(screen.getByText("₹750")).toBeInTheDocument();
    expect(screen.getByText("active")).toBeInTheDocument();
  });

  it("uses success badge for returned transactions", () => {
    const { container } = render(
      <AdminDailyTransactions
        {...baseProps}
        transactions={[makeTransaction({ status: "returned" })]}
      />
    );
    expect(container.querySelector(".badge.bg-success")).toBeInTheDocument();
  });

  it("calls onDateChange when the date input changes", () => {
    render(<AdminDailyTransactions {...baseProps} />);
    const input = screen.getByDisplayValue("2024-02-01");
    fireEvent.change(input, { target: { value: "2024-03-15" } });
    expect(baseProps.onDateChange).toHaveBeenCalled();
  });
});
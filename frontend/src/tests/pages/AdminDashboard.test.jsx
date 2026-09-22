import {
  render,
  screen,
  fireEvent,
  waitFor,
  within,
} from "@testing-library/react";
import { useDispatch, useSelector } from "react-redux";
import AdminDashboard from "../../pages/AdminDashboard";
import {
  fetchAdminUsers,
  fetchOverdueRentals,
  fetchDailyTransactions,
  fetchAllRentals,
  applyPenalty,
  promoteUser,
  demoteAdmin,
  returnRental,
  clearAdminError,
  clearAdminActionError,
} from "../../features/admin/adminSlice";
import {
  makeUser,
  makeRental,
  makeTransaction,
  superAdmin,
} from "../helpers/fixtures";

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

jest.mock("../../components/AppNavbar", () => () => (
  <nav data-testid="app-navbar" />
));

jest.mock("react-redux", () => ({
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));

jest.mock("../../features/admin/adminSlice", () => {
  const actual = jest.requireActual("../../features/admin/adminSlice");
  return {
    ...actual,
    fetchAdminUsers: jest.fn(() => ({ type: "fetchAdminUsers" })),
    fetchOverdueRentals: jest.fn(() => ({ type: "fetchOverdueRentals" })),
    fetchDailyTransactions: jest.fn((d) => ({
      type: "fetchDailyTransactions",
      payload: d,
    })),
    fetchAllRentals: jest.fn(() => ({ type: "fetchAllRentals" })),
    applyPenalty: Object.assign(
      jest.fn((p) => ({ type: "applyPenalty", payload: p })),
      { fulfilled: { match: jest.fn(() => true) } }
    ),
    promoteUser: jest.fn((id) => ({ type: "promoteUser", payload: id })),
    demoteAdmin: jest.fn((id) => ({ type: "demoteAdmin", payload: id })),
    returnRental: jest.fn((id) => ({ type: "returnRental", payload: id })),
    clearAdminError: jest.fn(() => ({ type: "clearAdminError" })),
    clearAdminActionError: jest.fn(() => ({
      type: "clearAdminActionError",
    })),
  };
});

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const buildAdminState = (overrides = {}) => ({
  users: [makeUser()],
  overdueRentals: [makeRental({ id: 55, status: "overdue" })],
  transactions: [makeTransaction()],
  rentals: [makeRental()],
  rentalsLoading: false,
  usersLoading: false,
  overdueLoading: false,
  transactionsLoading: false,
  actionLoading: false,
  error: null,
  actionError: null,
  ...overrides,
});

/**
 * Configure useSelector to return a fake root state, applying the given
 * overrides on top of the admin slice defaults.
 *
 * Declared as a function declaration so it hoists above beforeEach.
 */
function mockSelectors(adminOverrides = {}) {
  useSelector.mockImplementation((selector) =>
    selector({
      auth: { user: superAdmin },
      admin: buildAdminState(adminOverrides),
    })
  );
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("AdminDashboard (page)", () => {
  let dispatchMock;

  beforeEach(() => {
    jest.clearAllMocks();

    dispatchMock = jest.fn((action) => {
      if (action && action.type === "returnRental") {
        return { unwrap: () => Promise.resolve(action) };
      }
      return action;
    });

    useDispatch.mockReturnValue(dispatchMock);
    mockSelectors();
  });

  it("renders the page header", () => {
    render(<AdminDashboard />);
    expect(screen.getByText("Admin Dashboard")).toBeInTheDocument();
    expect(
      screen.getByText(/manage users, rentals and daily transactions/i)
    ).toBeInTheDocument();
  });

  it("renders the navbar", () => {
    render(<AdminDashboard />);
    expect(screen.getByTestId("app-navbar")).toBeInTheDocument();
  });

  it("dispatches all initial fetch actions on mount", () => {
    render(<AdminDashboard />);
    expect(fetchAdminUsers).toHaveBeenCalledTimes(1);
    expect(fetchOverdueRentals).toHaveBeenCalledTimes(1);
    expect(fetchAllRentals).toHaveBeenCalledTimes(1);
    expect(fetchDailyTransactions).toHaveBeenCalledTimes(1);
    expect(dispatchMock).toHaveBeenCalled();
  });

  it("shows the global error Alert", () => {
    mockSelectors({ error: "Boom" });
    render(<AdminDashboard />);
    expect(screen.getByText("Boom")).toBeInTheDocument();
  });

  it("shows the action error Alert", () => {
    mockSelectors({ actionError: "Nope" });
    render(<AdminDashboard />);
    expect(screen.getByText("Nope")).toBeInTheDocument();
  });

  it("confirms before promoting a user", async () => {
    const confirmSpy = jest.spyOn(window, "confirm").mockReturnValue(true);
    render(<AdminDashboard />);
    fireEvent.click(screen.getByRole("button", { name: /make admin/i }));
    await waitFor(() => expect(promoteUser).toHaveBeenCalledWith(1));
    confirmSpy.mockRestore();
  });

  it("does not promote when user cancels the confirm dialog", () => {
    const confirmSpy = jest.spyOn(window, "confirm").mockReturnValue(false);
    render(<AdminDashboard />);
    fireEvent.click(screen.getByRole("button", { name: /make admin/i }));
    expect(promoteUser).not.toHaveBeenCalled();
    confirmSpy.mockRestore();
  });

  it("confirms before demoting an admin", async () => {
    mockSelectors({ users: [makeUser({ id: 5, role: "admin" })] });
    const confirmSpy = jest.spyOn(window, "confirm").mockReturnValue(true);
    render(<AdminDashboard />);
    fireEvent.click(screen.getByRole("button", { name: /remove admin/i }));
    await waitFor(() => expect(demoteAdmin).toHaveBeenCalledWith(5));
    confirmSpy.mockRestore();
  });

  it("applies a penalty with the entered amount", async () => {
    render(<AdminDashboard />);
    fireEvent.change(screen.getByPlaceholderText("₹"), {
      target: { value: "300" },
    });
    fireEvent.click(screen.getByRole("button", { name: /apply penalty/i }));
    await waitFor(() =>
      expect(applyPenalty).toHaveBeenCalledWith({
        rentalId: 55,
        penaltyAmount: 300,
      })
    );
  });

  it("does not apply penalty for invalid amount", () => {
    render(<AdminDashboard />);
    fireEvent.change(screen.getByPlaceholderText("₹"), {
      target: { value: "0" },
    });
    fireEvent.click(screen.getByRole("button", { name: /apply penalty/i }));
    expect(applyPenalty).not.toHaveBeenCalled();
  });

  it("confirms before marking a rental returned and dispatches returnRental", async () => {
    const confirmSpy = jest.spyOn(window, "confirm").mockReturnValue(true);
    render(<AdminDashboard />);
    fireEvent.click(
      screen.getAllByRole("button", { name: /mark returned/i })[0]
    );
    await waitFor(() => expect(returnRental).toHaveBeenCalled());
    confirmSpy.mockRestore();
  });

  it("re-fetches transactions when the date input changes", () => {
    render(<AdminDashboard />);
    fireEvent.change(screen.getByDisplayValue(/\d{4}-\d{2}-\d{2}/), {
      target: { value: "2024-03-15" },
    });
    expect(fetchDailyTransactions).toHaveBeenCalledWith("2024-03-15");
  });

  it("renders stat cards with the correct labels", () => {
    render(<AdminDashboard />);

    const stats = within(screen.getByTestId("admin-stats-cards"));

    expect(stats.getByText("Total Users")).toBeInTheDocument();
    expect(stats.getByText("Admins")).toBeInTheDocument();
    expect(stats.getByText("Overdue Rentals")).toBeInTheDocument();
    expect(stats.getByText("Transactions")).toBeInTheDocument();
  });
});
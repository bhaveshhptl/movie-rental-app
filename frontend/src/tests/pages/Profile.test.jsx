import {
    render,
    screen,
    within,
} from "@testing-library/react";

import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";

import { MemoryRouter } from "react-router-dom";

import Profile from "../../pages/Profile";
import { fetchRentalHistory } from "../../features/rental/rentalSlice";

jest.mock("../../features/rental/rentalSlice.js", () => ({
    fetchRentalHistory: jest.fn(),
}));

// AppNavbar has its own auth/router concerns → isolate Profile tests
jest.mock("../../components/AppNavbar", () => () => (
    <nav data-testid="app-navbar">Navbar</nav>
));

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

const makeItem = ({
    movieId = "m1",
    movieTitle = "Inception",
    dailyRate = 100,
    rentalDays = 2,
    dueDate = "2026-12-31",
    lineTotal = 200,
} = {}) => ({
    movieId,
    movieTitle,
    dailyRate,
    rentalDays,
    dueDate,
    lineTotal,
});

const makeRental = ({
    id = 1,
    rentalDate = "2026-01-15",
    status = "active",
    totalCost = 200,
    items = [makeItem()],
} = {}) => ({
    id,
    rentalDate,
    status,
    totalCost,
    items,
});

// future due date → not overdue; past due date → overdue
const futureDate = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30)
    .toISOString()
    .slice(0, 10);

const pastDate = new Date(Date.now() - 1000 * 60 * 60 * 24 * 5)
    .toISOString()
    .slice(0, 10);

const baseUser = {
    name: "Bhavesh Patil",
    email: "bhavesh@example.com",
    role: "user",
};

const activeRental = makeRental({
    id: 1,
    status: "active",
    totalCost: 200,
    items: [makeItem({ dueDate: futureDate })],
});

const returnedRental = makeRental({
    id: 2,
    status: "returned",
    totalCost: 450,
    items: [
        makeItem({
            movieId: "m2",
            movieTitle: "Interstellar",
            rentalDays: 3,
            dueDate: pastDate,
            lineTotal: 450,
        }),
    ],
});

describe("Profile", () => {
    const createStore = ({
        user = baseUser,
        rentals = [activeRental],
        historyLoading = false,
        historyError = null,
    } = {}) =>
        configureStore({
            reducer: {
                auth: (state = { user }) => state,
                rental: (
                    state = { rentals, historyLoading, historyError }
                ) => state,
            },
            middleware: (getDefaultMiddleware) =>
                getDefaultMiddleware({
                    // Mock return value is a plain object; skip the
                    // serializable check to avoid console noise (see Cart.test.jsx).
                    serializableCheck: false,
                }),
        });

    const renderProfile = (opts = {}) =>
        render(
            <Provider store={createStore(opts)}>
                <MemoryRouter initialEntries={["/profile"]}>
                    <Profile />
                </MemoryRouter>
            </Provider>
        );

    beforeEach(() => {
        jest.clearAllMocks();
        fetchRentalHistory.mockReturnValue({
            type: "rental/fetchRentalHistory",
        });
    });

    // -----------------------------------------------------------------------
    // Page-level: header + user details
    // -----------------------------------------------------------------------

    describe("page rendering", () => {
        test("dispatches fetchRentalHistory on mount", () => {
            renderProfile();

            expect(fetchRentalHistory).toHaveBeenCalledTimes(1);
        });

        test("renders the My Profile heading", () => {
            renderProfile();

            expect(
                screen.getByRole("heading", { name: "My Profile" })
            ).toBeInTheDocument();
        });

        test("renders Personal Details card with user name/email/role", () => {
            renderProfile();

            expect(
                screen.getByRole("heading", { name: "Personal Details" })
            ).toBeInTheDocument();

            expect(screen.getByText("Bhavesh Patil")).toBeInTheDocument();
            expect(screen.getByText("bhavesh@example.com")).toBeInTheDocument();
            expect(screen.getByText("user")).toBeInTheDocument();
        });

        test("falls back to N/A when user fields are missing", () => {
            renderProfile({ user: {} });

            // Name + Email both fall back to "N/A" → 2 matches
            expect(screen.getAllByText("N/A")).toHaveLength(2);

            // Role defaults to "user"
            expect(screen.getByText("user")).toBeInTheDocument();
        });

        test("renders Rental History heading and subtitle", () => {
            renderProfile();

            expect(
                screen.getByRole("heading", { name: "Rental History" })
            ).toBeInTheDocument();

            expect(
                screen.getByText("Your previous and active rentals")
            ).toBeInTheDocument();
        });
    });

    // -----------------------------------------------------------------------
    // Page-level: rentals-count badge
    // -----------------------------------------------------------------------

    describe("rentals count badge", () => {
        test("uses singular 'rental' when there is exactly 1", () => {
            renderProfile({ rentals: [activeRental] });

            expect(screen.getByText("1 rental")).toBeInTheDocument();
        });

        test("uses plural 'rentals' when there is more than 1", () => {
            renderProfile({
                rentals: [activeRental, returnedRental],
            });

            expect(screen.getByText("2 rentals")).toBeInTheDocument();
        });

        test("uses plural 'rentals' when there are 0 (matches component logic)", () => {
            // component uses `rentals.length !== 1 ? "s" : ""`
            // so 0 → "0 rentals"
            renderProfile({ rentals: [] });

            expect(screen.getByText("0 rentals")).toBeInTheDocument();
        });
    });

    // -----------------------------------------------------------------------
    // States: loading / error / empty
    // -----------------------------------------------------------------------

    describe("states", () => {
        test("shows spinner while historyLoading is true", () => {
            const { container } = renderProfile({
                historyLoading: true,
            });

            expect(
                container.querySelector(".spinner-border")
            ).toBeInTheDocument();

            expect(
                screen.queryByText("No rental history")
            ).not.toBeInTheDocument();
        });

        test("shows 'No rental history' empty state when rentals is empty", () => {
            renderProfile({ rentals: [] });

            expect(
                screen.getByRole("heading", { name: "No rental history" })
            ).toBeInTheDocument();

            expect(
                screen.getByText("Your rented movies will appear here.")
            ).toBeInTheDocument();
        });

        test("shows history error alert", () => {
            renderProfile({
                historyError: "Failed to load rentals",
            });

            expect(
                screen.getByText("Failed to load rentals")
            ).toBeInTheDocument();
        });

        test("error alert still renders alongside rentals", () => {
            renderProfile({
                historyError: "Partial data",
                rentals: [activeRental],
            });

            expect(
                screen.getByText("Partial data")
            ).toBeInTheDocument();

            expect(
                screen.getByRole("heading", { name: "Rental #1" })
            ).toBeInTheDocument();
        });
    });

    // -----------------------------------------------------------------------
    // Component-level: rental card contents
    // -----------------------------------------------------------------------

    describe("rental cards", () => {
        test("renders rental id, date and status badge", () => {
            renderProfile({ rentals: [activeRental] });

            expect(
                screen.getByRole("heading", { name: "Rental #1" })
            ).toBeInTheDocument();

            // formatDate → "15 Jan 2026" (en-IN, 2-digit day, short month)
            expect(
                screen.getByText(/Rented on 15 Jan 2026/)
            ).toBeInTheDocument();

            expect(screen.getByText("active")).toBeInTheDocument();
        });

        test("renders item title, daily rate, duration and line total", () => {
            renderProfile({ rentals: [activeRental] });

            expect(screen.getByText("Inception")).toBeInTheDocument();
            expect(screen.getByText("₹100 / day")).toBeInTheDocument();
            expect(screen.getByText("2 days")).toBeInTheDocument();
            expect(screen.getByText("₹200")).toBeInTheDocument();
        });

        test("uses singular 'day' when rentalDays is 1", () => {
            renderProfile({
                rentals: [
                    makeRental({
                        items: [makeItem({ rentalDays: 1 })],
                    }),
                ],
            });

            expect(screen.getByText("1 day")).toBeInTheDocument();
        });

        test("renders Total footer per rental", () => {
            renderProfile({
                rentals: [
                    makeRental({ id: 1, totalCost: 200 }),
                    makeRental({
                        id: 2,
                        totalCost: 450,
                        items: [makeItem({ movieId: "m2" })],
                    }),
                ],
            });

            expect(screen.getByText("Total: ₹200")).toBeInTheDocument();
            expect(screen.getByText("Total: ₹450")).toBeInTheDocument();
        });
    });

    // -----------------------------------------------------------------------
    // Component-level: overdue logic
    // -----------------------------------------------------------------------

    describe("overdue logic", () => {
        test("marks item as Overdue when dueDate is in the past and status is active", () => {
            renderProfile({
                rentals: [
                    makeRental({
                        status: "active",
                        items: [makeItem({ dueDate: pastDate })],
                    }),
                ],
            });

            expect(screen.getByText("Overdue")).toBeInTheDocument();

            // container class hook used by component
            const { container } = { container: document.body };
            expect(
                container.querySelector(".overdue-rental")
            ).toBeInTheDocument();
        });

        test("marks item as Active when dueDate is in the future and status is active", () => {
            renderProfile({
                rentals: [
                    makeRental({
                        status: "active",
                        items: [makeItem({ dueDate: futureDate })],
                    }),
                ],
            });

            expect(screen.getByText("Active")).toBeInTheDocument();
        });

        test("returned rental is never marked Overdue even with past dueDate", () => {
            renderProfile({
                rentals: [
                    makeRental({
                        status: "returned",
                        items: [makeItem({ dueDate: pastDate })],
                    }),
                ],
            });

            expect(screen.queryByText("Overdue")).not.toBeInTheDocument();
            expect(screen.getByText("Returned")).toBeInTheDocument();
        });

        test("completed rental is never marked Overdue even with past dueDate", () => {
            renderProfile({
                rentals: [
                    makeRental({
                        status: "completed",
                        items: [makeItem({ dueDate: pastDate })],
                    }),
                ],
            });

            expect(screen.queryByText("Overdue")).not.toBeInTheDocument();
            // Component's item badge only checks `status === "returned"`,
            // so completed items render as "Active".
            expect(screen.getByText("Active")).toBeInTheDocument();
        });
    });

    // -----------------------------------------------------------------------
    // Component-level: multiple rentals
    // -----------------------------------------------------------------------

    describe("multiple rentals", () => {
        test("renders a card for each rental", () => {
            renderProfile({
                rentals: [activeRental, returnedRental],
            });

            expect(
                screen.getByRole("heading", { name: "Rental #1" })
            ).toBeInTheDocument();

            expect(
                screen.getByRole("heading", { name: "Rental #2" })
            ).toBeInTheDocument();

            expect(screen.getByText("Inception")).toBeInTheDocument();
            expect(screen.getByText("Interstellar")).toBeInTheDocument();
        });

        test("each rental's items live inside that rental's card", () => {
            renderProfile({
                rentals: [activeRental, returnedRental],
            });

            const rental2Card = screen
                .getByRole("heading", { name: "Rental #2" })
                .closest(".card");

            // Interstellar should be inside Rental #2's card, not #1's
            expect(
                within(rental2Card).getByText("Interstellar")
            ).toBeInTheDocument();

            expect(
                within(rental2Card).queryByText("Inception")
            ).not.toBeInTheDocument();
        });
    });
});
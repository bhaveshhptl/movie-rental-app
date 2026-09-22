import {
    render,
    screen,
    fireEvent,
    waitFor,
    within,
} from "@testing-library/react";

import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";

import { MemoryRouter, useLocation } from "react-router-dom";

import Cart from "../../pages/Cart";
import { checkout } from "../../features/rental/rentalSlice";
import {
    changeRentalDays,
    deleteCartItem,
    emptyCart,
    fetchCart,
} from "../../features/cart/cartSlice";

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

jest.mock("../../features/cart/cartSlice.js", () => ({
    fetchCart: jest.fn(),
    changeRentalDays: jest.fn(),
    deleteCartItem: jest.fn(),
    emptyCart: jest.fn(),
}));

jest.mock("../../features/rental/rentalSlice.js", () => ({
    checkout: jest.fn(),
}));

// AppNavbar is a separate component; stub it so cart tests stay isolated.
jest.mock("../../components/AppNavbar", () => () => (
    <nav data-testid="app-navbar">Navbar</nav>
));

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const LocationDisplay = () => {
    const location = useLocation();
    return <div data-testid="location">{location.pathname}</div>;
};

const makeItem = ({
    movieId = "m1",
    title = "Inception",
    dailyRate = 100,
    rentalDays = 2,
    lineTotal = 200,
    posterUrl = "/poster1.jpg",
} = {}) => ({
    movieId,
    rentalDays,
    lineTotal,
    movie: { title, dailyRate, posterUrl },
});

const sampleItems = [
    makeItem({
        movieId: "m1",
        title: "Inception",
        dailyRate: 100,
        rentalDays: 2,
        lineTotal: 200,
    }),
    makeItem({
        movieId: "m2",
        title: "Interstellar",
        dailyRate: 150,
        rentalDays: 3,
        lineTotal: 450,
    }),
];

// ---------------------------------------------------------------------------
// Test suite
// ---------------------------------------------------------------------------

describe("Cart", () => {
    const createStore = ({
        items = sampleItems,
        totalCost = 650,
        loading = false,
        error = null,
        checkoutLoading = false,
        checkoutError = null,
    } = {}) =>
        configureStore({
            reducer: {
                cart: (state = { items, totalCost, loading, error }) => state,
                rental: (
                    state = {
                        loading: checkoutLoading,
                        error: checkoutError,
                    },
                ) => state,
            },
        });

    const renderCart = (opts = {}) =>
        render(
            <Provider store={createStore(opts)}>
                <MemoryRouter initialEntries={["/cart"]}>
                    <Cart />
                    <LocationDisplay />
                </MemoryRouter>
            </Provider>,
        );

    beforeEach(() => {
        jest.clearAllMocks();

        fetchCart.mockReturnValue({ type: "cart/fetchCart" });
        changeRentalDays.mockReturnValue({ type: "cart/changeRentalDays" });
        emptyCart.mockReturnValue({ type: "cart/emptyCart" });

        // Real deleteCartItem is a thunk → returns a function.
        // Mimic that so dispatch() routes it through redux-thunk and never
        // reaches the serializable-state-invariant middleware.
        deleteCartItem.mockImplementation((movieId) => async () => {
            return { type: "cart/deleteCartItem/done", movieId };
        });

        checkout.mockReturnValue({ type: "rental/checkout" });
    });

    // -----------------------------------------------------------------------
    // Page-level tests
    // -----------------------------------------------------------------------

    describe("page rendering", () => {
        test("renders the Your Cart heading and subtitle", () => {
            renderCart();

            expect(
                screen.getByRole("heading", { name: "Your Cart" }),
            ).toBeInTheDocument();

            expect(
                screen.getByText("Review your selected movies"),
            ).toBeInTheDocument();
        });

        test("dispatches fetchCart on mount", () => {
            renderCart();

            expect(fetchCart).toHaveBeenCalledTimes(1);
        });

        test("renders all cart items with their titles and rates", () => {
            renderCart();

            expect(screen.getByText("Inception")).toBeInTheDocument();
            expect(screen.getByText("Interstellar")).toBeInTheDocument();

            // dailyRate line renders as "₹100 / day" etc.
            expect(screen.getByText("₹100 / day")).toBeInTheDocument();
            expect(screen.getByText("₹150 / day")).toBeInTheDocument();
        });

        test("renders the Order Summary with movie count and total", () => {
            renderCart({ totalCost: 650 });

            expect(
                screen.getByRole("heading", { name: "Order Summary" }),
            ).toBeInTheDocument();

            expect(screen.getByText("Movies")).toBeInTheDocument();
            expect(screen.getByText("2")).toBeInTheDocument();

            expect(screen.getByText("Total")).toBeInTheDocument();
            expect(screen.getByText("₹650")).toBeInTheDocument();
        });

        test("renders the Proceed to Checkout button", () => {
            renderCart();

            expect(
                screen.getByRole("button", { name: "Proceed to Checkout" }),
            ).toBeInTheDocument();
        });

        test("renders the Clear Cart button when items exist", () => {
            renderCart();

            expect(
                screen.getByRole("button", { name: "Clear Cart" }),
            ).toBeInTheDocument();
        });

        test("does not render Clear Cart button when cart is empty", () => {
            renderCart({ items: [], totalCost: 0 });

            expect(
                screen.queryByRole("button", { name: "Clear Cart" }),
            ).not.toBeInTheDocument();
        });
    });

    // -----------------------------------------------------------------------
    // Component-level: rental days controls
    // -----------------------------------------------------------------------

    describe("rental days controls", () => {
        test("renders the correct day count for each item", () => {
            renderCart();

            expect(screen.getByText("2 days")).toBeInTheDocument(); // Inception
            expect(screen.getByText("3 days")).toBeInTheDocument(); // Interstellar
        });

        test("disables the decrease button when rentalDays is 1", () => {
            renderCart({
                items: [makeItem({ rentalDays: 1, lineTotal: 100 })],
                totalCost: 100,
            });

            // The only decrease button on screen
            const decreaseButtons = screen.getAllByRole("button", {
                name: "−",
            });

            expect(decreaseButtons[0]).toBeDisabled();
        });

        test("clicking + dispatches changeRentalDays with incremented value", () => {
            renderCart();

            const increaseButtons = screen.getAllByRole("button", {
                name: "+",
            });

            fireEvent.click(increaseButtons[0]); // Inception (2 → 3)

            expect(changeRentalDays).toHaveBeenCalledWith({
                movieId: "m1",
                rentalDays: 3,
            });
        });

        test("clicking − dispatches changeRentalDays with decremented value", () => {
            renderCart();

            const decreaseButtons = screen.getAllByRole("button", {
                name: "−",
            });

            fireEvent.click(decreaseButtons[0]); // Inception (2 → 1)

            expect(changeRentalDays).toHaveBeenCalledWith({
                movieId: "m1",
                rentalDays: 1,
            });
        });
    });

    // -----------------------------------------------------------------------
    // Component-level: remove / clear
    // -----------------------------------------------------------------------

    describe("remove and clear actions", () => {
        test("clicking Remove dispatches deleteCartItem then refetches", async () => {
            renderCart();

            const removeButtons = screen.getAllByRole("button", {
                name: "Remove",
            });

            fireEvent.click(removeButtons[0]); // Inception

            await waitFor(() => {
                expect(deleteCartItem).toHaveBeenCalledWith("m1");
            });

            // fetchCart is called once on mount + once after removal
            await waitFor(() => {
                expect(fetchCart).toHaveBeenCalledTimes(2);
            });
        });

        test("clicking Remove on the second item uses its movieId", async () => {
            renderCart();

            const removeButtons = screen.getAllByRole("button", {
                name: "Remove",
            });

            fireEvent.click(removeButtons[1]); // Interstellar

            await waitFor(() => {
                expect(deleteCartItem).toHaveBeenCalledWith("m2");
            });
        });

        test("clicking Clear Cart dispatches emptyCart", () => {
            renderCart();

            fireEvent.click(screen.getByRole("button", { name: "Clear Cart" }));

            expect(emptyCart).toHaveBeenCalledTimes(1);
        });
    });

    // -----------------------------------------------------------------------
    // Component-level: checkout
    // -----------------------------------------------------------------------

    describe("checkout", () => {
        test("clicking Proceed to Checkout dispatches checkout", async () => {
            checkout.fulfilled = { match: jest.fn(() => false) };

            renderCart();

            fireEvent.click(
                screen.getByRole("button", {
                    name: "Proceed to Checkout",
                }),
            );

            await waitFor(() => {
                expect(checkout).toHaveBeenCalledTimes(1);
            });
        });

        test("navigates to /profile after successful checkout", async () => {
            checkout.fulfilled = { match: jest.fn(() => true) };

            renderCart();

            fireEvent.click(
                screen.getByRole("button", {
                    name: "Proceed to Checkout",
                }),
            );

            await waitFor(() => {
                expect(screen.getByTestId("location")).toHaveTextContent("/profile");
            });
        });
    });
});
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { MemoryRouter, useLocation } from "react-router-dom";

import AppNavbar from "../../components/AppNavbar";

const LocationDisplay = () => {
    const location = useLocation();

    return <div data-testid="location">{location.pathname}</div>;
};

describe("AppNavBar", () => {
    const createStore = (user = null) =>
        configureStore({
            reducer: {
                auth: (state = { user }) => state,
            },
        });

    const renderNavbar = (user = null) => {
        return render(
            <Provider store={createStore(user)}>
                <MemoryRouter initialEntries={["/home"]}>
                    <AppNavbar />
                    <LocationDisplay />
                </MemoryRouter>
            </Provider>
        );
    };

    test("renders navbar", () => {
        renderNavbar({
            name: "Bhavesh Patil",
        });

        expect(screen.getByRole("navigation")).toBeInTheDocument();
    });

    test("renders Movies navigation item", () => {
        renderNavbar({
            name: "Bhavesh Patil",
        });

        expect(screen.getByText("Movies")).toBeInTheDocument();
    });

    test("renders Cart navigation item", () => {
        renderNavbar({
            name: "Bhavesh Patil",
        });

        expect(screen.getByText("Cart")).toBeInTheDocument();
    });

    test("displays logged-in user's name", () => {
        renderNavbar({
            name: "Bhavesh Patil",
        });

        expect(screen.getByText("Bhavesh Patil")).toBeInTheDocument();
    });

    test("renders Profile navigation item", () => {
        renderNavbar({
            name: "Bhavesh Patil",
        });

        expect(screen.getByText("Profile")).toBeInTheDocument();
    });

    test("shows Logout option in profile dropdown", async () => {
        const user = userEvent.setup();

        renderNavbar({
            name: "Bhavesh Patil",
        });

        await user.click(screen.getByText("Bhavesh Patil"));

        expect(screen.getByText("Logout")).toBeInTheDocument();
    });

    test("Movies link navigates to home page", async () => {
        const user = userEvent.setup();

        renderNavbar({
            name: "Bhavesh Patil",
        });

        await user.click(screen.getByText("Movies"));

        expect(screen.getByTestId("location")).toHaveTextContent("/home");
    });

    test("Cart link navigates to cart page", async () => {
        const user = userEvent.setup();

        renderNavbar({
            name: "Bhavesh Patil",
        });

        await user.click(screen.getByText("Cart"));

        expect(screen.getByTestId("location")).toHaveTextContent("/cart");
    });

    test("Profile link navigates to profile page", async () => {
        const user = userEvent.setup();

        renderNavbar({
            name: "Bhavesh Patil",
        });

        await user.click(screen.getByText("Profile"));

        expect(screen.getByTestId("location")).toHaveTextContent("/profile");
    });
});
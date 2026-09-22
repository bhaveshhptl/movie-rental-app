import {
    render,
    screen,
    fireEvent,
    waitFor,
} from "@testing-library/react";

import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";

import {
    MemoryRouter,
    useLocation,
} from "react-router-dom";

import Login from "../../pages/Login";
import { login } from "../../features/auth/authSlice.js";

jest.mock("../../features/auth/authSlice.js", () => ({
    login: jest.fn(),
}));

const LocationDisplay = () => {
    const location = useLocation();

    return (
        <div data-testid="location">
            {location.pathname}
        </div>
    );
};

describe("Login", () => {
    const createStore = ({
        loading = false,
        error = null,
    } = {}) =>
        configureStore({
            reducer: {
                auth: (
                    state = {
                        loading,
                        error,
                    }
                ) => state,
            },
        });

    const renderLogin = ({
        loading = false,
        error = null,
    } = {}) => {
        return render(
            <Provider
                store={createStore({
                    loading,
                    error,
                })}
            >
                <MemoryRouter initialEntries={["/login"]}>
                    <Login />
                    <LocationDisplay />
                </MemoryRouter>
            </Provider>
        );
    };

    // Shared helper so each test doesn't repeat the same three changes
    const fillForm = ({
        email = "bhavesh@example.com",
        password = "password123",
    } = {}) => {
        fireEvent.change(
            screen.getByPlaceholderText("Enter your email"),
            { target: { value: email } }
        );

        fireEvent.change(
            screen.getByPlaceholderText("Enter your password"),
            { target: { value: password } }
        );
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    // -----------------------------------------------------------------------
    // Page-level: rendering
    // -----------------------------------------------------------------------

    test("renders Movie Rental heading", () => {
        renderLogin();

        expect(
            screen.getByRole("heading", {
                name: "Movie Rental",
            })
        ).toBeInTheDocument();
    });

    test("renders 'Sign in to continue' subtitle", () => {
        renderLogin();

        expect(
            screen.getByText("Sign in to continue")
        ).toBeInTheDocument();
    });

    test("renders login form fields", () => {
        renderLogin();

        expect(
            screen.getByPlaceholderText("Enter your email")
        ).toBeInTheDocument();

        // FIX: query by placeholder because <Form.Label> has no htmlFor
        expect(
            screen.getByPlaceholderText("Enter your password")
        ).toBeInTheDocument();
    });

    test("renders Login button", () => {
        renderLogin();

        expect(
            screen.getByRole("button", {
                name: "Login",
            })
        ).toBeInTheDocument();
    });

    test("renders Register link pointing to /register", () => {
        renderLogin();

        expect(
            screen.getByRole("link", {
                name: "Register",
            })
        ).toHaveAttribute("href", "/register");
    });

    // -----------------------------------------------------------------------
    // Component-level: form interaction
    // -----------------------------------------------------------------------

    test("allows user to enter login details", () => {
        renderLogin();

        const emailInput =
            screen.getByPlaceholderText("Enter your email");

        const passwordInput =
            screen.getByPlaceholderText("Enter your password");

        fireEvent.change(emailInput, {
            target: { value: "bhavesh@example.com" },
        });

        fireEvent.change(passwordInput, {
            target: { value: "password123" },
        });

        expect(emailInput).toHaveValue("bhavesh@example.com");
        expect(passwordInput).toHaveValue("password123");
    });

    // -----------------------------------------------------------------------
    // Page-level: state-driven rendering
    // -----------------------------------------------------------------------

    test("shows error message when login fails", () => {
        renderLogin({
            error: "Invalid email or password",
        });

        expect(
            screen.getByText("Invalid email or password")
        ).toBeInTheDocument();
    });

    test("disables Login button while loading", () => {
        renderLogin({
            loading: true,
        });

        expect(
            screen.getByRole("button", {
                name: /Logging in/i,
            })
        ).toBeDisabled();
    });

    test("shows 'Logging in...' text while loading", () => {
        renderLogin({
            loading: true,
        });

        expect(
            screen.getByRole("button", {
                name: /Logging in/i,
            })
        ).toHaveTextContent("Logging in...");
    });

    // -----------------------------------------------------------------------
    // Component-level: submit → dispatch
    // -----------------------------------------------------------------------

    test("dispatches login with form data on submit", async () => {
        login.mockReturnValue({
            type: "auth/login",
        });
        // Reject path so no navigation happens
        login.fulfilled = { match: jest.fn(() => false) };

        renderLogin();

        fillForm();

        fireEvent.click(
            screen.getByRole("button", {
                name: "Login",
            })
        );

        await waitFor(() => {
            expect(login).toHaveBeenCalledWith({
                email: "bhavesh@example.com",
                password: "password123",
            });
        });
    });

    // -----------------------------------------------------------------------
    // Page-level: navigation
    // -----------------------------------------------------------------------

    test("navigates to /home after successful login", async () => {
        login.mockReturnValue({
            type: "auth/login",
        });
        login.fulfilled = { match: jest.fn(() => true) };

        renderLogin();

        fillForm();

        fireEvent.click(
            screen.getByRole("button", {
                name: "Login",
            })
        );

        await waitFor(() => {
            expect(
                screen.getByTestId("location")
            ).toHaveTextContent("/home");
        });
    });

    test("does not navigate when login is rejected", async () => {
        login.mockReturnValue({
            type: "auth/login",
        });
        login.fulfilled = { match: jest.fn(() => false) };

        renderLogin();

        fillForm();

        fireEvent.click(
            screen.getByRole("button", {
                name: "Login",
            })
        );

        await waitFor(() => {
            expect(login).toHaveBeenCalled();
        });

        expect(
            screen.getByTestId("location")
        ).toHaveTextContent("/login");
    });
});
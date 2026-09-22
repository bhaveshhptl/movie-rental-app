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

import Register from "../../pages/Register";
import { register } from "../../features/auth/authSlice.js";

jest.mock("../../features/auth/authSlice.js", () => ({
    register: jest.fn(),
}));

const LocationDisplay = () => {
    const location = useLocation();

    return (
        <div data-testid="location">
            {location.pathname}
        </div>
    );
};

describe("Register", () => {
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

    const renderRegister = ({
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
                <MemoryRouter initialEntries={["/register"]}>
                    <Register />
                    <LocationDisplay />
                </MemoryRouter>
            </Provider>
        );
    };

    // helper to fill out the form (used by multiple tests)
    const fillForm = ({
        name = "Bhavesh Patil",
        email = "bhavesh@example.com",
        password = "password123",
    } = {}) => {
        fireEvent.change(
            screen.getByPlaceholderText("Enter your name"),
            { target: { value: name } }
        );

        fireEvent.change(
            screen.getByPlaceholderText("Enter your email"),
            { target: { value: email } }
        );

        fireEvent.change(
            screen.getByPlaceholderText("Create a password"),
            { target: { value: password } }
        );
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("renders Create Account heading", () => {
        renderRegister();

        expect(
            screen.getByRole("heading", {
                name: "Create Account",
            })
        ).toBeInTheDocument();
    });

    test("renders registration form fields", () => {
        renderRegister();

        expect(
            screen.getByPlaceholderText("Enter your name")
        ).toBeInTheDocument();

        expect(
            screen.getByPlaceholderText("Enter your email")
        ).toBeInTheDocument();

        // FIX: query by placeholder because <Form.Label> has no htmlFor
        expect(
            screen.getByPlaceholderText("Create a password")
        ).toBeInTheDocument();
    });

    test("renders Create Account button", () => {
        renderRegister();

        expect(
            screen.getByRole("button", {
                name: "Create Account",
            })
        ).toBeInTheDocument();
    });

    test("renders Login link", () => {
        renderRegister();

        expect(
            screen.getByRole("link", {
                name: "Login",
            })
        ).toHaveAttribute("href", "/login");
    });

    test("allows user to enter registration details", () => {
        renderRegister();

        const nameInput =
            screen.getByPlaceholderText("Enter your name");

        const emailInput =
            screen.getByPlaceholderText("Enter your email");

        // FIX: query by placeholder instead of getByLabelText
        const passwordInput =
            screen.getByPlaceholderText("Create a password");

        fireEvent.change(nameInput, {
            target: { value: "Bhavesh Patil" },
        });

        fireEvent.change(emailInput, {
            target: { value: "bhavesh@example.com" },
        });

        fireEvent.change(passwordInput, {
            target: { value: "password123" },
        });

        expect(nameInput).toHaveValue("Bhavesh Patil");
        expect(emailInput).toHaveValue("bhavesh@example.com");
        expect(passwordInput).toHaveValue("password123");
    });

    test("shows error message when registration fails", () => {
        renderRegister({
            error: "Email already exists",
        });

        expect(
            screen.getByText("Email already exists")
        ).toBeInTheDocument();
    });

    test("disables Create Account button while loading", () => {
        renderRegister({
            loading: true,
        });

        expect(
            screen.getByRole("button", {
                name: /Creating account/i,
            })
        ).toBeDisabled();
    });

    test("dispatches registration with form data", async () => {
        // make dispatch(register(...)) resolve to a rejected-style action
        // so the component doesn't try to navigate
        register.mockReturnValue({
            type: "auth/register",
        });
        register.fulfilled = { match: jest.fn(() => false) };

        renderRegister();

        fillForm();

        fireEvent.click(
            screen.getByRole("button", {
                name: "Create Account",
            })
        );

        await waitFor(() => {
            expect(register).toHaveBeenCalledWith({
                name: "Bhavesh Patil",
                email: "bhavesh@example.com",
                password: "password123",
            });
        });
    });

    test("navigates to login after successful registration", async () => {
        register.mockReturnValue({
            type: "auth/register",
        });
        register.fulfilled = { match: jest.fn(() => true) };

        renderRegister();

        fillForm();

        fireEvent.click(
            screen.getByRole("button", {
                name: "Create Account",
            })
        );

        await waitFor(() => {
            expect(
                screen.getByTestId("location")
            ).toHaveTextContent("/login");
        });
    });
});
import {
  render,
  screen,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";

import MovieCard from "../../components/MovieCard";

describe("MovieCard", () => {
  const movie = {
    id: 1,
    title: "Inception",
    genre: "Science Fiction",
    description: "A dream within a dream.",
    image: "inception.jpg",
    rentPerDay: 100,
  };

  const renderMovieCard = (movieData = movie) => {
    const store = configureStore({
      reducer: {
        cart: (state = { items: [] }) => state,
      },
    });

    return render(
      <Provider store={store}>
        <MovieCard movie={movieData} />
      </Provider>
    );
  };

  test("renders movie title", () => {
    renderMovieCard();

    expect(
      screen.getByText("Inception")
    ).toBeInTheDocument();
  });

  test("renders movie genre", () => {
    renderMovieCard();

    expect(
      screen.getByText(/Science Fiction/)
    ).toBeInTheDocument();
  });

  test("renders movie description", () => {
    renderMovieCard();

    expect(
      screen.getByText("A dream within a dream.")
    ).toBeInTheDocument();
  });

  test("renders movie image", () => {
    renderMovieCard();

    expect(
      screen.getByAltText("Inception")
    ).toBeInTheDocument();
  });

  test("renders rental day dropdown", () => {
    renderMovieCard();

    expect(
      screen.getByRole("combobox")
    ).toBeInTheDocument();
  });

  test("renders all rental day options", () => {
    renderMovieCard();

    const expectedOptions = [
      "1 day",
      "2 days",
      "3 days",
      "4 days",
      "5 days",
      "6 days",
      "7 days",
    ];

    expectedOptions.forEach((option) => {
      expect(
        screen.getByRole("option", {
          name: option,
        })
      ).toBeInTheDocument();
    });
  });

  test("starts with 1 rental day selected", () => {
    renderMovieCard();

    expect(
      screen.getByRole("combobox")
    ).toHaveValue("1");
  });

  test("allows changing rental days", async () => {
    const user = userEvent.setup();

    renderMovieCard();

    const select = screen.getByRole("combobox");

    await user.selectOptions(select, "3");

    expect(select).toHaveValue("3");
  });

  test("allows selecting 7 rental days", async () => {
    const user = userEvent.setup();

    renderMovieCard();

    const select = screen.getByRole("combobox");

    await user.selectOptions(select, "7");

    expect(select).toHaveValue("7");
  });

  test("renders Add to Cart button", () => {
    renderMovieCard();

    expect(
      screen.getByRole("button", {
        name: /add to cart/i,
      })
    ).toBeInTheDocument();
  });
});
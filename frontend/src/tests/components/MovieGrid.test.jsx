import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";

import MovieGrid from "../../components/MovieGrid";

describe("MovieGrid", () => {
  const movies = [
    {
      id: 1,
      title: "Inception",
      genre: "Science Fiction",
      description: "A dream within a dream.",
      image: "inception.jpg",
    },
    {
      id: 2,
      title: "The Dark Knight",
      genre: "Action",
      description: "A superhero faces a dangerous enemy.",
      image: "dark-knight.jpg",
    },
  ];

  const renderWithStore = (ui) => {
    const store = configureStore({
      reducer: {
        cart: (state = { items: [] }) => state,
      },
    });

    return render(
      <Provider store={store}>
        {ui}
      </Provider>
    );
  };

  test("renders the movie grid", () => {
    const { container } = renderWithStore(
      <MovieGrid movies={movies} />
    );

    expect(
      container.querySelector(".row")
    ).toBeInTheDocument();
  });

  test("renders the supplied movies", () => {
    renderWithStore(
      <MovieGrid movies={movies} />
    );

    expect(
      screen.getByText("Inception")
    ).toBeInTheDocument();

    expect(
      screen.getByText("The Dark Knight")
    ).toBeInTheDocument();
  });

  test("renders an empty state when there are no movies", () => {
    render(
      <MovieGrid movies={[]} />
    );

    expect(
      screen.getByText(/no movies/i)
    ).toBeInTheDocument();
  });

  test("renders loading spinner", () => {
    const { container } = render(
      <MovieGrid
        movies={[]}
        loading={true}
      />
    );

    expect(
      container.querySelector(".spinner-border")
    ).toBeInTheDocument();
  });

  test("renders error state", () => {
    render(
      <MovieGrid
        movies={[]}
        error="Failed to load movies"
      />
    );

    expect(
      screen.getByText("Failed to load movies")
    ).toBeInTheDocument();
  });
});
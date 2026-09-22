import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";

import Home from "../../pages/Home";
import { fetchMovies } from "../../features/movies/movieSlice";

jest.mock("../../features/movies/movieSlice", () => ({
  fetchMovies: jest.fn((params) => ({
    type: "movies/fetchMovies",
    payload: params,
  })),
}));

jest.mock("../../components/AppNavbar", () => () => (
  <nav data-testid="app-navbar">Navbar</nav>
));

jest.mock("../../components/MovieCarousel", () => ({ movies }) => (
  <div data-testid="movie-carousel">
    Carousel - {movies.length} movies
  </div>
));

jest.mock("../../components/MovieFilters", () => ({
  search,
  genre,
  onSearchChange,
  onGenreChange,
}) => (
  <div data-testid="movie-filters">
    <input
      aria-label="Search movies"
      value={search}
      onChange={(e) => onSearchChange(e.target.value)}
    />

    <select
      aria-label="Genre"
      value={genre}
      onChange={(e) => onGenreChange(e.target.value)}
    >
      <option value="">All Genres</option>
      <option value="Action">Action</option>
      <option value="Comedy">Comedy</option>
    </select>
  </div>
));

jest.mock("../../components/MovieGrid", () => ({
  movies,
  loading,
  error,
}) => (
  <div data-testid="movie-grid">
    {loading
      ? "Loading movies"
      : error
      ? error
      : `${movies.length} movies`}
  </div>
));

jest.mock("../../components/MoviePagination", () => ({
  currentPage,
  totalPages,
  onPageChange,
}) => (
  <div data-testid="movie-pagination">
    <span>
      Page {currentPage} of {totalPages}
    </span>

    <button onClick={() => onPageChange(2)}>
      Page 2
    </button>
  </div>
));

describe("Home", () => {
  const movies = [
    {
      id: 1,
      title: "Inception",
      genre: "Science Fiction",
    },
    {
      id: 2,
      title: "The Dark Knight",
      genre: "Action",
    },
  ];

  const createStore = ({
    moviesData = movies,
    pagination = {
      currentPage: 1,
      totalPages: 3,
    },
    loading = false,
    error = null,
  } = {}) =>
    configureStore({
      reducer: {
        movies: (
          state = {
            movies: moviesData,
            pagination,
            loading,
            error,
          }
        ) => state,
      },
    });

  const renderHome = (state = {}) => {
    return render(
      <Provider store={createStore(state)}>
        <Home />
      </Provider>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders navbar", () => {
    renderHome();

    expect(screen.getByTestId("app-navbar")).toBeInTheDocument();
  });

  test("renders Browse Movies heading", () => {
    renderHome();

    expect(screen.getByText("Browse Movies")).toBeInTheDocument();
    expect(
      screen.getByText("Find your next movie night")
    ).toBeInTheDocument();
  });

  test("renders movie carousel", () => {
    renderHome();

    expect(screen.getByTestId("movie-carousel")).toBeInTheDocument();
  });

  test("renders movie filters", () => {
    renderHome();

    expect(screen.getByTestId("movie-filters")).toBeInTheDocument();
  });

  test("renders movie grid", () => {
    renderHome();

    expect(screen.getByTestId("movie-grid")).toBeInTheDocument();
  });

  test("renders pagination", () => {
    renderHome();

    expect(screen.getByTestId("movie-pagination")).toBeInTheDocument();
    expect(screen.getByText("Page 1 of 3")).toBeInTheDocument();
  });

  test("fetches first page of movies when Home loads", () => {
    renderHome();

    expect(fetchMovies).toHaveBeenCalledWith({
      page: 1,
      limit: 8,
      search: "",
      genre: "",
    });
  });

  test("fetches movies when search changes", () => {
    renderHome();

    const searchInput = screen.getByLabelText("Search movies");

    fireEvent.change(searchInput, {
      target: { value: "Inception" },
    });

    expect(fetchMovies).toHaveBeenLastCalledWith({
      page: 1,
      limit: 8,
      search: "Inception",
      genre: "",
    });
  });

  test("fetches movies when genre changes", () => {
    renderHome();

    const genreSelect = screen.getByLabelText("Genre");

    fireEvent.change(genreSelect, {
      target: { value: "Action" },
    });

    expect(fetchMovies).toHaveBeenLastCalledWith({
      page: 1,
      limit: 8,
      search: "",
      genre: "Action",
    });
  });

  test("fetches selected page when pagination changes", () => {
    renderHome();

    fireEvent.click(screen.getByRole("button", { name: "Page 2" }));

    expect(fetchMovies).toHaveBeenLastCalledWith({
      page: 2,
      limit: 8,
      search: "",
      genre: "",
    });
  });

  test("passes loading state to movie grid", () => {
    renderHome({
      loading: true,
    });

    expect(screen.getByText("Loading movies")).toBeInTheDocument();
  });

  test("passes error state to movie grid", () => {
    renderHome({
      error: "Failed to fetch movies",
    });

    expect(
      screen.getByText("Failed to fetch movies")
    ).toBeInTheDocument();
  });

});
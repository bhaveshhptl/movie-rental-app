import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import MovieFilters from "../../components/MovieFilters";

describe("MovieFilters", () => {
  const defaultProps = {
    search: "",
    genre: "",
    onSearchChange: jest.fn(),
    onGenreChange: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders search input", () => {
    render(<MovieFilters {...defaultProps} />);

    expect(
      screen.getByPlaceholderText("Search movies...")
    ).toBeInTheDocument();
  });

  test("renders genre select", () => {
    render(<MovieFilters {...defaultProps} />);

    expect(
      screen.getByRole("combobox")
    ).toBeInTheDocument();
  });

  test("renders all genre options", () => {
    render(<MovieFilters {...defaultProps} />);

    expect(
      screen.getByRole("option", {
        name: "All Genres",
      })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("option", {
        name: "Action",
      })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("option", {
        name: "Adventure",
      })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("option", {
        name: "Comedy",
      })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("option", {
        name: "Drama",
      })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("option", {
        name: "Science Fiction",
      })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("option", {
        name: "Thriller",
      })
    ).toBeInTheDocument();
  });

  test("calls onSearchChange when search value changes", async () => {
    const user = userEvent.setup();

    render(<MovieFilters {...defaultProps} />);

    const searchInput =
      screen.getByPlaceholderText("Search movies...");

    await user.type(searchInput, "Inception");

    expect(
      defaultProps.onSearchChange
    ).toHaveBeenCalled();
  });

  test("calls onGenreChange when genre changes", async () => {
    const user = userEvent.setup();

    render(<MovieFilters {...defaultProps} />);

    const genreSelect =
      screen.getByRole("combobox");

    await user.selectOptions(
      genreSelect,
      "Action"
    );

    expect(
      defaultProps.onGenreChange
    ).toHaveBeenCalledWith("Action");
  });

  test("displays the supplied search value", () => {
    render(
      <MovieFilters
        {...defaultProps}
        search="Batman"
      />
    );

    expect(
      screen.getByDisplayValue("Batman")
    ).toBeInTheDocument();
  });

  test("displays the supplied genre value", () => {
    render(
      <MovieFilters
        {...defaultProps}
        genre="Comedy"
      />
    );

    expect(
      screen.getByDisplayValue("Comedy")
    ).toBeInTheDocument();
  });
});
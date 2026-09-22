import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import MoviePagination from "../../components/MoviePagination";

describe("MoviePagination", () => {
  const defaultProps = {
    currentPage: 1,
    totalPages: 5,
    onPageChange: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders pagination controls", () => {
    render(<MoviePagination {...defaultProps} />);

    expect(
      screen.getByText("Previous", { selector: ".visually-hidden" })
    ).toBeInTheDocument();

    expect(
      screen.getByText("Next", { selector: ".visually-hidden" })
    ).toBeInTheDocument();
  });

  test("renders the available page numbers", () => {
    render(<MoviePagination {...defaultProps} />);

    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
    expect(screen.getByText("4")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();
  });

  test("disables Previous on the first page", () => {
    render(
      <MoviePagination
        {...defaultProps}
        currentPage={1}
      />
    );

    const previousText = screen.getByText("Previous", {
      selector: ".visually-hidden",
    });

    const previousItem = previousText.closest("li");

    expect(previousItem).toHaveClass("disabled");
  });

  test("disables Next on the last page", () => {
    render(
      <MoviePagination
        {...defaultProps}
        currentPage={5}
      />
    );

    const nextText = screen.getByText("Next", {
      selector: ".visually-hidden",
    });

    const nextItem = nextText.closest("li");

    expect(nextItem).toHaveClass("disabled");
  });

  test("enables Previous when not on the first page", () => {
    render(
      <MoviePagination
        {...defaultProps}
        currentPage={3}
      />
    );

    const previousLink = screen.getByRole("button", {
      name: /previous/i,
    });

    expect(previousLink).toBeInTheDocument();

    expect(previousLink.closest("li")).not.toHaveClass(
      "disabled"
    );
  });

  test("enables Next when not on the last page", () => {
    render(
      <MoviePagination
        {...defaultProps}
        currentPage={3}
      />
    );

    const nextLink = screen.getByRole("button", {
      name: /next/i,
    });

    expect(nextLink).toBeInTheDocument();

    expect(nextLink.closest("li")).not.toHaveClass(
      "disabled"
    );
  });

  test("calls onPageChange when a page number is clicked", async () => {
    const user = userEvent.setup();

    render(<MoviePagination {...defaultProps} />);

    await user.click(
      screen.getByRole("button", { name: "3" })
    );

    expect(defaultProps.onPageChange).toHaveBeenCalledWith(3);
  });

  test("calls onPageChange with the previous page", async () => {
    const user = userEvent.setup();

    render(
      <MoviePagination
        {...defaultProps}
        currentPage={3}
      />
    );

    await user.click(
      screen.getByRole("button", {
        name: /previous/i,
      })
    );

    expect(
      defaultProps.onPageChange
    ).toHaveBeenCalledWith(2);
  });

  test("calls onPageChange with the next page", async () => {
    const user = userEvent.setup();

    render(
      <MoviePagination
        {...defaultProps}
        currentPage={3}
      />
    );

    await user.click(
      screen.getByRole("button", {
        name: /next/i,
      })
    );

    expect(
      defaultProps.onPageChange
    ).toHaveBeenCalledWith(4);
  });

  test("marks the current page as active", () => {
    render(
      <MoviePagination
        {...defaultProps}
        currentPage={3}
      />
    );

    const currentPageText = screen.getByText("3", {
      selector: ".page-link",
    });

    expect(
      currentPageText.closest("li")
    ).toHaveClass("active");
  });
});
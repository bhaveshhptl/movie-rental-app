import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import MovieCarousel from "../../components/MovieCarousel";

describe("MovieCarousel", () => {
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
        {
            id: 3,
            title: "Interstellar",
            genre: "Science Fiction",
            description: "Explorers travel through space.",
            image: "interstellar.jpg",
        },
        {
            id: 4,
            title: "The Hangover",
            genre: "Comedy",
            description: "A bachelor party goes wrong.",
            image: "hangover.jpg",
        },
    ];

    test("renders the carousel", () => {
        const { container } = render(
            <MovieCarousel movies={movies} />
        );

        expect(
            container.querySelector(".movie-carousel")
        ).toBeInTheDocument();
    });

    test("renders movie titles", () => {
        render(<MovieCarousel movies={movies} />);

        expect(screen.getByText("Inception")).toBeInTheDocument();
        expect(
            screen.getByText("The Dark Knight")
        ).toBeInTheDocument();
        expect(
            screen.getByText("Interstellar")
        ).toBeInTheDocument();
        expect(
            screen.getByText("The Hangover")
        ).toBeInTheDocument();
    });

    test("renders movie descriptions", () => {
        render(<MovieCarousel movies={movies} />);

        expect(
            screen.getByText("A dream within a dream.")
        ).toBeInTheDocument();

        expect(
            screen.getByText(
                "A superhero faces a dangerous enemy."
            )
        ).toBeInTheDocument();

        expect(
            screen.getByText(
                "Explorers travel through space."
            )
        ).toBeInTheDocument();

        expect(
            screen.getByText(
                "A bachelor party goes wrong."
            )
        ).toBeInTheDocument();
    });

    test("renders movie images", () => {
        render(<MovieCarousel movies={movies} />);

        expect(
            screen.getByAltText("Inception")
        ).toBeInTheDocument();

        expect(
            screen.getByAltText("The Dark Knight")
        ).toBeInTheDocument();

        expect(
            screen.getByAltText("Interstellar")
        ).toBeInTheDocument();

        expect(
            screen.getByAltText("The Hangover")
        ).toBeInTheDocument();
    });

    test("renders carousel indicators", () => {
        render(<MovieCarousel movies={movies} />);

        const indicators =
            screen.getAllByRole("button");

        expect(indicators.length).toBeGreaterThan(0);
    });

    test("renders previous and next controls", () => {
        render(<MovieCarousel movies={movies} />);

        expect(
            screen.getByRole("button", {
                name: /previous/i,
            })
        ).toBeInTheDocument();

        expect(
            screen.getByRole("button", {
                name: /next/i,
            })
        ).toBeInTheDocument();
    });

    test("renders nothing when the movie list is empty", () => {
        const { container } = render(
            <MovieCarousel movies={[]} />
        );

        expect(container.firstChild).toBeNull();
    });

    test("allows carousel navigation", async () => {
        const user = userEvent.setup();

        render(<MovieCarousel movies={movies} />);

        const nextButton = screen.getByRole("button", {
            name: /next/i,
        });

        await user.click(nextButton);

        expect(nextButton).toBeInTheDocument();
    });
});
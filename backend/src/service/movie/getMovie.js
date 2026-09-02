import { jsonServerClient } from "../../config/jsonServer.js";

export const getAllMoviesService = async ({
    search = "",
    genre = "",
    page = 1,
    limit = 10
} = {}) => {
    let movies;

    try {
        const response = await jsonServerClient.get("/movies");

        movies = response.data;
    } catch (error) {
        throw new Error(
            "Failed to fetch movies from database",
            { cause: error }
        );
    }

    const normalizedSearch = search.toLowerCase();
    const normalizedGenre = genre.toLowerCase();

    if (normalizedSearch) {
        movies = movies.filter((movie) =>
            movie.title
                ?.toLowerCase()
                .includes(normalizedSearch)
        );
    }

    if (normalizedGenre) {
        movies = movies.filter(
            (movie) =>
                movie.genre?.toLowerCase() === normalizedGenre
        );
    }

    const totalItems = movies.length;

    const totalPages = Math.ceil(
        totalItems / limit
    );

    const startIndex = (page - 1) * limit;

    return {
        movies: movies.slice(
            startIndex,
            startIndex + limit
        ),

        pagination: {
            currentPage: page,
            pageSize: limit,
            totalItems,
            totalPages
        }
    };
};

export const getMovieService = async (id) => {
    try {
        const response = await jsonServerClient.get(
            `/movies/${id}`
        );

        return response.data;
    } catch (error) {
        if (error.response?.status === 404) {
            const err = new Error("Movie not found");

            err.statusCode = 404;

            throw err;
        }

        throw new Error(
            `Database error fetching movie with id ${id}`,
            { cause: error }
        );
    }
};
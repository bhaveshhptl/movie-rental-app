import { jsonServerClient } from "../../config/jsonServer.js";

export const createMovie = async (movieData) => {
    const copies = Number(movieData.copies);

    if (!Number.isInteger(copies) || copies < 1) {
        const error = new Error(
            "Copies must be a positive whole number"
        );

        error.statusCode = 400;

        throw error;
    }

    const newMovie = {
        ...movieData,
        copies,
        availableCopies: copies
    };

    try {
        const response = await jsonServerClient.post(
            "/movies",
            newMovie
        );

        return response.data;
    } catch (error) {
        throw new Error(
            "Failed to create movie",
            { cause: error }
        );
    }
};
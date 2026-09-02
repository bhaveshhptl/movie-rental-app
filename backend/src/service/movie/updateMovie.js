import { jsonServerClient } from "../../config/jsonServer.js";

export const updateMovie = async (
    id,
    movieData
) => {
    let movie;

    try {
        const response = await jsonServerClient.get(
            `/movies/${id}`
        );

        movie = response.data;
    } catch (error) {
        if (error.response?.status === 404) {
            const err = new Error("Movie not found");
            err.statusCode = 404;
            throw err;
        }

        throw error;
    }

    const updateData = {
        ...movieData
    };

    if (movieData.copies !== undefined) {
        const newCopies = Number(movieData.copies);

        if (
            !Number.isInteger(newCopies) ||
            newCopies < 1
        ) {
            const error = new Error(
                "Copies must be a positive whole number"
            );

            error.statusCode = 400;
            throw error;
        }

        const rentedCopies =
            movie.copies - movie.availableCopies;

        if (newCopies < rentedCopies) {
            const error = new Error(
                `Cannot reduce copies below ${rentedCopies}. ` +
                `${rentedCopies} copies are currently rented.`
            );

            error.statusCode = 409;
            throw error;
        }

        /*
         * If copies increase, availability increases
         * by the same amount.
         */
        const copiesDifference =
            newCopies - movie.copies;

        updateData.copies = newCopies;

        updateData.availableCopies =
            movie.availableCopies + copiesDifference;
    }

    try {
        const response = await jsonServerClient.patch(
            `/movies/${id}`,
            updateData
        );

        return response.data;
    } catch (error) {
        throw new Error(
            `Failed to update movie with id ${id}`,
            { cause: error }
        );
    }
};
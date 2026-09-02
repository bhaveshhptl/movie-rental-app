import { jsonServerClient } from "../../config/jsonServer.js";

export const deleteMovie = async (id) => {
    try {
        await jsonServerClient.delete(
            `/movies/${id}`
        );
    } catch (error) {
        if (error.response?.status === 404) {
            const err = new Error("Movie not found");

            err.statusCode = 404;

            throw err;
        }

        throw new Error(
            `Failed to delete movie with id ${id}`,
            { cause: error }
        );
    }
};
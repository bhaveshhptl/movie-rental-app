import { jsonServerClient } from "../../config/jsonServer.js";
import { findCartByUserId } from "./findCartByUserId.js";

export const addToCartService = async (
    userId,
    movieId,
    rentalDays
) => {
    let movie;

    try {
        const response = await jsonServerClient.get(
            `/movies/${movieId}`
        );

        movie = response.data;
    } catch (error) {
        if (error.response?.status === 404) {
            const err = new Error("Movie not found");
            err.statusCode = 404;
            throw err;
        }

        throw new Error("Unable to retrieve movie", {
            cause: error
        });
    }

    if (movie.availableCopies <= 0) {
        const error = new Error(
            "Movie is currently unavailable"
        );

        error.statusCode = 409;

        throw error;
    }

    const cart = await findCartByUserId(userId);

    const items = cart?.items || [];

    const movieAlreadyExists = items.some(
        (item) => String(item.movieId) === String(movieId)
    );

    if (movieAlreadyExists) {
        const error = new Error(
            "Movie is already in the cart"
        );

        error.statusCode = 409;

        throw error;
    }

    const newItem = {
        movieId: String(movieId),
        rentalDays
    };

    if (cart) {
        const response = await jsonServerClient.patch(
            `/carts/${cart.id}`,
            {
                items: [...items, newItem]
            }
        );

        return response.data;
    }

    const response = await jsonServerClient.post(
        "/carts",
        {
            userId,
            items: [newItem]
        }
    );

    return response.data;
};
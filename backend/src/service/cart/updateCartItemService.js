import { jsonServerClient } from "../../config/jsonServer.js";

import { findCartByUserId } from "./findCartByUserId.js";
import { getCartService } from "./getCartService.js";

export const updateCartItemService = async (
    userId,
    movieId,
    rentalDays
) => {
    const cart = await findCartByUserId(userId);

    const itemExists = cart?.items?.some(
        (item) => String(item.movieId) === movieId
    );

    if (!itemExists) {
        const error = new Error(
            "Movie is not in the cart"
        );

        error.statusCode = 404;

        throw error;
    }

    const updatedItems = cart.items.map((item) => {
        if (String(item.movieId) === movieId) {
            return {
                movieId: item.movieId,
                rentalDays
            };
        }

        return item;
    });

    await jsonServerClient.patch(
        `/carts/${cart.id}`,
        {
            items: updatedItems
        }
    );

    // Return the enriched cart so the frontend
    // receives movie details, line totals and
    // the recalculated cart total.
    return await getCartService(userId);
};
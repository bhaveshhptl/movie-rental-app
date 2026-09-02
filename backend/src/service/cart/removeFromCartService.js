import { jsonServerClient } from "../../config/jsonServer.js";

import { findCartByUserId } from "./findCartByUserId.js";

export const removeFromCartService = async (userId, movieId) => {
    const cart = await findCartByUserId(userId);

    const itemExists = cart?.items?.some(
        (item) => String(item.movieId) === movieId
    );

    if (!itemExists) {
        const error = new Error("Movie is not in the cart");
        error.statusCode = 404;

        throw error;
    }

    const updatedItems = cart.items.filter(
        (item) => String(item.movieId) !== movieId
    );

    await jsonServerClient.patch(`/carts/${cart.id}`, {
        items: updatedItems
    });
};
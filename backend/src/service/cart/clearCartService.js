import { jsonServerClient } from "../../config/jsonServer.js";

import { findCartByUserId } from "./findCartByUserId.js";

export const clearCartService = async (userId) => {
    const cart = await findCartByUserId(userId);

    // Clearing a non-existent cart is considered successful.
    if (!cart) {
        return;
    }

    await jsonServerClient.patch(`/carts/${cart.id}`, {
        items: []
    });
};
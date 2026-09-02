import { jsonServerClient } from "../../config/jsonServer.js";

export const findCartByUserId = async (userId) => {
    const response = await jsonServerClient.get(
        `/carts?userId=${encodeURIComponent(userId)}`
    );
    return response.data[0];
};
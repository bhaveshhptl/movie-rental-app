import { jsonServerClient } from "../../config/jsonServer.js";

export const getRentalHistoryService = async (userId) => {
    try {
        const response = await jsonServerClient.get(
            `/rentals?userId=${encodeURIComponent(userId)}`
        );

        return response.data;
    } catch (error) {
        const err = new Error(
            "Unable to retrieve rental history",
            {
                cause: error
            }
        );

        err.statusCode = error.response?.status || 500;

        throw err;
    }
};
import { jsonServerClient } from "../../config/jsonServer.js";

export const makeAdmin = async (userId) => {
    let user;

    try {
        const response = await jsonServerClient.get(
            `/users/${userId}`
        );

        user = response.data;
    } catch (error) {
        if (error.response?.status === 404) {
            const err = new Error("User not found");
            err.statusCode = 404;
            throw err;
        }

        throw new Error("Unable to find user", {
            cause: error
        });
    }

    if (user.role === "super_admin") {
        const error = new Error(
            "A super admin cannot be promoted to admin"
        );

        error.statusCode = 400;
        throw error;
    }

    if (user.role === "admin") {
        const error = new Error(
            "User is already an admin"
        );

        error.statusCode = 409;
        throw error;
    }

    const response = await jsonServerClient.patch(
        `/users/${userId}`,
        {
            role: "admin"
        }
    );

    return response.data;
};
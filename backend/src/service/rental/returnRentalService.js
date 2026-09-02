import { jsonServerClient } from "../../config/jsonServer.js";

export const returnRentalService = async (rentalId) => {
    let rental;

    try {
        const response = await jsonServerClient.get(
            `/rentals/${rentalId}`
        );

        rental = response.data;
    } catch (error) {
        if (error.response?.status === 404) {
            const err = new Error("Rental not found");
            err.statusCode = 404;
            throw err;
        }

        throw new Error(
            "Unable to retrieve rental",
            { cause: error }
        );
    }

    if (rental.status === "returned") {
        const error = new Error(
            "Rental has already been returned"
        );

        error.statusCode = 409;

        throw error;
    }

    for (const item of rental.items) {
        const response = await jsonServerClient.get(
            `/movies/${item.movieId}`
        );

        const movie = response.data;

        await jsonServerClient.patch(
            `/movies/${movie.id}`,
            {
                availableCopies:
                    movie.availableCopies + 1
            }
        );
    }

    const response = await jsonServerClient.patch(
        `/rentals/${rental.id}`,
        {
            status: "returned",
            returnedDate: new Date().toISOString()
        }
    );

    return response.data;
};
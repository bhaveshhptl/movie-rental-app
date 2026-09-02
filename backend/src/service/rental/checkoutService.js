import { jsonServerClient } from "../../config/jsonServer.js";
import { findCartByUserId } from "../cart/findCartByUserId.js";

import {
    calculateCartTotal,
    calculateLineTotal,
    calculateDueDate
} from "../../utils/rentCalculator.js";

export const checkoutService = async (userId) => {
    const cart = await findCartByUserId(userId);

    if (!cart || !cart.items || cart.items.length === 0) {
        const error = new Error(
            "Cart is empty. Please add movies before checking out."
        );

        error.statusCode = 400;

        throw error;
    }

    const moviesResponse =
        await jsonServerClient.get("/movies");

    const moviesMap = new Map(
        moviesResponse.data.map((movie) => [
            String(movie.id),
            movie
        ])
    );

    const rentalDate = new Date().toISOString();

    const rentalItems = [];

    /*
     * First validate EVERYTHING.
     *
     * We don't want to update movie #1's inventory
     * and then discover movie #2 is unavailable.
     */
    for (const item of cart.items) {
        const movie = moviesMap.get(
            String(item.movieId)
        );

        if (!movie) {
            const error = new Error(
                `Movie with ID ${item.movieId} not found.`
            );

            error.statusCode = 404;

            throw error;
        }

        if (movie.availableCopies <= 0) {
            const error = new Error(
                `${movie.title} is currently unavailable.`
            );

            error.statusCode = 409;

            throw error;
        }
    }

    /*
     * Now create rental items and update inventory.
     */
    for (const item of cart.items) {
        const movie = moviesMap.get(
            String(item.movieId)
        );

        const lineTotal = calculateLineTotal(
            movie.dailyRate,
            item.rentalDays
        );

        const dueDate = calculateDueDate(
            item.rentalDays,
            new Date(rentalDate)
        );

        rentalItems.push({
            movieId: item.movieId,
            movieTitle: movie.title,
            rentalDays: item.rentalDays,
            dailyRate: movie.dailyRate,
            lineTotal,
            dueDate
        });

        await jsonServerClient.patch(
            `/movies/${movie.id}`,
            {
                availableCopies:
                    movie.availableCopies - 1
            }
        );

        movie.availableCopies -= 1;
    }

    const totalCost =
        calculateCartTotal(rentalItems);

    const newRental = {
        userId,
        items: rentalItems,
        totalCost,
        rentalDate,
        status: "active"
    };

    const rentalResponse =
        await jsonServerClient.post(
            "/rentals",
            newRental
        );

    await jsonServerClient.patch(
        `/carts/${cart.id}`,
        {
            items: []
        }
    );

    return rentalResponse.data;
};
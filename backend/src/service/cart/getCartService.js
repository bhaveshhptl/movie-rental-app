import { jsonServerClient } from "../../config/jsonServer.js";
import {
    calculateCartTotal,
    calculateLineTotal,
    calculateDueDate
} from "../../utils/rentCalculator.js";

import { findCartByUserId } from "./findCartByUserId.js";

export const getCartService = async (userId) => {
    const cart = await findCartByUserId(userId);

    if (!cart) {
        return {
            items: [],
            totalCost: 0
        };
    }

    const moviesResponse = await jsonServerClient.get("/movies");

    const movies = new Map(
        moviesResponse.data.map((movie) => [
            String(movie.id),
            movie
        ])
    );

    const items = cart.items.map((item) => {
        const movie = movies.get(String(item.movieId));

        return {
            movieId: item.movieId,
            rentalDays: item.rentalDays,
            movie: movie || null,

            lineTotal: movie
                ? calculateLineTotal(
                    movie.dailyRate,
                    item.rentalDays
                )
                : 0,

            dueDate: calculateDueDate(item.rentalDays)
        };
    });

    const totalCost = calculateCartTotal(items);

    return {
        id: cart.id,
        items,
        totalCost
    };
};
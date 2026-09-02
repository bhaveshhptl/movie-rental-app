import { addToCartService } from "../../service/cart/addToCartService.js";

export const addToCart = async (req, res, next) => {
    try {
        const movieId = String(req.body.movieId || "").trim();
        const rentalDays = Number(req.body.rentalDays);

        const cart = await addToCartService(
            req.user.id,
            movieId,
            rentalDays
        );

        return res.status(201).json({
            success: true,
            message: "Movie added to cart",
            cart
        });
    } catch (error) {
        next(error);
    }
};
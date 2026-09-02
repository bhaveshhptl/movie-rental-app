import { updateCartItemService } from "../../service/cart/updateCartItemService.js";

export const updateCartItem = async (req, res, next) => {
    try {
        const movieId = String(req.params.movieId || "").trim();
        const rentalDays = Number(req.body.rentalDays);

        const cart = await updateCartItemService(
            req.user.id,
            movieId,
            rentalDays
        );

        return res.status(200).json({
            success: true,
            message: "Rental days updated",
            cart
        });
    } catch (error) {
        next(error);
    }
};
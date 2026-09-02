import { removeFromCartService } from "../../service/cart/removeFromCartService.js";

export const removeFromCart = async (req, res, next) => {
    try {
        const movieId = String(req.params.movieId || "").trim();

        await removeFromCartService(
            req.user.id,
            movieId
        );

        return res.status(200).json({
            success: true,
            message: "Movie removed from cart"
        });
    } catch (error) {
        next(error);
    }
};
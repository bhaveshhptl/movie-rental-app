import { getCartService } from "../../service/cart/getCartService.js";

export const getCart = async (req, res, next) => {
    try {
        const cart = await getCartService(req.user.id);

        return res.status(200).json({
            success: true,
            cart
        });
    } catch (error) {
        next(error);
    }
};
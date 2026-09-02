import { clearCartService } from "../../service/cart/clearCartService.js";

export const clearCart = async (req, res, next) => {
    try {
        await clearCartService(req.user.id);

        return res.status(200).json({
            success: true,
            message: "Cart cleared"
        });
    } catch (error) {
        next(error);
    }
};
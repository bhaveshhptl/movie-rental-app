import { checkoutService } from "../../service/rental/index.js";

export const checkout = async (req, res) => {
    try {
        const userId = req.user.id;
        const rental = await checkoutService(userId);

        return res.status(201).json({
            success: true,
            message: "Checkout successful",
            rental
        });

    } catch (error) {
        if (error.status) {
            return res.status(error.status).json({
                success: false,
                message: error.message
            });
        }
        
        console.error("Unable to process checkout:", error.message);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};
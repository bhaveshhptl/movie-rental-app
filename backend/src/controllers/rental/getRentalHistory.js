import { getRentalHistoryService } from "../../service/rental/index.js";

export const getRentalHistory = async (req, res) => {
    try {
        const userId = req.user.id;
        const rentals = await getRentalHistoryService(userId);

        return res.status(200).json({
            success: true,
            count: rentals.length,
            rentals
        });
        
    } catch (error) {
        console.error("Unable to retrieve rental history:", error.message);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};
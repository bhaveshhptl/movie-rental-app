import {
    returnRentalService
} from "../../service/rental/index.js";

export const returnRental = async (
    req,
    res,
    next
) => {
    try {
        const { rentalId } = req.params;

        const rental =
            await returnRentalService(rentalId);

        return res.status(200).json({
            success: true,
            message: "Rental returned successfully",
            rental
        });
    } catch (error) {
        next(error);
    }
};
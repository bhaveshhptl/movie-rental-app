import { jsonServerClient } from "../../config/jsonServer.js"; 
export const imposePenalty = async (rentalId, penaltyAmount) => {

    try {

        const rentalRes = await jsonServerClient.get(`/rentals/${rentalId}`);

        const rental = rentalRes.data;



        const updatedPenalty = (rental.penalty || 0) + Number(penaltyAmount);

        const updatedTotal = rental.totalCost + Number(penaltyAmount);



        const updateRes = await jsonServerClient.patch(`/rentals/${rentalId}`, {

            penalty: updatedPenalty,

            totalCost: updatedTotal,

            status: "overdue"

        });



        return updateRes.data;

    } catch (error) {

        const err = new Error(

            error.response?.status === 404

                ? "Rental not found"

                : "Unable to impose penalty"

        );

        err.statusCode = error.response?.status || 500;

        throw err;

    }

};
import { jsonServerClient } from "../../config/jsonServer.js"; 
export const viewDailyTransactions = async (dateString) => {

    try {

        const response = await jsonServerClient.get("/rentals");

        return response.data.filter((rental) =>

            rental.rentalDate.startsWith(dateString)

        );

    } catch (error) {

        const err = new Error("Unable to fetch transactions");

        err.statusCode = 500;

        throw err;

    }

};
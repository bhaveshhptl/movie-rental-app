import { jsonServerClient } from "../../config/jsonServer.js"; export const viewOverdueRentals = async () => {

    try {

        const response = await jsonServerClient.get("/rentals");

        const today = new Date().toISOString();


        return response.data.filter(

            (rental) => rental.dueDate < today && rental.status !== "completed"

        );

    } catch (error) {

        const err = new Error("Unable to fetch overdue rentals");

        err.statusCode = 500;

        throw err;

    }

};
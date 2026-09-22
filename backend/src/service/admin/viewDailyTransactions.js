import { jsonServerClient } from "../../config/jsonServer.js";

export const viewDailyTransactions = async (
  dateString
) => {
  // ==================================================
  // Validate YYYY-MM-DD
  // ==================================================

  if (
    !/^\d{4}-\d{2}-\d{2}$/.test(
      dateString
    )
  ) {
    const error = new Error(
      "Date must be in YYYY-MM-DD format"
    );

    error.statusCode = 400;

    throw error;
  }

  try {
    const response =
      await jsonServerClient.get("/rentals");

    return response.data.filter(
      (rental) =>
        rental.rentalDate &&
        rental.rentalDate.startsWith(
          dateString
        )
    );
  } catch (error) {
    if (error.statusCode) {
      throw error;
    }

    const err = new Error(
      "Unable to fetch transactions"
    );

    err.statusCode = 500;

    throw err;
  }
};
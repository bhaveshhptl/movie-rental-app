import { jsonServerClient } from "../../config/jsonServer.js";

export const markRentalReturned = async (
  rentalId
) => {
  let rental;

  // ==================================================
  // Find rental
  // ==================================================

  try {
    const response =
      await jsonServerClient.get(
        `/rentals/${rentalId}`
      );

    rental = response.data;
  } catch (error) {
    if (error.response?.status === 404) {
      const err = new Error(
        "Rental not found"
      );

      err.statusCode = 404;

      throw err;
    }

    const err = new Error(
      "Unable to retrieve rental"
    );

    err.statusCode = 500;

    throw err;
  }

  // ==================================================
  // Already returned
  // ==================================================

  if (rental.status === "returned") {
    const error = new Error(
      "Rental has already been returned"
    );

    error.statusCode = 409;

    throw error;
  }

  // ==================================================
  // Only active / overdue rentals can be returned
  // ==================================================

  if (
    rental.status !== "active" &&
    rental.status !== "overdue"
  ) {
    const error = new Error(
      "Rental cannot be marked as returned"
    );

    error.statusCode = 400;

    throw error;
  }

  // ==================================================
  // Mark returned
  // ==================================================

  try {
    const response =
      await jsonServerClient.patch(
        `/rentals/${rentalId}`,
        {
          status: "returned",
          returnedAt:
            new Date().toISOString(),
          updatedAt:
            new Date().toISOString(),
        }
      );

    return response.data;
  } catch (error) {
    const err = new Error(
      "Unable to mark rental as returned"
    );

    err.statusCode = 500;

    throw err;
  }
};
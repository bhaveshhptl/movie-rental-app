import { jsonServerClient } from "../../config/jsonServer.js";

export const viewAllRentals = async () => {
  try {
    const response =
      await jsonServerClient.get("/rentals");

    return response.data;
  } catch (error) {
    const err = new Error(
      "Unable to fetch rental history"
    );

    err.statusCode = 500;

    throw err;
  }
};
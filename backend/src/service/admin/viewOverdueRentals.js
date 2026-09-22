import { jsonServerClient } from "../../config/jsonServer.js";

export const viewOverdueRentals = async () => {
  try {
    const [rentalsResponse, usersResponse] = await Promise.all([
      jsonServerClient.get("/rentals"),
      jsonServerClient.get("/users"),
    ]);

    const now = new Date();
    const users = new Map(
      usersResponse.data.map((user) => [
        String(user.id),
        user.name,
      ])
    );

    return rentalsResponse.data
      .filter((rental) => rental.status !== "returned")
      .flatMap((rental) =>
        (rental.items || [])
          .filter((item) => item.dueDate && new Date(item.dueDate) < now)
          .map((item) => ({
            ...item,
            rentalId: rental.id,
            userId: rental.userId,
            userName: users.get(String(rental.userId)) || rental.userId,
            rentalDate: rental.rentalDate,
            rentalStatus: rental.status,
          }))
      );
  } catch (error) {
    const err = new Error(
      "Unable to fetch overdue rentals"
    );

    err.statusCode = 500;

    throw err;
  }
};

import { jsonServerClient } from "../../config/jsonServer.js";

export const viewAllUsers = async () => {
  try {
    const response =
      await jsonServerClient.get("/users");

    return response.data.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role || "user",
      createdAt: user.createdAt,
    }));
  } catch (error) {
    const err = new Error(
      "Unable to fetch users"
    );

    err.statusCode = 500;

    throw err;
  }
};
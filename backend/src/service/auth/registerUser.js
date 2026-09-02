import {
  hashPassword,
  comparePassword
} from "../../utils/password.js";

import { jsonServerClient } from "../../config/jsonServer.js";

export const registerUser = async ({ name, email, password }) => {
  const normalizedEmail = email.trim().toLowerCase();

  const existingUsers = await jsonServerClient.get(
    `/users?email=${encodeURIComponent(normalizedEmail)}`
  );

  if (existingUsers.data.length > 0) {
    const error = new Error("A user with this email already exists");
    error.statusCode = 409;
    throw error;
  }

  const passwordHash = await hashPassword(password);

  const newUser = {
    name: name.trim(),
    email: normalizedEmail,
    passwordHash,

    // Registration ALWAYS creates a normal user.
    role: "user",

    refreshToken: null,
    createdAt: new Date().toISOString()
  };

  const response = await jsonServerClient.post("/users", newUser);

  return response.data;
};
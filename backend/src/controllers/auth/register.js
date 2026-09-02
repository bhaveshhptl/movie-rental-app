import { registerUser } from "../../service/auth/registerUser.js";

export const register = async (req, res, next) => {
  try {
    const createdUser = await registerUser(req.body);

    return res.status(201).json({
      success: true,
      message: "Registration successful",
      user: {
        id: createdUser.id,
        name: createdUser.name,
        email: createdUser.email,
        role: createdUser.role,
        createdAt: createdUser.createdAt
      }
    });
  } catch (error) {
    next(error);
  }
};
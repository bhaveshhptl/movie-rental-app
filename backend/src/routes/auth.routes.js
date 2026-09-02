import express from "express";
import { body } from "express-validator";

import {
  register,
  login,
  logout,
  getCurrentUser,
  refreshToken
} from "../controllers/auth/index.js";

import { authenticate } from "../middleware/authenticate.js";
import { validateRequest } from "../middleware/validateRequest.js";

const authRouter = express.Router();

authRouter.post(
  "/register",
  [
    body("name")
      .trim()
      .notEmpty()
      .withMessage("Name is required")
      .isLength({ min: 2, max: 50 })
      .withMessage("Name must contain between 2 and 50 characters"),

    body("email")
      .trim()
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Enter a valid email address")
      .normalizeEmail(),

    body("password")
      .notEmpty()
      .withMessage("Password is required")
      .isLength({ min: 6 })
      .withMessage("Password must contain at least 6 characters")
  ],
  
  validateRequest,
  register
);

authRouter.post(
  "/login",
  [
    body("email")
      .trim()
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Enter a valid email address")
      .normalizeEmail(),

    body("password")
      .notEmpty()
      .withMessage("Password is required")
  ],
  validateRequest,
  login
);

authRouter.get("/me", authenticate, getCurrentUser);

authRouter.post("/logout", logout);

authRouter.post("/refresh-token", refreshToken);

export { authRouter };

import express from "express";
import { body, param } from "express-validator";

import {
    addToCart,
    clearCart,
    getCart,
    removeFromCart,
    updateCartItem
} from "../controllers/cart/index.js";
import { authenticate } from "../middleware/authenticate.js";
import { validateRequest } from "../middleware/validateRequest.js";

const cartRouter = express.Router();

// Every cart operation requires a logged-in user.
cartRouter.use(authenticate);

cartRouter.get("/", getCart);

cartRouter.post(
    "/",
    [
        body("movieId")
            .trim()
            .notEmpty()
            .withMessage("Movie ID is required"),
        body("rentalDays")
            .isInt({ min: 1 })
            .withMessage("Rental days must be a positive whole number")
            .toInt()
    ],
    validateRequest,
    addToCart
);

cartRouter.patch(
    "/:movieId",
    [
        param("movieId")
            .trim()
            .notEmpty()
            .withMessage("Movie ID is required"),
        body("rentalDays")
            .isInt({ min: 1 })
            .withMessage("Rental days must be a positive whole number")
            .toInt()
    ],
    validateRequest,
    updateCartItem
);

cartRouter.delete(
    "/:movieId",
    [
        param("movieId")
            .trim()
            .notEmpty()
            .withMessage("Movie ID is required")
    ],
    validateRequest,
    removeFromCart
);

cartRouter.delete("/", clearCart);

export { cartRouter };

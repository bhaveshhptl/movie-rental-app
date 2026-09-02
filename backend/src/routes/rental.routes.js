import express from "express";
import { param } from "express-validator";

import {
    checkout,
    getRentalHistory,
    returnRental
} from "../controllers/rental/index.js";

import { authenticate } from "../middleware/authenticate.js";
import { authorize } from "../middleware/authorize.js";
import { validateRequest } from "../middleware/validateRequest.js";

const rentalRouter = express.Router();

rentalRouter.use(authenticate);

rentalRouter.post(
    "/checkout",
    checkout
);

rentalRouter.get(
    "/history",
    getRentalHistory
);

rentalRouter.post(
    "/:rentalId/return",
    [
        param("rentalId")
            .trim()
            .notEmpty()
            .withMessage("Rental ID is required")
    ],
    validateRequest,
    authorize("admin", "super_admin"),
    returnRental
);

export { rentalRouter };
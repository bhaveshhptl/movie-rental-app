import express from "express";
import { param, query } from "express-validator";

import {
    getMovie,
getAllMovies
} from "../controllers/movie/index.js";

import { authenticate } from "../middleware/authenticate.js";
import { validateRequest } from "../middleware/validateRequest.js";

const movieRouter = express.Router();

movieRouter.use(authenticate); 

movieRouter.get(
    "/",
    [
        query("search").optional().trim(),
        query("genre").optional().trim(),
        query("page")
            .optional()
            .isInt({ min: 1 })
            .withMessage("Page must be a positive whole number"),
        query("limit")
            .optional()
            .isInt({ min: 1 })
            .withMessage("Limit must be a positive whole number")
    ],
    validateRequest,
    getAllMovies
);

movieRouter.get(
    "/:id",
    [
        param("id").trim().notEmpty()
    ],
    validateRequest,
    getMovie
);

export { movieRouter };

import express from "express";
import { body, param, query } from "express-validator";

import {
    getMovie,
    getAllMovies,
    createMovie,
    updateMovie,
    deleteMovie
} from "../controllers/movie/index.js";

import { authenticate } from "../middleware/authenticate.js";
import { authorize } from "../middleware/authorize.js";
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

const movieValidation = [
    body("title").trim().notEmpty().withMessage("Title is required"),
    body("genre").trim().notEmpty().withMessage("Genre is required"),
    body("releaseYear").isInt({ min: 1888 }).withMessage("Enter a valid release year").toInt(),
    body("dailyRate").isFloat({ min: 0 }).withMessage("Daily rate must be zero or greater").toFloat(),
    body("copies").isInt({ min: 1 }).withMessage("Copies must be a positive whole number").toInt(),
    body("description").optional().trim(),
    body("posterUrl").optional().trim(),
];

movieRouter.post("/", authorize("admin", "super_admin"), movieValidation, validateRequest, createMovie);
movieRouter.patch("/:id", authorize("admin", "super_admin"), [param("id").trim().notEmpty(), ...movieValidation], validateRequest, updateMovie);
movieRouter.delete("/:id", authorize("admin", "super_admin"), [param("id").trim().notEmpty()], validateRequest, deleteMovie);

movieRouter.get(
    "/:id",
    [
        param("id").trim().notEmpty()
    ],
    validateRequest,
    getMovie
);

export { movieRouter };

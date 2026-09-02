import { validationResult } from "express-validator";

export const validateRequest = (req, res, next) => {
    const validationErrors = validationResult(req);

    if (!validationErrors.isEmpty()) {
        const errors = validationErrors.array().map((error) => ({
            field: error.path,
            message: error.msg
        }));

        const error = new Error("Validation failed");

        error.statusCode = 400;
        error.errors = errors;

        return next(error);
    }

    next();
};
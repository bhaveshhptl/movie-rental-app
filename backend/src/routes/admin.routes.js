import express from "express";

import {
    viewAllUsers,
    viewOverdueRentals,
    viewDailyTransactions,
    imposePenalty,
    makeAdmin,
    removeAdmin
} from "../controllers/admin/index.js";

import { authenticate } from "../middleware/authenticate.js";
import { authorize } from "../middleware/authorize.js";

const adminRouter = express.Router();

adminRouter.use(authenticate);

// ==========================================
// ADMIN + SUPER ADMIN
// ==========================================

adminRouter.use(
    authorize("admin", "super_admin")
);

adminRouter.get(
    "/users",
    viewAllUsers
);

adminRouter.get(
    "/rentals/overdue",
    viewOverdueRentals
);

adminRouter.get(
    "/transactions/daily",
    viewDailyTransactions
);

adminRouter.post(
    "/rentals/:rentalId/penalty",
    imposePenalty
);

// ==========================================
// SUPER ADMIN ONLY
// ==========================================

adminRouter.post(
    "/users/:userId/admin",
    authorize("super_admin"),
    makeAdmin
);

adminRouter.delete(
    "/users/:userId/admin",
    authorize("super_admin"),
    removeAdmin
);

export { adminRouter };
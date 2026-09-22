import express from "express";

import {
  viewAllUsers,
  viewAllRentals,
  viewOverdueRentals,
  viewActiveMovies,
  viewDailyTransactions,
  imposePenalty,
  markRentalReturned,
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
    "/rentals/active",
    viewActiveMovies
);

adminRouter.get(
    "/transactions/daily",
    viewDailyTransactions
);

adminRouter.post(
    "/rentals/:rentalId/penalty",
    imposePenalty
);

adminRouter.get(
  "/rentals",
  viewAllRentals
);

adminRouter.patch(
  "/rentals/:rentalId/return",
  markRentalReturned
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

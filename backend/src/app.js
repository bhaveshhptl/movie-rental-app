import express from "express";
import cors from "cors";
import { config } from "./config/env.js";
import { authRouter } from "./routes/auth.routes.js";
import { movieRouter } from "./routes/movie.routes.js";
import { cartRouter } from "./routes/cart.routes.js";
import { rentalRouter } from "./routes/rental.routes.js";
import { adminRouter } from "./routes/admin.routes.js";

const app = express();

// Allow the React frontend to call this backend
app.use(
  cors({
    origin: config.clientUrl
  })
);

// Convert incoming JSON request bodies into JavaScript objects
app.use(express.json());

// Temporary route used to check whether Express is running
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Rental Movie Library API is running"
  });
});

app.use("/api/auth", authRouter);
app.use("/api/movies", movieRouter);
app.use("/api/cart", cartRouter);
app.use("/api/rentals", rentalRouter);
app.use("/api/admin", adminRouter);

// =====================================================
// GLOBAL ERROR HANDLER
// =====================================================

app.use((error, req, res, next) => {
  console.error(
    `${req.method} ${req.originalUrl}`,
    error
  );

  const statusCode =
    error.statusCode || 500;

  return res.status(statusCode).json({
    success: false,
    message:
      statusCode === 500
        ? "Internal Server Error"
        : error.message
  });
});


export { app };

// Error handler 


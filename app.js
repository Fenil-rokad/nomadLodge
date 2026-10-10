import express from "express";
import path from "path";
import { fileURLToPath } from "url";

import methodOverride from "method-override";
import ejsMate from "ejs-mate";

import listingRouter from "./routes/listingRoutes.js";
import reviewRouter from "./routes/reviewRoutes.js";

import { AppError } from "./utils/appError.js";

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// View engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.engine("ejs", ejsMate);

// Middleware
app.use(express.static(path.join(__dirname, "public")));

app.use(
  express.urlencoded({  
    extended: true,
  }),
);

app.use(methodOverride("_method"));

// Home route
app.get("/", (req, res) => {
  res.render("home/home");
});

// Register routers
app.use("/listings", listingRouter);
app.use("/listings", reviewRouter);

// Page not found
app.all("/{*splat}", (req, res, next) => {
  next(new AppError("Page not found.", 404));
});

// Error handling middleware
app.use((err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  // Invalid MongoDB ObjectId
  if (err.name === "CastError") {
    err = new AppError("Invalid ID.", 400);
  }

  // Mongoose validation error
  if (err.name === "ValidationError") {
    const message = Object.values(err.errors)
      .map((error) => error.message)
      .join(", ");

    err = new AppError(message, 400);
  }

  // Duplicate key error
  if (err.code === 11000) {
    const field = err.keyValue ? Object.keys(err.keyValue)[0] : "Field";

    err = new AppError(`${field} already exists.`, 409);
  }

  const statusCode = err.statusCode || 500;

  const message = statusCode === 500 ? "Something went wrong." : err.message;

  if (statusCode === 500) {
    console.error(err);
  }

  res.status(statusCode).render("errors/error", {
    statusCode,
    message,
  });
});

export default app;

import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { Listing } from "./models/listing.js";
import path from "path";
import { fileURLToPath } from "url";
import methodOverride from "method-override";
import ejsMate from "ejs-mate";
import { AppError } from "./utils/appError.js";
import { listingSchema } from "./validateSchema.js";

dotenv.config();

const app = express();

const port = 8080;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));

app.use(express.urlencoded({ extended: true }));

app.use(methodOverride("_method"));

app.engine("ejs", ejsMate);

async function Main() {
  try {
    //Establishing a connection
    await mongoose.connect(process.env.MONGO_URL);
    console.log(`DataBase connected Succesfully......`);
  } catch (err) {
    console.error(`Connection failed.. : ${err}`);
  }
}

Main();

//server side validation middleware
const validateListing = (req, res, next) => {
  const { error } = listingSchema.validate(req.body);

  if (error) {
    return next(new AppError(error.details[0].message, 400));
  }
  next();
};

//root path
app.get("/", (req, res) => {
  res.render(`home/home`);
});

//show all listings
app.get("/listings", async (req, res) => {
  const allListings = await Listing.find();

  if (!allListings) {
    throw new AppError("Listings not found...", 404);
  }

  // console.log(allListings);
  res.render("listings/allListings", { allListings });
});

//new listing form
app.get("/listings/new", (req, res) => {
  res.render("listings/new");
});

//create route
app.post("/listings", validateListing, async (req, res) => {
  const listing = req.body;
  const newListing = await Listing.create(listing);
  console.log(newListing);
  res.redirect("/listings");
});

//show route
app.get("/listings/:id", async (req, res) => {
  const id = req.params.id;
  const listing = await Listing.findById(id);

  if (!listing) {
    throw new AppError("Listing not found...", 500);
  }

  const price = listing.price.toLocaleString("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  });
  res.render("listings/show", { listing, price });
});

//edit form route
app.get("/listings/:id/edit", async (req, res) => {
  const id = req.params.id;
  const listing = await Listing.findById(id);

  if (!listing) {
    throw new AppError("Listing not found...", 500);
  }

  res.render(`listings/edit`, { listing });
});

//update route
app.put("/listings/:id",validateListing, async (req, res) => {
  const id = req.params.id;
  const listing = req.body;
  const updatedListing = await Listing.findByIdAndUpdate(id, listing, {
    returnDocument: "after",
  });
  console.log(updatedListing);
  res.redirect(`/listings/${id}`);
});

//delete route
app.delete("/listings/:id", async (req, res) => {
  const id = req.params.id;
  const deletedListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
  res.redirect(`/listings`);
});

app.all("/{*splat}", (req, res, next) => {
  next(new AppError("Page not found...", 404));
});

//Error handling middleware
app.use((err, req, res, next) => {
  
  // Mongoose invalid ObjectId
  if (err.name === "CastError") {
    err = new AppError("Invalid listing ID", 400);
  }

  // Mongoose validation Error
  if (err.name === "ValidationError") {
    const message = Object.values(err.errors)
      .map((error) => error.message)
      .join(", ");

    err = new AppError(message, 400);
  }

  // MongoDB duplicate key error
  if (err.code === 11000) {
    const field = err.keyValue ? Object.keys(err.keyValue)[0] : "Field";

    err = new AppError(`${field} already exists`, 409);
  }

  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error...";
  res.status(statusCode).render(`errors/error`, { statusCode, message });
});

app.listen(port, () => {
  console.log(`App is listening on port localhost:${port}`);
});

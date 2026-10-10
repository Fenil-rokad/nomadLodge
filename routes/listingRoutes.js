import express from "express";
import { validateListing } from "../middleware/validate.js";

import { Listing } from "../models/listing.js";
import { AppError } from "../utils/appError.js";



import { Review } from "../models/review.js";

const router = express.Router();

//show all listings
router.get("/", async (req, res) => {
  const allListings = await Listing.find();

  if (allListings.length === 0) {
    return res.render(`listings/noListings`);
  }

  // console.log(allListings);
  res.render("listings/allListings", { allListings });
});

//new listing form
router.get("/new", (req, res) => {
  res.render("listings/new");
});

//create route
router.post("/listings", validateListing, async (req, res) => {
  const listing = req.validateListing;
  const newListing = await Listing.create(listing);
  console.log(newListing);
  res.redirect("/listings");
});


//show route
router.get("/:id", async (req, res) => {
  const id = req.params.id;
  const listing = await Listing.findById(id);

  if (!listing) {
    throw new AppError("Listing not found...", 404);
  }

  const reviews = await Review.find({
    listing: id,
  });
  // console.log(reviews);

  res.render("listings/show", { listing, reviews });
});

//edit form route
router.get("/:id/edit", async (req, res) => {
  const id = req.params.id;
  const listing = await Listing.findById(id);

  if (!listing) {
    throw new AppError("Listing not found...", 404);
  }

  res.render(`listings/edit`, { listing });
});

//update route
router.put("/:id", validateListing, async (req, res) => {
  const id = req.params.id;
  const listing = req.validateListing;
  const updatedListing = await Listing.findByIdAndUpdate(id, listing, {
    runValidators: true,
    returnDocument: "after",
  });
  // console.log(updatedListing);
  if (!updatedListing) {
    throw new AppError("Listing not found..", 404);
  }
  res.redirect(`/listings/${id}`);
});

//delete route
router.delete("/:id", async (req, res) => {
  const id = req.params.id;
  const deletedListing = await Listing.findByIdAndDelete(id);
  // console.log(deletedListing);
  if (!deletedListing) {
    throw new AppError("Listing not found...", 404);
  }
  res.redirect(`/listings`);
});

export default router;
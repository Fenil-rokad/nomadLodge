import express from "express";
import { validateReview } from "../middleware/validate.js";

import { Listing } from "../models/listing.js";
import { Review } from "../models/review.js";

import { AppError } from "../utils/appError.js";


const router = express.Router();

//add a review
router.post("/:id/review", validateReview, async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    throw new AppError("Listing not found.", 404);
  }
  const reviewData = { ...req.validateReview, listing: req.params.id };
  const review = await Review.create(reviewData);
  console.log(review);
  res.redirect(`/listings/${req.params.id}`);
});

//deleting review
router.delete("/:id/review/:review_id", async (req, res) => {
  const { id, review_id } = req.params;
  const deletedReview = await Review.findOneAndDelete({
    _id: review_id,
    listing: id,
  });

  if (!deletedReview) {
    throw new AppError("Review not found.", 404);
  }

  console.log(deletedReview);
  res.redirect(`/listings/${id}`);
});

export default router;

import { listingSchema, reviewSchema } from "../public/JS/validateSchema.js";
import { AppError } from "../utils/appError.js";

// Validate listing data
const validateListing = (req, res, next) => {
  const { error, value } = listingSchema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true,
  });

  if (error) {
    const message = error.details.map((detail) => detail.message).join(", ");

    return next(new AppError(message, 400));
  }

  req.validateListing = value;

  next();
};

// Validate review data
const validateReview = (req, res, next) => {
  const { error, value } = reviewSchema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true,
  });

  if (error) {
    const message = error.details.map((detail) => detail.message).join(", ");

    return next(new AppError(message, 400));
  }

  req.validateReview = value;

  next();
};

export { validateListing, validateReview };

import Joi from "joi";

// Listing validation
const listingSchema = Joi.object({
  title: Joi.string().trim().required(),

  description: Joi.string().trim().required(),

  image: Joi.string().trim().uri().allow("", null).required(),

  price: Joi.number().min(0).required(),

  location: Joi.string().trim().required(),

  country: Joi.string().trim().required(),
});

// Review validation
const reviewSchema = Joi.object({
  comment: Joi.string().trim().required(),

  rating: Joi.number().integer().min(1).max(5).required(),
});

export { listingSchema, reviewSchema };

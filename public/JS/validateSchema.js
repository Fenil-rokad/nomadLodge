import Joi from "joi";

//validating req.body object
const listingSchema = Joi.object({
    title: Joi.string().trim().required(),
    description: Joi.string().trim().required(),
    image: Joi.string().uri().trim().allow("", null),
    price: Joi.number().min(0).required(),
    location: Joi.string().trim().required(),
    country: Joi.string().trim().required(),
});

const reviewSchema = Joi.object({
    comment: Joi.string().trim().required(),
    rating: Joi.number().min(1).max(5).required()
});

export { listingSchema, reviewSchema };

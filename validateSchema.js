import Joi from "joi";

const listingSchema = Joi.object({
    title: Joi.string().trim().required(),
    description: Joi.string().trim().required(),
    image: Joi.string().uri().trim().allow("", null),
    price: Joi.number().min(0).required(),
    location: Joi.string().trim().required(),
    country: Joi.string().trim().required(),
});

export { listingSchema };

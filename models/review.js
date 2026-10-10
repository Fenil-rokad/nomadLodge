import mongoose from "mongoose";
import { Schema } from "mongoose";

const reviewSchema = new Schema(
    {
        comment: {
            type: String,
            required: true
        },
        rating: {
            type: Number,
            min: 1,
            max: 5,
            required: true
        },
        listing: {
            type: Schema.Types.ObjectId,
            ref: `listing`,
            required: true
        }
    },
    {
        timestamps: true
    }
);

export const Review =  mongoose.model("Review", reviewSchema);
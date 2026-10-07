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
            max: 5
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

export default mongoose.model("Review", reviewSchema);
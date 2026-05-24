import mongoose, { Schema, models, model } from "mongoose";

const TestimonialSchema = new Schema(
  {
    name: { type: String, required: true },
    place: { type: String },
    quote: { type: String, required: true },
    rating: { type: Number, default: 5 },
    featured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default models.Testimonial || model("Testimonial", TestimonialSchema);

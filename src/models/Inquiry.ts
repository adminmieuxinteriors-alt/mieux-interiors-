import mongoose, { Schema, models, model } from "mongoose";

const InquirySchema = new Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String },
    projectType: {
      type: String,
      enum: ["home", "office", "interior"],
      required: true,
    },
    location: { type: String, required: true },
    budget: { type: String },
    message: { type: String, required: true },
    status: {
      type: String,
      enum: ["new", "contacted", "closed"],
      default: "new",
    },
  },
  { timestamps: true }
);

export default models.Inquiry || model("Inquiry", InquirySchema);

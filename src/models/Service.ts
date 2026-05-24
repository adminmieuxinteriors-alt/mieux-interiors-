import mongoose, { Schema, models, model } from "mongoose";

const ServiceSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    coverImage: { type: String, required: false },
    media: [
      {
        url: { type: String, required: true },
        type: { type: String, enum: ["image", "video"], default: "image" },
      },
    ],
    linkUrl: { type: String, default: "/services" },
    order: { type: Number, default: 0 },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

if (process.env.NODE_ENV === "development" && models.Service) {
  delete (models as any).Service;
}

export default models.Service || model("Service", ServiceSchema);

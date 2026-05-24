import mongoose, { Schema, models, model } from "mongoose";

const ProjectSchema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    category: {
      type: String,
      enum: ["home", "office", "interior"],
      required: true,
    },
    location: { type: String, required: true },
    shortDescription: { type: String, required: true },
    fullDescription: { type: String, required: true },
    coverImage: { type: String, required: false },
    media: [
      {
        url: { type: String, required: true },
        type: { type: String, enum: ["image", "video"], default: "image" },
      },
    ],
    gallery: [{ type: String }],
    year: { type: Number },
    area: { type: String },
    status: {
      type: String,
      enum: ["draft", "published", "featured"],
      default: "draft",
    },
    styleTags: [{ type: String }],
  },
  { timestamps: true }
);

if (process.env.NODE_ENV === "development" && models.Project) {
  delete (models as any).Project;
}

export default models.Project || model("Project", ProjectSchema);

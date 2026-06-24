import mongoose, { Schema, models, model } from "mongoose";

const SettingSchema = new Schema(
  {
    heroBgImage: { type: String, required: true },
  },
  { timestamps: true }
);

export default models.Setting || model("Setting", SettingSchema);

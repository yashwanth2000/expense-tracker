import mongoose from "mongoose";

const UserSettingsSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  currency: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export const UserSettings =
  mongoose.models.UserSettings ||
  mongoose.model("UserSettings", UserSettingsSchema);

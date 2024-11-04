// models/MonthHistory.js
import mongoose from "mongoose";

const MonthHistorySchema = new mongoose.Schema({
  userId: { type: String, required: true },
  day: { type: Number, required: true },
  month: { type: Number, required: true },
  year: { type: Number, required: true },
  income: { type: Number, default: 0 },
  expense: { type: Number, default: 0 },
});

// Compound index for unique monthly records per user
MonthHistorySchema.index(
  { userId: 1, year: 1, month: 1, day: 1 },
  { unique: true }
);

export const MonthHistory =
  mongoose.models.MonthHistory ||
  mongoose.model("MonthHistory", MonthHistorySchema);

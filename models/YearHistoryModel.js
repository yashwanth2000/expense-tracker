import mongoose from "mongoose";

const YearHistorySchema = new mongoose.Schema({
  userId: { type: String, required: true },
  month: { type: Number, required: true },
  year: { type: Number, required: true },
  income: { type: Number, default: 0 },
  expense: { type: Number, default: 0 },
});

// Compound index for unique yearly records per user
YearHistorySchema.index({ userId: 1, year: 1, month: 1 }, { unique: true });

export const YearHistory =
  mongoose.models.YearHistory ||
  mongoose.model("YearHistory", YearHistorySchema);

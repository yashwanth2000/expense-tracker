import mongoose from "mongoose";

const TransactionSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  amount: { type: Number, required: true },
  type: { type: String, enum: ["income", "expense"], required: true, default: "income" },
  category: { type: String, required: true },
  categoryIcon: { type: String, required: true },
  description: { type: String },
  date: { type: Date, required: true }, // Stores the exact date and time of the transaction
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Automatically update `updatedAt` on save
TransactionSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

export const Transaction =
  mongoose.models.Transaction ||
  mongoose.model("Transaction", TransactionSchema);

import mongoose from 'mongoose';

const CategorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  icon: { type: String, required: true },
  type: { type: String, enum: ['income', 'expense'], required: true, default: 'income' },
  userId: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

// Compound index for unique categories per user
CategorySchema.index({ name: 1, userId: 1, type: 1 }, { unique: true });

export const Category = mongoose.models.Category || mongoose.model('Category', CategorySchema);
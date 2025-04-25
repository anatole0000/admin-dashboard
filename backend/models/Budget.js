import mongoose from 'mongoose';

const budgetSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  category: { type: String, required: true },
  amount: { type: Number, required: true },
  month: { type: String, required: true }, // Format: "YYYY-MM"
}, { timestamps: true });

export default mongoose.model('Budget', budgetSchema);

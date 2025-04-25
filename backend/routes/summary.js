import express from 'express';
import Expense from '../models/Expense.js';

const router = express.Router();

// Get monthly summary (total spent and top 3 categories)
router.get('/', async (req, res) => {
  const { month } = req.query;  // Expected format: "YYYY-MM"

  try {
    // 1. Calculate total spent for the month
    const totalSpent = await Expense.aggregate([
      { $match: { month: month } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    // 2. Get top 3 categories by spending for the month
    const topCategories = await Expense.aggregate([
      { $match: { month: month } },
      { $group: { _id: '$category', total: { $sum: '$amount' } } },
      { $sort: { total: -1 } },
      { $limit: 3 }
    ]);

    // 3. Send back the summary data
    res.json({
      totalSpent: totalSpent[0]?.total || 0,
      topCategories: topCategories.map(cat => ({
        category: cat._id,
        amount: cat.total
      }))
    });
  } catch (err) {
    console.error('Error fetching monthly summary:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;

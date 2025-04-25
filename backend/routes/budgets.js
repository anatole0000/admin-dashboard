import express from 'express';
import Budget from '../models/Budget.js';
import Expense from '../models/Expense.js';

const router = express.Router();

// Create or update budget for a category
router.post('/', async (req, res) => {
  const { category, amount, month } = req.body;
  const userId = req.session.user?.id;
  if (!userId) return res.status(401).json({ error: 'Not logged in' });

  try {
    const existing = await Budget.findOne({ userId, category, month });
    if (existing) {
      existing.amount = amount;
      await existing.save();
      return res.json({ budget: existing });
    }
    const budget = await Budget.create({ userId, category, amount, month });
    res.status(201).json({ budget });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get budgets + expenses grouped by category
router.get('/', async (req, res) => {
  const userId = req.session.user?.id;
  if (!userId) return res.status(401).json({ error: 'Not logged in' });

  const month = req.query.month; // e.g., '2025-04'
  if (!month) return res.status(400).json({ error: 'Month is required' });

  try {
    const budgets = await Budget.find({ userId, month });
    const expenses = await Expense.find({
      userId,
      createdAt: {
        $gte: new Date(`${month}-01`),
        $lt: new Date(`${month}-31`),
      },
    });

    const spentPerCategory = expenses.reduce((acc, exp) => {
      acc[exp.category] = (acc[exp.category] || 0) + parseFloat(exp.amount);
      return acc;
    }, {});

    const result = budgets.map(b => ({
      category: b.category,
      budgeted: b.amount,
      spent: spentPerCategory[b.category] || 0,
    }));

    res.json({ data: result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Check if user has exceeded budget for a category
router.get('/check', async (req, res) => {
    const { userId, month } = req.query;
  
    try {
      // 1. Get all budgets for the user in the specified month
      const budgets = await Budget.find({ userId, month });
  
      const alerts = [];
  
      for (let budget of budgets) {
        // 2. Get total spending for each category
        const totalSpent = await Expense.aggregate([
          { $match: { userId, category: budget.category, month } },
          { $group: { _id: '$category', total: { $sum: '$amount' } } }
        ]);
  
        const spentAmount = totalSpent[0]?.total || 0;
        const remainingBudget = budget.amount - spentAmount;
  
        // 3. If the user exceeds their budget, create an alert
        if (spentAmount > budget.amount) {
          alerts.push({
            category: budget.category,
            budgeted: budget.amount,
            spent: spentAmount,
            alert: `You have exceeded your budget for ${budget.category}! Spent: $${spentAmount}, Budgeted: $${budget.amount}`
          });
        }
      }
  
      // 4. Return alerts
      res.json({ alerts });
    } catch (err) {
      console.error('Error checking budget:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;

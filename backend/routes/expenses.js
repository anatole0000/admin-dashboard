import express from 'express';
import Expense from '../models/Expense.js';

const router = express.Router();

// Create an expense
router.post('/', async (req, res) => {
  const { amount, category, description } = req.body;
  const userId = req.session.user?.id;
  
  if (!userId) return res.status(401).json({ error: 'Not logged in' });

  try {
    const newExpense = await Expense.create({ userId, amount, category, description });
    res.status(201).json({ expense: newExpense });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all expenses for a user
router.get('/', async (req, res) => {
  const userId = req.session.user?.id;
  if (!userId) return res.status(401).json({ error: 'Not logged in' });

  try {
    const expenses = await Expense.find({ userId });
    res.json({ expenses });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update an expense
router.put('/:id', async (req, res) => {
    const userId = req.session.user?.id;
    if (!userId) return res.status(401).json({ error: 'Not logged in' });
  
    const { amount, category, description } = req.body;
  
    try {
      const updated = await Expense.findOneAndUpdate(
        { _id: req.params.id, userId },
        { amount, category, description },
        { new: true }
      );
      res.json({ expense: updated });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
});

  
// Delete an expense
router.delete('/:id', async (req, res) => {
  try {
    await Expense.findByIdAndDelete(req.params.id);
    res.json({ message: 'Expense deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;

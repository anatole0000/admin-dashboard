import React, { useState, useEffect } from 'react';
import api from '../api'; // Import the api instance from api.js

const ExpenseList = () => {
  const [expenses, setExpenses] = useState([]);
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');

  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({
    amount: '',
    category: '',
    description: '',
  });

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const response = await api.get('/expenses');
      setExpenses(response.data.expenses);
    } catch (err) {
      console.error('Error fetching expenses', err);
    }
  };

  const createExpense = async () => {
    try {
      const newExpense = { amount, category, description };
      await api.post('/expenses', newExpense);
      setAmount('');
      setCategory('');
      setDescription('');
      fetchExpenses();
    } catch (err) {
      console.error('Error creating expense', err);
    }
  };

  const deleteExpense = async (id) => {
    try {
      await api.delete(`/expenses/${id}`);
      fetchExpenses();
    } catch (err) {
      console.error('Error deleting expense', err);
    }
  };

  const startEdit = (expense) => {
    setEditingId(expense._id);
    setEditData({
      amount: expense.amount,
      category: expense.category,
      description: expense.description,
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditData({ amount: '', category: '', description: '' });
  };

  const updateExpense = async (id) => {
    try {
      await api.put(`/expenses/${id}`, editData);
      cancelEdit();
      fetchExpenses();
    } catch (err) {
      console.error('Error updating expense', err);
    }
  };

  return (
    <div>
      <h2>Expenses</h2>

      <div>
        <h3>Add Expense</h3>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Amount"
        />
        <input
          type="text"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="Category"
        />
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
        />
        <button onClick={createExpense}>Add Expense</button>
      </div>

      <ul>
        {expenses.map((expense) => (
          <li key={expense._id}>
            {editingId === expense._id ? (
              <>
                <input
                  type="number"
                  value={editData.amount}
                  onChange={(e) => setEditData({ ...editData, amount: e.target.value })}
                />
                <input
                  type="text"
                  value={editData.category}
                  onChange={(e) => setEditData({ ...editData, category: e.target.value })}
                />
                <input
                  type="text"
                  value={editData.description}
                  onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                />
                <button onClick={() => updateExpense(expense._id)}>Save</button>
                <button onClick={cancelEdit}>Cancel</button>
              </>
            ) : (
              <>
                {expense.category}: ${expense.amount} - {expense.description}
                <button onClick={() => startEdit(expense)}>Edit</button>
                <button onClick={() => deleteExpense(expense._id)}>Delete</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ExpenseList;

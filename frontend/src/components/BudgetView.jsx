import React, { useState, useEffect, useCallback } from 'react';
import api from '../api';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import Alert from './Alert';

const COLORS = ['#ff6961', '#77dd77']; // Red for spent, Green for remaining

const BudgetView = () => {
  const [budgets, setBudgets] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7));
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');
  const userId = "1"; // Replace this with the actual user ID (e.g., from authentication)

  const fetchBudgets = useCallback(async () => {
    try {
      const response = await api.get(`/budgets?month=${month}`);
      setBudgets(response.data.data);
    } catch (err) {
      console.error('Error fetching budgets', err);
    }
  }, [month]);

  // Check if the user has exceeded their budget
  const checkBudgetAlerts = async () => {
    try {
      const response = await api.get(`/budget/check?userId=${userId}&month=${month}`);
      setAlerts(response.data.alerts);
    } catch (err) {
      console.error('Error checking budget', err);
    }
  };

  useEffect(() => {
    fetchBudgets();
    checkBudgetAlerts(); // Check for alerts when the component loads
  }, [month, fetchBudgets]);

  const saveBudget = async () => {
    try {
      await api.post('/budgets', { category, amount, month });
      setCategory('');
      setAmount('');
      fetchBudgets(); // Re-fetch budgets after saving a new one
    } catch (err) {
      console.error('Error saving budget', err);
    }
  };

  return (
    <div>
      <h3>Budgets for {month}</h3>
      <input
        type="month"
        value={month}
        onChange={(e) => setMonth(e.target.value)}
      />
      <div>
        <input
          type="text"
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <button onClick={saveBudget}>Set Budget</button>
      </div>

      <ul>
        {budgets.map((b, i) => (
          <li key={i}>
            {b.category}: ${b.spent || 0} / ${b.amount || 0}
          </li>
        ))}
      </ul>

      {/* Display any alerts */}
      {alerts.length > 0 && alerts.map((alert, index) => (
        <Alert key={index} message={alert.alert} />
      ))}

      <h4>Pie Charts</h4>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem' }}>
        {budgets.map((b, i) => {
          const spent = parseFloat(b.spent || 0); // Ensure spent is a number
          const budgeted = parseFloat(b.amount || 0); // Ensure budgeted amount is a number
          const pieData = [
            { name: 'Spent', value: spent },
            { name: 'Remaining', value: Math.max(budgeted - spent, 0) }, // Ensure remaining is non-negative
          ];

          return (
            <div key={i}>
              <h5>{b.category}</h5>
              <PieChart width={200} height={200}>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  outerRadius={70}
                  label
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BudgetView;

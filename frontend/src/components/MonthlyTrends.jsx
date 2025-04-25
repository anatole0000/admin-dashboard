import React, { useEffect, useState } from 'react';
import api from '../api';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';

const MonthlyTrends = () => {
  const [monthlyData, setMonthlyData] = useState([]);

  useEffect(() => {
    fetchMonthlyData();
  }, []);

  const fetchMonthlyData = async () => {
    try {
      const response = await api.get('/expenses');
      const rawExpenses = response.data.expenses;

      const grouped = {};

      rawExpenses.forEach(exp => {
        const date = new Date(exp.createdAt);
        const month = date.toLocaleString('default', { month: 'short', year: 'numeric' });
        grouped[month] = (grouped[month] || 0) + parseFloat(exp.amount);
      });

      const formatted = Object.entries(grouped).map(([month, total]) => ({
        month,
        total,
      }));

      setMonthlyData(formatted);
    } catch (err) {
      console.error('Failed to load monthly data', err);
    }
  };

  return (
    <div>
      <h3>Monthly Spending Trends</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={monthlyData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="total" stroke="#8884d8" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MonthlyTrends;

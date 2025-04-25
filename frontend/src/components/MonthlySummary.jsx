import React, { useState, useEffect } from 'react';
import api from '../api';  // Import your axios instance to make API calls

const MonthlySummary = () => {
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7));  // Default to the current month
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await api.get(`/summary?month=${month}`);
        setSummary(res.data);
      } catch (err) {
        console.error('Error fetching summary', err);
      }
    };

    fetchSummary();
  }, [month]);

  return (
    <div>
      <h2>Monthly Summary</h2>
      
      {/* Month Picker */}
      <input
        type="month"
        value={month}
        onChange={(e) => setMonth(e.target.value)}
      />

      {/* Display Summary if data is available */}
      {summary && (
        <div>
          <h3>Total Spent This Month: ${summary.totalSpent}</h3>

          <h4>Top 3 Categories</h4>
          <ul>
            {summary.topCategories.map((cat, idx) => (
              <li key={idx}>
                {cat.category}: ${cat.amount}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default MonthlySummary;

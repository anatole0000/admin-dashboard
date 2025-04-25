import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cookieSession from 'cookie-session';
import authRoutes from './routes/auth.js';
import cors from 'cors';
import userRoutes from './routes/users.js';
import expenseRoutes from './routes/expenses.js';
import budgetRoutes from './routes/budgets.js';
import summaryRoutes from './routes/summary.js'

dotenv.config();
const app = express();

app.use(cors({
    origin: 'http://localhost:5173',   // React dev server
    credentials: true,                 // allow cookies
  }));

// Middleware
app.use(express.json());
app.use(cookieSession({
  name: 'session',
  keys: [process.env.SESSION_SECRET],
  maxAge: 24 * 60 * 60 * 1000, // 1 day
}));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/budgets', budgetRoutes);
app.use('/api/summary', summaryRoutes);

// DB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
  }))
  .catch(err => console.error(err));

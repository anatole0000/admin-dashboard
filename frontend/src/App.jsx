// src/App.jsx
import { useState, useEffect } from 'react';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import Dashboard from './pages/Dashboard';
import api from './api';
import UserList from './components/UserList';
import ExpenseList from './components/ExpenseList';
import MonthlyTrends from './components/MonthlyTrends';
import BudgetView from './components/BudgetView';
import MonthlySummary from './components/MonthlySummary';
import Header from './components/Header';
import Footer from './components/Footer';
import './App.css';

export default function App() {
  const [user, setUser] = useState(null);
  const [view, setView] = useState('login');

  useEffect(() => {
    api.get('/auth/me')
      .then(res => setUser(res.data.user))
      .catch(() => setUser(null));
  }, []);

  const handleLogout = async () => {
    await api.get('/auth/logout');
    setUser(null);
  };

  if (!user) {
    return (
      <div>
        <Header />
        <button onClick={() => setView('login')}>Login</button>
        <button onClick={() => setView('register')}>Register</button>
        {view === 'login'
          ? <LoginForm onLogin={setUser} />
          : <RegisterForm onLogin={setUser} />}
        <Footer />
      </div>
    );
  }

  return (
    <div>
      <Header />
      <button onClick={handleLogout}>Logout</button>
      {user.role === 'admin' ? (
        <UserList /> // Display the UserList component for admin
      ) : (
        <>
          <Dashboard user={user} />
          <ExpenseList />
          <MonthlyTrends />
          <BudgetView />
          <MonthlySummary />
        </>
      )}
      <Footer />
    </div>
  );
}

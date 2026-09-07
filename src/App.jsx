import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import storageService, { DEFAULT_CATEGORIES } from './services/StorageService';
import databaseService from './services/SupabaseService';
import { parseTxDate, isSameDay, isBeforeDay } from './utils/dateUtils';

import Dashboard from './components/Dashboard';
import CategoryGrid from './components/CategoryGrid';
import QuickExpenseModal from './components/QuickExpenseModal';
import IncomeModal from './components/IncomeModal';
import ExpenseLog from './components/ExpenseLog';
import PeriodSetup from './components/PeriodSetup';
import Analytics from './components/Analytics';
import AuthModal from './components/AuthModal';

export default function App() {
  const { t, i18n } = useTranslation();
  const [user, setUser] = useState(null);
  const [currentPeriod, setCurrentPeriod] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Navigation & Theme
  const [activeTab, setActiveTab] = useState('main'); // 'main' | 'analytics'
  const [theme, setTheme] = useState(() => localStorage.getItem('spendly_theme') || 'dark');

  // Modals
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isIncomeOpen, setIsIncomeOpen] = useState(false);
  const [selectedQuickCategory, setSelectedQuickCategory] = useState(null);
  const [isQuickExpenseOpen, setIsQuickExpenseOpen] = useState(false);

  // Theme & Direction management
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('spendly_theme', theme);
  }, [theme]);

  useEffect(() => {
    document.documentElement.dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
  }, [i18n.language]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Load data on start & user change
  const loadData = async (currentUser) => {
    try {
      setLoading(true);
      const periods = await storageService.getPeriods(currentUser);

      // Find active period for today
      const todayStr = new Date().toLocaleDateString('en-CA');
      const active = periods.find(p => p.start_date <= todayStr && p.end_date >= todayStr) || periods[0] || null;

      if (active) {
        setCurrentPeriod(active);
        const txs = await storageService.getTransactions(active.id, currentUser);
        setExpenses(txs || []);
      } else {
        setCurrentPeriod(null);
        setExpenses([]);
      }
    } catch (err) {
      console.error('Failed to load data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    async function init() {
      try {
        const currentUser = await databaseService.getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
          await loadData(currentUser);
        } else {
          await loadData(null);
        }
      } catch (err) {
        console.warn('Auto-login error:', err);
        await loadData(null);
      }
    }
    init();
  }, []);

  // Add Expense
  const handleAddExpense = async (expenseData) => {
    if (!currentPeriod) return;
    try {
      const payload = {
        amount: -Math.abs(Number(expenseData.amount)),
        category: expenseData.category,
        description: expenseData.description || '',
        period_id: currentPeriod.id,
        created_at: new Date().toISOString()
      };
      const created = await storageService.createTransaction(payload, user);
      setExpenses(prev => [created, ...prev]);
    } catch (err) {
      alert('Error adding expense: ' + err.message);
    }
  };

  // Add Income / Top-up
  const handleAddIncome = async (incomeData) => {
    if (!currentPeriod) return;
    try {
      const payload = {
        amount: Math.abs(Number(incomeData.amount)),
        category: t('incomeLabel'),
        description: incomeData.description || t('budgetTopUp'),
        period_id: currentPeriod.id,
        created_at: new Date().toISOString()
      };
      const created = await storageService.createTransaction(payload, user);
      setExpenses(prev => [created, ...prev]);
    } catch (err) {
      alert(t('error', { msg: err.message }));
    }
  };

  // Delete Transaction
  const handleDeleteTx = async (tx) => {
    try {
      await storageService.deleteTransaction(tx.id, user);
      setExpenses(prev => prev.filter(t => t.id !== tx.id));
    } catch (err) {
      alert(t('error', { msg: err.message }));
    }
  };

  // Create Period
  const handlePeriodCreated = async (newPeriodData) => {
    try {
      const created = await storageService.createPeriod(newPeriodData, user);
      setCurrentPeriod(created);
      setExpenses([]);
    } catch (err) {
      alert(t('error', { msg: err.message }));
    }
  };

  // Reset Period
  const handleResetPeriod = () => {
    if (confirm(t('resetConfirm'))) {
      setCurrentPeriod(null);
      setExpenses([]);
    }
  };

  // User login and sync
  const handleLoginSuccess = async (loggedInUser) => {
    setUser(loggedInUser);
    await storageService.syncGuestDataToCloud(loggedInUser);
    await loadData(loggedInUser);
  };

  // Logout
  const handleLogout = async () => {
    try {
      await databaseService.signOut();
      setUser(null);
      await loadData(null);
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  // --- DYNAMIC BUDGET CALCULATION ---
  let salary = currentPeriod ? Number(currentPeriod.initial_income) : 0;
  let totalSpent = expenses.filter(t => Number(t.amount) < 0).reduce((sum, t) => sum + Math.abs(Number(t.amount)), 0);
  let totalIncomes = expenses.filter(t => Number(t.amount) > 0).reduce((sum, t) => sum + Number(t.amount), 0);
  let currentBalance = Math.max(0, salary + totalIncomes - totalSpent);

  let startDate = currentPeriod ? parseTxDate(currentPeriod.start_date) : new Date();
  let endDate = currentPeriod ? parseTxDate(currentPeriod.end_date) : new Date();
  let today = new Date();

  startDate.setHours(0, 0, 0, 0);
  endDate.setHours(0, 0, 0, 0);
  const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate());

  let totalDays = Math.max(1, Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1);
  let daysPassed = Math.ceil((todayMidnight - startDate) / (1000 * 60 * 60 * 24));
  if (daysPassed < 0) daysPassed = 0;
  let daysRemaining = Math.max(1, totalDays - daysPassed);

  // Dynamic daily allowance (recalculated with every transaction)
  let dynamicDailyLimit = Math.max(0, currentBalance / daysRemaining);

  // Expenses prior to today
  let spentBeforeToday = expenses
    .filter(t => Number(t.amount) < 0 && isBeforeDay(t.created_at, today))
    .reduce((sum, t) => sum + Math.abs(Number(t.amount)), 0);

  let incomesBeforeToday = expenses
    .filter(t => Number(t.amount) > 0 && isBeforeDay(t.created_at, today))
    .reduce((sum, t) => sum + Number(t.amount), 0);

  let balanceMorning = salary + incomesBeforeToday - spentBeforeToday;
  let baseDailyLimit = Math.max(0, balanceMorning / daysRemaining);

  // Today's expenses & incomes
  let todaySpent = expenses
    .filter(t => Number(t.amount) < 0 && isSameDay(t.created_at, today))
    .reduce((sum, t) => sum + Math.abs(Number(t.amount)), 0);

  let todayIncomesAmount = expenses
    .filter(t => Number(t.amount) > 0 && isSameDay(t.created_at, today))
    .reduce((sum, t) => sum + Number(t.amount), 0);

  let rawTodayAvailable = baseDailyLimit - todaySpent + todayIncomesAmount;
  let isOverspent = rawTodayAvailable < 0;
  let overspentAmount = isOverspent ? Math.abs(rawTodayAvailable) : 0;
  
  // Available today (resets to 0 when overspent with dynamic future redistribution)
  let availableToday = isOverspent ? 0 : rawTodayAvailable;
  let futureDays = Math.max(1, daysRemaining - 1);
  let futureDailyLimit = Math.max(0, currentBalance / futureDays);

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '12px'
      }}>
        <div style={{ fontSize: '2.5rem', animation: 'pulseGlow 1.5s infinite' }}>⚡</div>
        <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: '600' }}>
          {t('loading')}
        </div>
      </div>
    );
  }

  return (
    <>
      {/* HEADER */}
      <header style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '16px',
        padding: '0 4px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, var(--accent-primary) 0%, #0284c7 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1rem',
            boxShadow: 'var(--shadow-glow)'
          }}>
            ⚡
          </div>
          <h1 style={{
            fontSize: '1.25rem',
            fontWeight: '800',
            color: 'var(--text-primary)',
            letterSpacing: '-0.02em'
          }}>
            {t('appName')}
          </h1>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* Sync indicator */}
          <button
            onClick={() => setIsAuthOpen(true)}
            style={{
              background: user ? 'var(--accent-success-bg)' : 'var(--bg-card)',
              color: user ? 'var(--accent-success)' : 'var(--text-secondary)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-full)',
              padding: '6px 12px',
              fontSize: '0.78rem',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <span>{user ? '☁️' : '⚡'}</span>
            <span>{user ? (user.user_metadata?.username || t('synced')) : t('guest')}</span>
          </button>

          {/* Language switcher */}
          <select
            value={i18n.language}
            onChange={(e) => i18n.changeLanguage(e.target.value)}
            style={{
              background: 'var(--bg-card)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '4px 6px',
              fontSize: '0.8rem',
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            <option value="en">EN</option>
            <option value="ru">RU</option>
            <option value="uk">UK</option>
            <option value="de">DE</option>
            <option value="es">ES</option>
            <option value="ar">AR</option>
            <option value="zh">ZH</option>
          </select>

          {/* Theme switcher */}
          <button
            onClick={toggleTheme}
            style={{
              width: '36px',
              height: '36px',
              borderRadius: 'var(--radius-full)',
              background: 'var(--bg-card)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-primary)',
              fontSize: '1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            title={theme === 'dark' ? t('themeLight') : t('themeDark')}
          >
            {theme === 'dark' ? '🌙' : '☀️'}
          </button>
        </div>
      </header>

      {/* TABS */}
      <div style={{
        display: 'flex',
        background: 'var(--bg-card)',
        borderRadius: 'var(--radius-md)',
        padding: '4px',
        marginBottom: '16px',
        border: '1px solid var(--border-subtle)'
      }}>
        <button
          onClick={() => setActiveTab('main')}
          style={{
            flex: 1,
            padding: '8px 0',
            borderRadius: 'var(--radius-sm)',
            background: activeTab === 'main' ? 'var(--accent-primary)' : 'transparent',
            color: activeTab === 'main' ? '#ffffff' : 'var(--text-muted)',
            fontSize: '0.85rem',
            fontWeight: '700',
            transition: 'all 0.2s ease'
          }}
        >
          {t('tabToday')}
        </button>

        <button
          onClick={() => setActiveTab('analytics')}
          style={{
            flex: 1,
            padding: '8px 0',
            borderRadius: 'var(--radius-sm)',
            background: activeTab === 'analytics' ? 'var(--accent-primary)' : 'transparent',
            color: activeTab === 'analytics' ? '#ffffff' : 'var(--text-muted)',
            fontSize: '0.85rem',
            fontWeight: '700',
            transition: 'all 0.2s ease'
          }}
        >
          {t('tabAnalytics')}
        </button>
      </div>

      {/* MAIN CONTENT */}
      {activeTab === 'main' ? (
        <>
          {!currentPeriod ? (
            <PeriodSetup onPeriodCreated={handlePeriodCreated} />
          ) : (
            <>
              {/* Daily Dashboard Card */}
              <Dashboard
                availableToday={availableToday}
                baseDailyLimit={baseDailyLimit}
                dynamicDailyLimit={dynamicDailyLimit}
                futureDailyLimit={futureDailyLimit}
                currentBalance={currentBalance}
                salary={salary}
                daysRemaining={daysRemaining}
                totalSpent={totalSpent}
                todaySpent={todaySpent}
                todayIncomes={todayIncomesAmount}
                isOverspent={isOverspent}
                overspentAmount={overspentAmount}
                onOpenIncome={() => setIsIncomeOpen(true)}
                onResetPeriod={handleResetPeriod}
              />

              {/* Quick Category Grid */}
              <CategoryGrid
                onSelectCategory={(cat) => {
                  setSelectedQuickCategory(cat);
                  setIsQuickExpenseOpen(true);
                }}
                onCustomExpense={() => {
                  setSelectedQuickCategory(DEFAULT_CATEGORIES[0]);
                  setIsQuickExpenseOpen(true);
                }}
              />

              {/* Expense History Feed */}
              <ExpenseLog
                expenses={expenses}
                onDelete={handleDeleteTx}
              />

              {/* Reset / New period action */}
              <div style={{ textAlign: 'center', marginTop: '12px' }}>
                <button
                  onClick={handleResetPeriod}
                  style={{
                    background: 'none',
                    color: 'var(--text-muted)',
                    fontSize: '0.78rem',
                    fontWeight: '500',
                    textDecoration: 'underline',
                    cursor: 'pointer'
                  }}
                >
                  {t('setupNewPeriod')}
                </button>
              </div>
            </>
          )}
        </>
      ) : (
        <Analytics expenses={expenses} salary={salary} />
      )}

      {/* MODALS */}
      <QuickExpenseModal
        isOpen={isQuickExpenseOpen}
        category={selectedQuickCategory}
        onClose={() => setIsQuickExpenseOpen(false)}
        onSubmit={handleAddExpense}
      />

      <IncomeModal
        isOpen={isIncomeOpen}
        onClose={() => setIsIncomeOpen(false)}
        onSubmit={handleAddIncome}
      />

      <AuthModal
        isOpen={isAuthOpen}
        currentUser={user}
        onClose={() => setIsAuthOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        onLogout={handleLogout}
      />
    </>
  );
}
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import storageService, { DEFAULT_CATEGORIES } from './services/StorageService';
import databaseService from './services/SupabaseService';
import { parseTxDate, isSameDay, isBeforeDay } from './utils/dateUtils';

import Dashboard from './components/Dashboard';
import LanguageSwitcher from './components/LanguageSwitcher';
import CategoryGrid from './components/CategoryGrid';
import QuickExpenseModal from './components/QuickExpenseModal';
import IncomeModal from './components/IncomeModal';
import ExpenseLog from './components/ExpenseLog';
import PeriodSetup from './components/PeriodSetup';
import Analytics from './components/Analytics';
import AuthModal from './components/AuthModal';

// Web Layout Imports
import { Routes, Route } from 'react-router-dom';
import { useMediaQuery } from './hooks/useMediaQuery';
import WebLayout from './layouts/WebLayout';
import WebOverview from './pages/WebOverview';
import WebProAnalytics from './pages/WebProAnalytics';
import WebTransactions from './pages/WebTransactions';
import WebPlan from './pages/WebPlan';
import WebGoals from './pages/WebGoals';
import WebSettings from './pages/WebSettings';
import WebPeriodSetup from './components/WebPeriodSetup';

export default function App() {
  const { t, i18n } = useTranslation();
  const [user, setUser] = useState(null);
  const [currentPeriod, setCurrentPeriod] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isPro, setIsPro] = useState(false);
  
  const isWebLayout = useMediaQuery('(min-width: 768px)');

  // Navigation & Theme
  const [activeTab, setActiveTab] = useState('main'); // 'main' | 'analytics'
  const [theme, setTheme] = useState(() => localStorage.getItem('spendly_theme') || 'dark');
  const [currency, setCurrency] = useState(() => localStorage.getItem('spendly_currency') || '₴');

  // Modals
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isIncomeOpen, setIsIncomeOpen] = useState(false);
  const [selectedQuickCategory, setSelectedQuickCategory] = useState(null);
  const [isQuickExpenseOpen, setIsQuickExpenseOpen] = useState(false);

  // Theme & Direction management
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('spendly_theme', theme);
    localStorage.setItem('spendly_currency', currency);
  }, [theme, currency]);

  useEffect(() => {
    document.documentElement.dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
  }, [i18n.language]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  
  const upgradeToPro = async () => {
    try {
      if (user) {
        const updatedUser = await databaseService.updateUserMetadata({ is_pro: true });
        setUser(updatedUser);
      }
      localStorage.setItem('spendly_is_pro', 'true');
      setIsPro(true);
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  };

  // Load data on start & user change
  const loadData = async (currentUser) => {
    try {
      setLoading(true);
      setIsPro(currentUser?.user_metadata?.is_pro === true || localStorage.getItem('spendly_is_pro') === 'true');
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
        created_at: expenseData.date ? new Date(expenseData.date).toISOString() : new Date().toISOString()
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
        category: incomeData.category || t('incomeLabel'),
        description: incomeData.description || t('budgetTopUp'),
        period_id: currentPeriod.id,
        created_at: incomeData.date ? new Date(incomeData.date).toISOString() : new Date().toISOString()
      };
      const created = await storageService.createTransaction(payload, user);
      setExpenses(prev => [created, ...prev]);
    } catch (err) {
      alert('Error adding income: ' + err.message);
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
      alert('Error creating period: ' + err.message);
    }
  };

  // Update Period
  const handleUpdatePeriod = async (periodId, updatedData) => {
    try {
      const updated = await storageService.updatePeriod(periodId, updatedData, user);
      setCurrentPeriod(updated);
    } catch (err) {
      alert('Error updating period: ' + err.message);
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

  if (isWebLayout) {
    const webContext = {
      expenses,
      user,
      currentPeriod,
      availableToday,
      baseDailyLimit,
      dynamicDailyLimit,
      futureDailyLimit,
      currentBalance,
      salary,
      daysRemaining,
      totalSpent,
      todaySpent,
      todayIncomesAmount,
      isOverspent,
      overspentAmount,
      handleAddExpense,
      handleAddIncome,
      handleDeleteTx,
      handleUpdatePeriod,
      handleResetPeriod,
      currency,
      setCurrency,
      setUser
    };

    return (
      <WebLayout user={user} onLogout={handleLogout} isPro={isPro}>
        {!currentPeriod ? (
          <WebPeriodSetup onPeriodCreated={handlePeriodCreated} currency={currency} />
        ) : (
          <Routes>
            <Route path="/" element={<WebOverview {...webContext} />} />
            <Route path="/transactions" element={<WebTransactions {...webContext} />} />
            <Route path="/plan" element={<WebPlan {...webContext} />} />
            <Route path="/goals" element={<WebGoals {...webContext} />} />
            <Route path="/settings" element={<WebSettings {...webContext} />} />
              <Route path="/pro" element={<WebProAnalytics {...webContext} />} />
            <Route path="*" element={<WebOverview {...webContext} />} />
          </Routes>
        )}
      </WebLayout>
    );
  }

  return (
    <div className="mobile-wrapper">
      {/* HEADER */}
      <header style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '16px',
        padding: '0 4px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <img 
            src="/logo.svg" 
            alt="Spendly" 
            style={{ 
              width: '32px', 
              height: '32px', 
              borderRadius: '8px',
              boxShadow: 'var(--shadow-glow)'
            }} 
          />
          <h1 style={{
            fontSize: '1.25rem',
            fontWeight: '800',
            color: 'var(--text-primary)',
            letterSpacing: '-0.02em'
          }}>
            {t('appName')}
              {isPro && <span style={{ fontSize: '0.65rem', background: 'var(--accent-primary)', color: '#000', padding: '2px 6px', borderRadius: '4px', fontWeight: '800', marginLeft: '6px', verticalAlign: 'middle' }}>PRO</span>}
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
          <LanguageSwitcher />

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
              <Dashboard isPro={isPro} upgradeToPro={upgradeToPro}
                currency={currency}
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
                currency={currency}
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
        <Analytics expenses={expenses} salary={salary} isPro={isPro} upgradeToPro={upgradeToPro} />
      )}

      {/* MODALS */}
      <QuickExpenseModal
        currency={currency}
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
    </div>
  );
}
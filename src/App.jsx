import { useState, useEffect } from 'react';
import databaseService from './services/SupabaseService';

import Dashboard from './components/Dashboard';
import ExpenseForm from './components/ExpenseForm';
import ExpenseLog from './components/ExpenseLog';
import Auth from './components/Auth';
import PeriodSetup from './components/PeriodSetup';
import IncomeForm from './components/IncomeForm';
import Analytics from './components/Analytics';

export default function App() {
  const [user, setUser] = useState(null);
  const [currentPeriod, setCurrentPeriod] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [allTransactions, setAllTransactions] = useState([]);
  const [allPeriods, setAllPeriods] = useState([]);
  const [loading, setLoading] = useState(true);

  // Управление вкладками и стилями (CLI / MODERN)
  const [activeTab, setActiveTab] = useState('main');
  const [theme, setTheme] = useState('CLI');

  // Стейты для кастомных попапов
  const [txToDelete, setTxToDelete] = useState(null);
  const [txToEdit, setTxToEdit] = useState(null);

  // Стейты полей модалки редактирования
  const [editAmount, setEditAmount] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [editDescription, setEditDescription] = useState('');

  // Категории
  const [categories, setCategories] = useState(['Продукты', 'Налоги', 'Медицина', 'Быт', 'Одежда', 'Кафе/Отдых', 'Транспорт', 'Коммуналка', 'Развлечения', 'Другое']);

  // Проверка существующей сессии и загрузка данных
  useEffect(() => {
    async function fetchData() {
      if (!user) {
        try {
          const currentUser = await databaseService.getCurrentUser();
          if (currentUser) {
            setUser(currentUser);
            return;
          }
        } catch (err) {
          console.error("Ошибка авто-входа:", err.message);
        }
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        // Передаем точечно user.id для фильтрации на уровне сервиса
        const periods = await databaseService.fetchPeriods(user.id);
        setAllPeriods(periods);

        // ИСПРАВЛЕНИЕ: Вычисляем активный период по текущей дате (формат YYYY-MM-DD в локальном времени)
        const todayStr = new Date().toLocaleDateString('en-CA');
        const active = periods.find(p => p.start_date <= todayStr && p.end_date >= todayStr);

        if (active) {
          setCurrentPeriod(active);
          const txs = await databaseService.fetchTransactions(active.id);
          setExpenses(txs);
        } else {
          setCurrentPeriod(null);
          setExpenses([]);
        }

        const allTxs = await databaseService.fetchAllTransactions(user.id);
        setAllTransactions(allTxs);
      } catch (err) {
        alert('ОШИБКА ЗАГРУЗКИ ДАННЫХ: ' + err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [user]);

  const handlePeriodCreated = async (newPeriod) => {
    setCurrentPeriod(newPeriod);
    setAllPeriods(prev => [newPeriod, ...prev]);
    setExpenses([]);
  };

  const handleAddTransaction = async (txData) => {
    if (!currentPeriod) return;
    try {
      const payload = {
        ...txData,
        amount: -Math.abs(Number(txData.amount)),
        period_id: currentPeriod.id,
        user_id: user.id
      };
      const created = await databaseService.createTransaction(payload);
      setExpenses(prev => [created, ...prev]);
      setAllTransactions(prev => [created, ...prev]);
    } catch (err) {
      alert('ОШИБКА ДОБАВЛЕНИЯ РАСХОДА: ' + err.message);
    }
  };

  const handleAddIncome = async (incomeData) => {
    if (!currentPeriod) return;
    try {
      const payload = {
        ...incomeData,
        amount: Math.abs(Number(incomeData.amount)),
        period_id: currentPeriod.id,
        user_id: user.id
      };
      const created = await databaseService.createTransaction(payload);
      setExpenses(prev => [created, ...prev]);
      setAllTransactions(prev => [created, ...prev]);
    } catch (err) {
      alert('ОШИБКА ДОБАВЛЕНИЯ ДОХОДА: ' + err.message);
    }
  };

  const confirmDeleteTx = async () => {
    if (!txToDelete) return;
    try {
      await databaseService.deleteTransaction(txToDelete.id);
      setExpenses(prev => prev.filter(t => t.id !== txToDelete.id));
      setAllTransactions(prev => prev.filter(t => t.id !== txToDelete.id));
      setTxToDelete(null);
    } catch (err) {
      alert('ОШИБКА УДАЛЕНИЯ: ' + err.message);
    }
  };

  const openEditModal = (tx) => {
    setTxToEdit(tx);
    setEditAmount(Math.abs(tx.amount).toString());
    setEditCategory(tx.category);
    setEditDescription(tx.description || '');
  };

  const handleUpdateTx = async (e) => {
    e.preventDefault();
    if (!txToEdit) return;
    try {
      const rawAmount = Number(editAmount);
      const finalAmount = txToEdit.amount > 0 ? Math.abs(rawAmount) : -Math.abs(rawAmount);

      const updatedFields = {
        amount: finalAmount,
        category: editCategory,
        description: editDescription.trim()
      };

      const updated = await databaseService.updateTransaction(txToEdit.id, updatedFields);

      setExpenses(prev => prev.map(t => t.id === txToEdit.id ? updated : t));
      setAllTransactions(prev => prev.map(t => t.id === txToEdit.id ? updated : t));
      setTxToEdit(null);
    } catch (err) {
      alert('ОШИБКА ОБНОВЛЕНИЯ: ' + err.message);
    }
  };

  // Вычисления лимитов
  let salary = currentPeriod ? Number(currentPeriod.initial_income) : 0;
  let totalSpent = expenses.filter(t => t.amount < 0).reduce((sum, t) => sum + Math.abs(Number(t.amount)), 0);
  let totalIncomes = expenses.filter(t => t.amount > 0).reduce((sum, t) => sum + Number(t.amount), 0);
  let currentBalance = salary + totalIncomes - totalSpent;

  let startDate = currentPeriod ? new Date(currentPeriod.start_date) : new Date();
  let endDate = currentPeriod ? new Date(currentPeriod.end_date) : new Date();
  let today = new Date();
  today.setHours(0, 0, 0, 0);
  startDate.setHours(0, 0, 0, 0);
  endDate.setHours(0, 0, 0, 0);

  let totalDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
  let daysPassed = Math.ceil((today - startDate) / (1000 * 60 * 60 * 24));
  if (daysPassed < 0) daysPassed = 0;
  let daysRemaining = totalDays - daysPassed;
  if (daysRemaining < 1) daysRemaining = 1;

  let spentBeforeToday = expenses
    .filter(t => {
      if (t.amount > 0) return false;
      const txDate = new Date(t.created_at);
      txDate.setHours(0, 0, 0, 0);
      return txDate < today;
    })
    .reduce((sum, t) => sum + Math.abs(Number(t.amount)), 0);

  let incomesBeforeToday = expenses
    .filter(t => {
      if (t.amount <= 0) return false;
      const txDate = new Date(t.created_at);
      txDate.setHours(0, 0, 0, 0);
      return txDate < today;
    })
    .reduce((sum, t) => sum + Number(t.amount), 0);

  let balanceMorning = salary + incomesBeforeToday - spentBeforeToday;
  let baseDailyLimit = balanceMorning / daysRemaining;
  if (baseDailyLimit < 0) baseDailyLimit = 0;

  let todaySpent = expenses
    .filter(t => {
      if (t.amount > 0) return false;
      const txDate = new Date(t.created_at);
      txDate.setHours(0, 0, 0, 0);
      return txDate.getTime() === today.getTime();
    })
    .reduce((sum, t) => sum + Math.abs(Number(t.amount)), 0);

  let todayIncomes = expenses
    .filter(t => {
      if (t.amount <= 0) return false;
      const txDate = new Date(t.created_at);
      txDate.setHours(0, 0, 0, 0);
      return txDate.getTime() === today.getTime();
    })
    .reduce((sum, t) => sum + Number(t.amount), 0);

  let availableToday = baseDailyLimit - todaySpent + todayIncomes;

  const isCli = theme === 'CLI';

  // ИСПРАВЛЕНИЕ ГЕОМЕТРИИ ОКНА ЗАГРУЗКИ: Теперь оно строго повторяет ширину и центровку приложения
  if (loading) {
    return (
      <div style={{
        width: '400px',
        margin: '0 auto',
        padding: '20px',
        backgroundColor: '#000',
        color: '#facc15',
        minHeight: '100vh',
        fontFamily: 'monospace',
        boxSizing: 'border-box',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        [ ЗАГРУЗКА СИСТЕМЫ... ]
      </div>
    );
  }

  if (!user) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#000' }}>
        <Auth onLoginSuccess={(u) => setUser(u)} theme={theme} />
      </div>
    );
  }

  const userDisplayName =
    user.user_metadata?.username ||
    user.user_metadata?.full_name ||
    user.email.split('@')[0];

  return (
    <div style={{ width: '400px', margin: '0 auto', padding: '20px', backgroundColor: isCli ? '#000' : '#0f172a', color: '#fff', minHeight: '100vh', fontFamily: 'monospace', boxSizing: 'border-box' }}>

      {/* ХЕДЕР С ТУМБЛЕРОМ */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', borderBottom: isCli ? '1px solid #333' : '1px solid #334155', paddingBottom: '10px' }}>
        <h1 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 'bold', color: isCli ? '#facc15' : '#38bdf8', letterSpacing: '1px' }}>
          {isCli ? '★ SPENDLY ★' : 'Spendly'}
        </h1>
        <button
          onClick={() => setTheme(prev => prev === 'CLI' ? 'MODERN' : 'CLI')}
          style={{ background: 'none', border: isCli ? '1px solid #444' : '1px solid #475569', color: isCli ? '#facc15' : '#38bdf8', padding: '4px 10px', fontFamily: 'inherit', fontSize: '0.75rem', cursor: 'pointer', textTransform: 'uppercase', borderRadius: isCli ? '0' : '4px' }}
        >
          {theme} MODE
        </button>
      </div>

      {/* СТАТУС БАР */}
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#666', textTransform: 'uppercase', marginBottom: '20px' }}>
        <div>STATUS: <span style={{ color: '#4ade80' }}>ONLINE</span></div>
        <div>TERMINAL: <span style={{ color: '#aaa' }}>{isCli ? userDisplayName.toUpperCase() : userDisplayName}</span></div>
      </div>

      {/* ВКЛАДКИ */}
      <div style={{ display: 'flex', gap: '5px', marginBottom: '20px' }}>
        <button
          onClick={() => setActiveTab('main')}
          style={{ flex: 1, padding: '8px', fontFamily: 'inherit', fontWeight: 'bold', fontSize: '0.8rem', cursor: 'pointer', border: isCli ? '1px solid #333' : '1px solid #334155', backgroundColor: activeTab === 'main' ? (isCli ? '#facc15' : '#38bdf8') : 'transparent', color: activeTab === 'main' ? '#000' : '#888', textTransform: 'uppercase', borderRadius: isCli ? '0' : '4px' }}
        >
          {isCli ? '[ГЛАВНАЯ]' : 'Главная'}
        </button>
        <button
          onClick={() => setActiveTab('analytics')}
          style={{ flex: 1, padding: '8px', fontFamily: 'inherit', fontWeight: 'bold', fontSize: '0.8rem', cursor: 'pointer', border: isCli ? '1px solid #333' : '1px solid #334155', backgroundColor: activeTab === 'analytics' ? (isCli ? '#facc15' : '#38bdf8') : 'transparent', color: activeTab === 'analytics' ? '#000' : '#888', textTransform: 'uppercase', borderRadius: isCli ? '0' : '4px' }}
        >
          {isCli ? '[АНАЛИТИКА]' : 'Аналитика'}
        </button>
        <button
          onClick={async () => {
            try {
              await databaseService.signOut();
              setUser(null);
            } catch (err) {
              alert('Ошибка выхода: ' + err.message);
            }
          }}
          style={{ padding: '8px 12px', fontFamily: 'inherit', fontWeight: 'bold', fontSize: '0.8rem', cursor: 'pointer', border: isCli ? '1px solid #333' : '1px solid #475569', backgroundColor: 'transparent', color: '#ff5555', textTransform: 'uppercase', borderRadius: isCli ? '0' : '4px' }}
        >
          {isCli ? '[ВЫХОД]' : 'Выйти'}
        </button>
      </div>

      {/* КОНТЕНТ ВКЛАДОК */}
      {activeTab === 'main' ? (
        <>
          {!currentPeriod ? (
            <PeriodSetup userId={user.id} onPeriodCreated={handlePeriodCreated} theme={theme} />
          ) : (
            <>
              <Dashboard
                availableToday={availableToday}
                baseDailyLimit={baseDailyLimit}
                currentBalance={currentBalance}
                salary={salary}
                daysRemaining={daysRemaining}
                totalSpent={totalSpent}
                todaySpent={todaySpent}
                theme={theme}
              />

              <IncomeForm onAddIncome={handleAddIncome} theme={theme} />

              <ExpenseForm
                onAddExpense={handleAddTransaction}
                categories={categories}
                onAddCategory={(newCat) => setCategories(prev => [...prev, newCat])}
                theme={theme}
              />

              <ExpenseLog
                expenses={expenses}
                onDelete={(tx) => setTxToDelete(tx)}
                onEdit={(tx) => openEditModal(tx)}
                theme={theme}
              />
            </>
          )}
        </>
      ) : (
        <Analytics
          expenses={expenses}
          allTransactions={allTransactions}
          salary={salary}
          allPeriods={allPeriods}
          theme={theme}
        />
      )}

      {/* МОДАЛКА УДАЛЕНИЯ */}
      {txToDelete && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0,0,0,0.85)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999 }}>
          <div style={{ width: '340px', backgroundColor: isCli ? '#000' : '#1e293b', border: isCli ? '1px solid #ff5555' : '1px solid #f43f5e', padding: '20px', textAlign: 'center', borderRadius: isCli ? '0' : '6px' }}>
            <p style={{ color: '#fff', fontSize: '0.9rem', marginBottom: '20px', textTransform: 'uppercase', lineHeight: '1.4' }}>
              {isCli ? '⚠️ ПОДТВЕРДИТЕ СТЕРЕОТИПНУЮ ОПЕРАЦИЮ УДАЛЕНИЯ:' : 'Вы уверены, что хотите удалить транзакцию?'}
              <br />
              <span style={{ color: '#ff5555', fontWeight: 'bold' }}>{txToDelete.amount} ₴ ({txToDelete.category})</span>
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
              <button onClick={confirmDeleteTx} style={{ backgroundColor: isCli ? '#ff5555' : '#f43f5e', color: '#fff', border: 'none', padding: '8px 20px', fontFamily: 'monospace', fontWeight: 'bold', cursor: 'pointer', borderRadius: isCli ? '0' : '4px' }}>
                {isCli ? '[УДАЛИТЬ]' : 'Удалить'}
              </button>
              <button onClick={() => setTxToDelete(null)} style={{ backgroundColor: 'transparent', color: '#888', border: isCli ? '1px solid #444' : '1px solid #475569', padding: '8px 20px', fontFamily: 'monospace', cursor: 'pointer', borderRadius: isCli ? '0' : '4px' }}>
                {isCli ? '[ОТМЕНА]' : 'Отмена'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* МОДАЛКА РЕДАКТИРОВАНИЯ */}
      {txToEdit && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0,0,0,0.85)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999 }}>
          <form onSubmit={handleUpdateTx} style={{ width: '340px', backgroundColor: isCli ? '#000' : '#1e293b', border: isCli ? '1px solid #facc15' : '1px solid #38bdf8', padding: '20px', borderRadius: isCli ? '0' : '6px' }}>
            <h3 style={{ color: isCli ? '#facc15' : '#38bdf8', marginTop: 0, fontSize: '1rem', textTransform: 'uppercase', marginBottom: '20px', textAlign: 'center' }}>
              {isCli ? '[КОРРЕКТИРОВКА ОПЕРАЦИИ]' : 'Редактирование транзакции'}
            </h3>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ color: '#888', display: 'block', marginBottom: '5px', fontSize: '0.8rem' }}>{isCli ? 'СУММА:' : 'Сумма:'}</label>
              <input
                type="number"
                step="0.01"
                value={editAmount}
                onChange={(e) => setEditAmount(e.target.value)}
                style={{ width: '100%', backgroundColor: isCli ? '#111' : '#0f172a', border: isCli ? '1px solid #444' : '1px solid #475569', color: '#fff', padding: '8px', boxSizing: 'border-box', outline: 'none', borderRadius: isCli ? '0' : '4px' }}
                required
              />
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ color: '#888', display: 'block', marginBottom: '5px', fontSize: '0.8rem' }}>{isCli ? 'КАТЕГОРИЯ:' : 'Категория:'}</label>
              <select
                value={editCategory}
                onChange={(e) => setEditCategory(e.target.value)}
                style={{ width: '100%', backgroundColor: isCli ? '#111' : '#0f172a', border: isCli ? '1px solid #444' : '1px solid #475569', color: '#fff', padding: '8px', boxSizing: 'border-box', outline: 'none', cursor: 'pointer', borderRadius: isCli ? '0' : '4px' }}
              >
                {txToEdit.amount > 0 ? (
                  <option value="Доход">ДОХОД / ДОЗАПРАВКА</option>
                ) : (
                  categories.map(cat => (
                    <option key={cat} value={cat}>
                      {cat.toUpperCase()}
                    </option>
                  ))
                )}
              </select>
            </div>

            <div style={{ marginBottom: '25px' }}>
              <label style={{ color: '#888', display: 'block', marginBottom: '5px', fontSize: '0.8rem' }}>{isCli ? 'ОПИСАНИЕ:' : 'Описание:'}</label>
              <input
                type="text"
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                style={{ width: '100%', backgroundColor: isCli ? '#111' : '#0f172a', border: isCli ? '1px solid #444' : '1px solid #475569', color: '#fff', padding: '8px', boxSizing: 'border-box', outline: 'none', borderRadius: isCli ? '0' : '4px' }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
              <button type="submit" style={{ backgroundColor: isCli ? '#facc15' : '#38bdf8', color: '#000', border: 'none', padding: '8px 20px', fontWeight: 'bold', cursor: 'pointer', borderRadius: isCli ? '0' : '4px' }}>
                {isCli ? '[ПРИМЕНИТЬ]' : 'Сохранить'}
              </button>
              <button type="button" onClick={() => setTxToEdit(null)} style={{ backgroundColor: 'transparent', color: '#888', border: '1px solid #444', padding: '8px 20px', cursor: 'pointer', borderRadius: isCli ? '0' : '4px' }}>
                {isCli ? '[ОТМЕНА]' : 'Отмена'}
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}
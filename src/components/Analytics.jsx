import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BarChart, Bar, AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid } from 'recharts';
import { Sparkles, Lock } from 'lucide-react';
import { DEFAULT_CATEGORIES } from '../services/StorageService';
import { catMap } from './CategoryGrid';
import ProPaywallModal from './ProPaywallModal';

export default function Analytics({ expenses = [], salary = 0, isPro, upgradeToPro }) {
  const { t } = useTranslation();
  const [showPaywall, setShowPaywall] = useState(false);

  // Aggregate totals
  const totalIncomes = salary + expenses
    .filter(t => t && Number(t.amount) > 0)
    .reduce((sum, tx) => sum + Number(tx.amount), 0);

  const totalExpenses = expenses
    .filter(t => t && Number(t.amount) < 0)
    .reduce((sum, tx) => sum + Math.abs(Number(tx.amount)), 0);

  const saved = totalIncomes - totalExpenses;

  // Group expenses by category
  const categoryMap = {};
  expenses
    .filter(tx => tx && Number(tx.amount) < 0)
    .forEach(tx => {
      const cat = tx.category || 'Другое';
      categoryMap[cat] = (categoryMap[cat] || 0) + Math.abs(Number(tx.amount));
    });

  const barData = Object.keys(categoryMap).map(catName => {
    const found = DEFAULT_CATEGORIES.find(c => c.name.toLowerCase() === catName.toLowerCase());
    return {
      name: t(catMap[catName] || catName),
      emoji: found ? found.emoji : '📦',
      value: categoryMap[catName]
    };
  }).sort((a, b) => b.value - a.value);

  const palette = ['var(--accent-primary)', '#f43f5e', '#10b981', '#fbbf24', '#a855f7', '#f97316', '#06b6d4', '#ec4899'];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-sm)',
          padding: '8px 12px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
        }}>
          <p style={{ margin: 0, fontWeight: '700', color: 'var(--text-primary)', fontSize: '0.85rem' }}>
            {payload[0].payload.emoji} {payload[0].payload.name}
          </p>
          <p style={{ margin: '2px 0 0 0', color: 'var(--accent-primary)', fontSize: '0.8rem', fontWeight: '600' }}>
            {payload[0].value.toLocaleString('ru-RU')} ₴
          </p>
        </div>
      );
    }
    return null;
  };

  // --- PRO DATA ---
  const dailyMap = {};
  expenses.filter(tx => tx && Number(tx.amount) < 0).forEach(tx => {
    const d = new Date(tx.date).toLocaleDateString('en-CA');
    dailyMap[d] = (dailyMap[d] || 0) + Math.abs(Number(tx.amount));
  });
  const sortedDays = Object.keys(dailyMap).sort();
  let cumulative = 0;
  const burnData = sortedDays.map(day => {
    cumulative += dailyMap[day];
    return { day: day.substring(8) + ' ' + day.substring(5,7), spend: cumulative };
  });

  const incExpData = [
    { name: t('typeIncome', 'Income'), amount: totalIncomes, fill: 'var(--accent-success)' },
    { name: t('typeExpense', 'Expense'), amount: totalExpenses, fill: 'var(--accent-danger)' }
  ];

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '16px', position: 'relative' }}>
      
      {/* Standard Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
        <div style={{ background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)', padding: '16px', boxShadow: 'var(--shadow-card)' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
            {t('totalIncomes', 'Total incomes')}
          </div>
          <div style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--accent-success)' }}>
            +{totalIncomes.toLocaleString('ru-RU')} ₴
          </div>
        </div>

        <div style={{ background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)', padding: '16px', boxShadow: 'var(--shadow-card)' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
            {t('totalExpenses', 'Total expenses')}
          </div>
          <div style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--accent-danger)' }}>
            -{totalExpenses.toLocaleString('ru-RU')} ₴
          </div>
        </div>
      </div>

      <div style={{ background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)', padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '2px' }}>
            {t('freeBalance', 'Free balance')}
          </div>
          <div style={{ fontSize: '1.4rem', fontWeight: '800', color: saved >= 0 ? 'var(--accent-success)' : 'var(--accent-danger)' }}>
            {saved.toLocaleString('ru-RU')} ₴
          </div>
        </div>
        <div style={{ fontSize: '2rem' }}>{saved >= 0 ? '📈' : '📉'}</div>
      </div>

      <div style={{ background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)', padding: '20px 16px', boxShadow: 'var(--shadow-card)' }}>
        <div style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '16px' }}>
          {t('whereMoneyGoes', 'Where the money goes')}
        </div>
        {barData.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '30px 0', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            {t('noDataChart', 'No data for chart')}
          </div>
        ) : (
          <div style={{ width: '100%', height: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} layout="vertical" margin={{ top: 0, right: 16, left: 10, bottom: 0 }}>
                <XAxis type="number" stroke="var(--text-muted)" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} />
                <YAxis dataKey="name" type="category" stroke="var(--text-muted)" tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} width={75} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
                <Bar dataKey="value" radius={[0, 6, 6, 0]} barSize={12}>
                  {barData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={palette[index % palette.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* PRO SECTION OVERLAY */}
      <div style={{ marginTop: '16px', position: 'relative' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <Sparkles size={24} color="var(--accent-primary)" />
          <h3 style={{ fontSize: '1.2rem', fontWeight: '800', margin: 0, color: 'var(--text-primary)' }}>Pro Analytics</h3>
        </div>

        <div style={{
          display: 'flex', flexDirection: 'column', gap: '16px',
          filter: !isPro ? 'blur(6px) grayscale(0.5)' : 'none',
          pointerEvents: !isPro ? 'none' : 'auto',
          transition: 'all 0.3s'
        }}>
          {/* Burn Rate */}
          <div style={{ background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)', padding: '20px 16px', boxShadow: 'var(--shadow-card)' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '16px' }}>Cumulative Spend</div>
            <div style={{ width: '100%', height: 200 }}>
              {burnData.length > 0 ? (
                <ResponsiveContainer>
                  <AreaChart data={burnData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorSpendMobile" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--accent-primary)" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="var(--accent-primary)" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" vertical={false} />
                    <XAxis dataKey="day" stroke="var(--text-muted)" tick={{ fontSize: 11 }} />
                    <YAxis stroke="var(--text-muted)" tick={{ fontSize: 11 }} />
                    <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '8px' }} />
                    <Area type="monotone" dataKey="spend" stroke="var(--accent-primary)" strokeWidth={3} fillOpacity={1} fill="url(#colorSpendMobile)" />
                  </AreaChart>
                </ResponsiveContainer>
              ) : <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>No data</p>}
            </div>
          </div>

          {/* Income vs Expense */}
          <div style={{ background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)', padding: '20px 16px', boxShadow: 'var(--shadow-card)' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '16px' }}>Income vs Expense</div>
            <div style={{ width: '100%', height: 200 }}>
              <ResponsiveContainer>
                <BarChart data={incExpData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" vertical={false} />
                  <XAxis dataKey="name" stroke="var(--text-muted)" tick={{ fontSize: 11 }} />
                  <YAxis stroke="var(--text-muted)" tick={{ fontSize: 11 }} />
                  <Tooltip cursor={{ fill: 'rgba(255,255,255,0.05)' }} contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '8px' }} />
                  <Bar dataKey="amount" radius={[6, 6, 0, 0]} barSize={30} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {!isPro && (
          <div style={{
            position: 'absolute', top: '40px', left: 0, right: 0, bottom: 0,
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            zIndex: 10
          }}>
            <div style={{
              background: 'var(--bg-card)', padding: '24px', borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border-focus)', boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
              textAlign: 'center', maxWidth: '300px'
            }}>
              <Lock size={32} color="var(--accent-primary)" style={{ margin: '0 auto 12px' }} />
              <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '8px', color: 'var(--text-primary)' }}>Unlock Pro Analytics</h3>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '16px', fontSize: '0.9rem' }}>
                Get deep insights into your spending habits.
              </p>
              <button 
                onClick={() => setShowPaywall(true)}
                style={{
                  background: 'var(--accent-primary)', color: '#000', border: 'none',
                  padding: '10px 20px', borderRadius: 'var(--radius-full)',
                  fontWeight: '700', fontSize: '1rem', cursor: 'pointer',
                  boxShadow: 'var(--shadow-glow)', width: '100%'
                }}
              >
                Learn More
              </button>
            </div>
          </div>
        )}
      </div>

      <ProPaywallModal 
        isOpen={showPaywall} 
        onClose={() => setShowPaywall(false)} 
        onUpgrade={() => {
          upgradeToPro();
          setShowPaywall(false);
        }} 
      />
    </div>
  );
}
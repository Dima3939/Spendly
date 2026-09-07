import React from 'react';
import { useTranslation } from 'react-i18next';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { DEFAULT_CATEGORIES } from '../services/StorageService';
import { catMap } from './CategoryGrid';

export default function Analytics({ expenses = [], salary = 0 }) {
  const { t } = useTranslation();

  // Aggregate totals
  const totalIncomes = salary + expenses
    .filter(t => t && Number(t.amount) > 0)
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const totalExpenses = expenses
    .filter(t => t && Number(t.amount) < 0)
    .reduce((sum, t) => sum + Math.abs(Number(t.amount)), 0);

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
      emoji: found ? found.emoji : '💸',
      value: categoryMap[catName]
    };
  }).sort((a, b) => b.value - a.value);

  const palette = ['#38bdf8', '#f43f5e', '#10b981', '#fbbf24', '#a855f7', '#f97316', '#06b6d4', '#ec4899'];

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

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Summary Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '10px'
      }}>
        <div style={{
          background: 'var(--bg-card)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-subtle)',
          padding: '16px',
          boxShadow: 'var(--shadow-card)'
        }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
            {t('totalIncomes', 'Всего доходов')}
          </div>
          <div style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--accent-success)' }}>
            +{totalIncomes.toLocaleString('ru-RU')} ₴
          </div>
        </div>

        <div style={{
          background: 'var(--bg-card)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-subtle)',
          padding: '16px',
          boxShadow: 'var(--shadow-card)'
        }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
            {t('totalExpenses', 'Всего расходов')}
          </div>
          <div style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--accent-danger)' }}>
            -{totalExpenses.toLocaleString('ru-RU')} ₴
          </div>
        </div>
      </div>

      {/* Net Balance Card */}
      <div style={{
        background: 'var(--bg-card)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-subtle)',
        padding: '16px 20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '2px' }}>
            {t('freeBalance', 'Свободный остаток')}
          </div>
          <div style={{
            fontSize: '1.4rem',
            fontWeight: '800',
            color: saved >= 0 ? 'var(--accent-success)' : 'var(--accent-danger)'
          }}>
            {saved.toLocaleString('ru-RU')} ₴
          </div>
        </div>
        <div style={{ fontSize: '2rem' }}>
          {saved >= 0 ? '💰' : '⚠️'}
        </div>
      </div>

      {/* Category Chart */}
      <div style={{
        background: 'var(--bg-card)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-subtle)',
        padding: '20px 16px',
        boxShadow: 'var(--shadow-card)'
      }}>
        <div style={{
          fontSize: '0.85rem',
          fontWeight: '700',
          color: 'var(--text-primary)',
          marginBottom: '16px'
        }}>
          {t('whereMoneyGoes', 'Куда уходят деньги')}
        </div>

        {barData.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '30px 0', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            {t('noDataChart', 'Нет данных для построения графика')}
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
    </div>
  );
}
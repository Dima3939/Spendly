import React, { useState } from 'react';

export default function PeriodSetup({ onPeriodCreated }) {
  const [amount, setAmount] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Quick date presets
  const setQuickEndDate = (days) => {
    const target = new Date();
    target.setDate(target.getDate() + days);
    setEndDate(target.toISOString().split('T')[0]);
  };

  const setEndOfMonth = () => {
    const target = new Date();
    const lastDay = new Date(target.getFullYear(), target.getMonth() + 1, 0);
    setEndDate(lastDay.toISOString().split('T')[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const num = parseFloat(amount);
    if (!num || num <= 0) {
      setError('Укажи сумму денег на период');
      return;
    }
    if (!endDate) {
      setError('Выбери дату окончания периода');
      return;
    }

    setLoading(true);
    const today = new Date().toISOString().split('T')[0];

    onPeriodCreated({
      initial_income: num,
      start_date: today,
      end_date: endDate
    });
  };

  const minDate = new Date().toISOString().split('T')[0];

  return (
    <div className="animate-fade-in" style={{
      background: 'var(--bg-card)',
      borderRadius: 'var(--radius-xl)',
      border: '1px solid var(--border-subtle)',
      padding: '28px 20px',
      boxShadow: 'var(--shadow-card)',
      marginTop: '10px'
    }}>
      {/* Greeting Header */}
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <div style={{ fontSize: '3rem', marginBottom: '10px' }}>🎯</div>
        <h2 style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '6px' }}>
          Настроим твой бюджет
        </h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
          Spendly рассчитает дневной лимит и будет ежедневно пересчитывать его под твои траты
        </p>
      </div>

      {error && (
        <div style={{
          background: 'var(--accent-danger-bg)',
          color: 'var(--accent-danger)',
          borderRadius: 'var(--radius-md)',
          padding: '10px 14px',
          fontSize: '0.85rem',
          fontWeight: '600',
          marginBottom: '16px',
          textAlign: 'center'
        }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Step 1: Total Amount */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{
            display: 'block',
            fontSize: '0.82rem',
            fontWeight: '700',
            color: 'var(--text-secondary)',
            marginBottom: '8px'
          }}>
            1. Сколько всего денег на руках (₴ тугриков)?
          </label>
          <div style={{
            background: 'var(--bg-input)',
            borderRadius: 'var(--radius-lg)',
            border: '2px solid var(--border-subtle)',
            padding: '12px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <input
              type="number"
              step="any"
              placeholder="Например, 30000"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-primary)',
                fontSize: '1.4rem',
                fontWeight: '700',
                width: '100%',
                outline: 'none'
              }}
              required
            />
            <span style={{ fontSize: '1.2rem', fontWeight: '700', color: 'var(--accent-primary)' }}>
              ₴
            </span>
          </div>

          {/* Quick Amount Presets */}
          <div style={{ display: 'flex', gap: '6px', marginTop: '8px' }}>
            {[10000, 25000, 50000].map(val => (
              <button
                key={val}
                type="button"
                onClick={() => setAmount(val.toString())}
                style={{
                  background: 'var(--bg-card-hover)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '6px 10px',
                  fontSize: '0.75rem',
                  color: 'var(--text-secondary)',
                  fontWeight: '600'
                }}
              >
                {val.toLocaleString('ru-RU')} ₴
              </button>
            ))}
          </div>
        </div>

        {/* Step 2: Target Date */}
        <div style={{ marginBottom: '28px' }}>
          <label style={{
            display: 'block',
            fontSize: '0.82rem',
            fontWeight: '700',
            color: 'var(--text-secondary)',
            marginBottom: '8px'
          }}>
            2. До какого числа нужно растянуть?
          </label>
          <input
            type="date"
            min={minDate}
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            style={{
              width: '100%',
              background: 'var(--bg-input)',
              border: '2px solid var(--border-subtle)',
              borderRadius: 'var(--radius-lg)',
              color: 'var(--text-primary)',
              padding: '12px 16px',
              fontSize: '1rem',
              fontWeight: '600',
              outline: 'none',
              marginBottom: '8px'
            }}
            required
          />

          {/* Quick Date Chips */}
          <div style={{ display: 'flex', gap: '6px' }}>
            <button
              type="button"
              onClick={() => setQuickEndDate(14)}
              style={{
                flex: 1,
                background: 'var(--bg-card-hover)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-sm)',
                padding: '6px 4px',
                fontSize: '0.75rem',
                color: 'var(--text-secondary)',
                fontWeight: '600'
              }}
            >
              14 дней
            </button>
            <button
              type="button"
              onClick={setEndOfMonth}
              style={{
                flex: 1,
                background: 'var(--bg-card-hover)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-sm)',
                padding: '6px 4px',
                fontSize: '0.75rem',
                color: 'var(--text-secondary)',
                fontWeight: '600'
              }}
            >
              Конец месяца
            </button>
            <button
              type="button"
              onClick={() => setQuickEndDate(30)}
              style={{
                flex: 1,
                background: 'var(--bg-card-hover)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-sm)',
                padding: '6px 4px',
                fontSize: '0.75rem',
                color: 'var(--text-secondary)',
                fontWeight: '600'
              }}
            >
              30 дней
            </button>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            background: 'linear-gradient(135deg, var(--accent-primary) 0%, #0284c7 100%)',
            color: '#ffffff',
            borderRadius: 'var(--radius-md)',
            padding: '16px',
            fontSize: '1.05rem',
            fontWeight: '700',
            boxShadow: 'var(--shadow-glow)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}
        >
          {loading ? 'Запуск...' : 'Начать учет 🚀'}
        </button>
      </form>
    </div>
  );
}
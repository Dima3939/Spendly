import React, { useState } from 'react';
import databaseService from '../services/SupabaseService';

const PeriodSetup = ({ userId, onPeriodCreated, theme }) => {
  const [amount, setAmount] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isCli = theme === 'CLI';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!amount || !endDate) {
      setError(isCli ? 'ОШИБКА: Заполните все поля системы.' : 'Пожалуйста, заполните все поля формы.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const today = new Date().toISOString().split('T')[0];
      
      const newPeriod = await databaseService.createPeriod({
        user_id: userId,
        start_date: today,
        end_date: endDate,
        initial_income: parseFloat(amount)
      });

      onPeriodCreated(newPeriod);
    } catch (err) {
      setError(isCli ? `КРИТИЧЕСКАЯ ОШИБКА БД: ${err.message}` : `Ошибка при сохранении данных: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      border: isCli ? '1px solid #facc15' : '1px solid #334155',
      padding: '20px',
      backgroundColor: isCli ? '#0a0a0a' : '#1e293b',
      maxWidth: '400px',
      margin: '40px auto',
      fontFamily: 'monospace',
      boxShadow: isCli ? '0 0 15px rgba(250, 204, 21, 0.1)' : '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      borderRadius: isCli ? '0' : '8px',
      boxSizing: 'border-box'
    }}>
      <h3 style={{ 
        color: isCli ? '#facc15' : '#38bdf8', 
        textTransform: 'uppercase', 
        marginTop: 0, 
        textAlign: 'center',
        fontSize: '1.05rem',
        letterSpacing: '0.5px'
      }}>
        {isCli ? '[ИНИЦИАЛИЗАЦИЯ НОВОГО ПЕРИОДА]' : 'Инициализация нового периода'}
      </h3>
      <p style={{ color: isCli ? '#888' : '#94a3b8', fontSize: '13px', lineHeight: '1.4', textAlign: 'center' }}>
        {isCli 
          ? 'Система не обнаружила активных финансовых периодов для вашего аккаунта. Пожалуйста, задайте стартовые параметры.'
          : 'Активные финансовые периоды не обнаружены. Пожалуйста, задайте стартовые параметры для начала работы.'
        }
      </p>

      {error && <div style={{ color: '#ff5555', marginBottom: '15px', fontSize: '0.85rem', fontWeight: 'bold' }}>{error}</div>}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ color: isCli ? '#facc15' : '#94a3b8', display: 'block', marginBottom: '5px', fontSize: '0.8rem' }}>
            {isCli ? 'СУММА В НАЛИЧИИ (ГРН):' : 'Сумма в наличии (₴):'}
          </label>
          <input
            type="number"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            disabled={loading}
            style={{
              width: '100%',
              backgroundColor: isCli ? '#000' : '#0f172a',
              border: isCli ? '1px solid #444' : '1px solid #475569',
              color: isCli ? '#facc15' : '#fff',
              padding: '8px',
              boxSizing: 'border-box',
              outline: 'none',
              fontFamily: 'monospace',
              borderRadius: isCli ? '0' : '4px'
            }}
            placeholder={isCli ? "Например: 50000" : "Введите сумму"}
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ color: isCli ? '#facc15' : '#94a3b8', display: 'block', marginBottom: '5px', fontSize: '0.8rem' }}>
            {isCli ? 'ИСПОЛЬЗОВАТЬ ДО (ДАТА):' : 'Использовать до (Дата):'}
          </label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            disabled={loading}
            style={{
              width: '100%',
              backgroundColor: isCli ? '#000' : '#0f172a',
              border: isCli ? '1px solid #444' : '1px solid #475569',
              color: isCli ? '#facc15' : '#fff',
              padding: '8px',
              boxSizing: 'border-box',
              outline: 'none',
              fontFamily: 'monospace',
              borderRadius: isCli ? '0' : '4px'
            }}
            min={new Date().toISOString().split('T')[0]}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            backgroundColor: isCli ? '#facc15' : '#38bdf8',
            color: '#000',
            border: 'none',
            padding: '10px',
            fontWeight: 'bold',
            cursor: 'pointer',
            fontFamily: 'monospace',
            textTransform: 'uppercase',
            borderRadius: isCli ? '0' : '4px',
            transition: 'background-color 0.2s'
          }}
        >
          {loading 
            ? (isCli ? 'ЗАПИСЬ В СЕКТОР БД...' : 'Сохранение...') 
            : (isCli ? 'ЗАПУСТИТЬ ПЕРИОД' : 'Начать период')
          }
        </button>
      </form>
    </div>
  );
};

export default PeriodSetup;
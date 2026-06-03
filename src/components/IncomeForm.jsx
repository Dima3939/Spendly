import React, { useState } from 'react';

export default function IncomeForm({ onAddIncome, theme }) {
  const [isOpen, setIsOpen] = useState(false);
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');

  const isCli = theme === 'CLI';
  const mainColor = isCli ? '#facc15' : '#10b981'; // Для доходов в модерне сделаем приятный зеленый
  const inputBg = isCli ? '#000' : '#0f172a';
  const borderStyle = isCli ? `1px solid ${mainColor}` : `1px solid #334155`;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!amount) return;

    onAddIncome({
      amount: amount,
      category: 'Доход',
      description: description || (isCli ? 'ДОЗАПРАВКА БЮДЖЕТА' : 'Дозаправка бюджета')
    });

    setAmount('');
    setDescription('');
    setIsOpen(false);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        style={{
          width: '100%',
          backgroundColor: 'transparent',
          border: `1px solid ${mainColor}`,
          color: mainColor,
          padding: '10px',
          fontWeight: 'bold',
          cursor: 'pointer',
          fontFamily: 'monospace',
          textTransform: 'uppercase',
          marginBottom: '20px',
          outline: 'none',
          borderRadius: isCli ? '0' : '4px'
        }}
      >
        {isCli ? '[+ ВНЕСТИ ДОХОД / ДОЗАПРАВКА]' : '+ Внести доход'}
      </button>
    );
  }

  return (
    <div style={{ 
      border: `1px solid ${mainColor}`, 
      padding: '15px', 
      backgroundColor: isCli ? '#000' : '#1e293b', 
      marginBottom: '20px',
      borderRadius: isCli ? '0' : '6px'
    }}>
      <h3 style={{ margin: '0 0 12px 0', color: mainColor, fontSize: '0.9rem', textTransform: 'uppercase' }}>
        {isCli ? '[ОПЕРАЦИЯ: ДОХОД]' : 'Новое поступление'}
      </h3>
      
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '12px' }}>
          <input
            type="number"
            step="0.01"
            placeholder={isCli ? 'СУММА (₴)' : 'Сумма поступления (₴)'}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            style={{
              width: '100%',
              backgroundColor: inputBg,
              border: borderStyle,
              color: '#fff',
              padding: '8px',
              boxSizing: 'border-box',
              outline: 'none',
              fontFamily: 'monospace',
              borderRadius: isCli ? '0' : '4px'
            }}
            required
          />
        </div>

        <div style={{ marginBottom: '12px' }}>
          <input
            type="text"
            placeholder={isCli ? 'ИСТОЧНИК (ФРИЛАНС, АВАНС...)' : 'Источник (например: Фриланс, Проект)'}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{
              width: '100%',
              backgroundColor: inputBg,
              border: borderStyle,
              color: '#fff',
              padding: '8px',
              boxSizing: 'border-box',
              outline: 'none',
              fontFamily: 'monospace',
              borderRadius: isCli ? '0' : '4px'
            }}
          />
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            type="submit"
            style={{
              flex: 1,
              backgroundColor: mainColor,
              color: '#000',
              border: 'none',
              padding: '8px',
              fontWeight: 'bold',
              cursor: 'pointer',
              fontFamily: 'monospace',
              textTransform: 'uppercase',
              borderRadius: isCli ? '0' : '4px'
            }}
          >
            {isCli ? '[ОК]' : 'Провести'}
          </button>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            style={{
              backgroundColor: 'transparent',
              border: isCli ? '1px solid #444' : '1px solid #475569',
              color: '#888',
              padding: '8px 15px',
              cursor: 'pointer',
              fontFamily: 'monospace',
              borderRadius: isCli ? '0' : '4px'
            }}
          >
            {isCli ? '[Х]' : 'Отмена'}
          </button>
        </div>
      </form>
    </div>
  );
}
import React from 'react';

export default function Dashboard({ 
  availableToday, 
  baseDailyLimit, 
  currentBalance, 
  salary, 
  daysRemaining, 
  totalSpent, 
  todaySpent,
  todayIncomes = 0, // ФИКС: Принимаем переменную из пропсов
  theme
}) {
  const isCli = theme === 'CLI';
  
  // Цветовая схема в зависимости от темы и баланса
  const todayColor = availableToday < 0 
    ? (isCli ? '#ff5555' : '#f43f5e') 
    : (isCli ? '#facc15' : '#38bdf8');

  const sectionBg = isCli ? '#1a1a1a' : '#1e293b';
  const borderColor = isCli ? '#facc15' : '#38bdf8';
  const successColor = isCli ? '#00ff66' : '#4ade80';

  return (
    <section style={{ 
      marginBottom: '30px', 
      background: sectionBg, 
      padding: '15px', 
      borderRadius: isCli ? '4px' : '6px', 
      borderLeft: `3px solid ${borderColor}` 
    }}>
      
      <div style={{ fontSize: '0.9rem', color: '#888', letterSpacing: '0.5px' }}>
        {isCli ? 'ДОСТУПНО НА СЕГОДНЯ:' : 'Доступно на сегодня:'}
      </div>
      <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: todayColor, margin: '5px 0' }}>
        {Number(availableToday).toFixed(2)} ₴
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.85rem', marginTop: '12px', borderTop: isCli ? '1px dashed #333' : '1px dashed #334155', paddingTop: '10px' }}>
        
        <div>
          <span style={{ color: '#888' }}>{isCli ? 'Базовый лимит дня:' : 'Базовый лимит дня:'}</span>{' '}
          <span style={{ color: successColor }}>{Number(baseDailyLimit).toFixed(2)} ₴</span>
        </div>

        <div>
          <span style={{ color: '#888' }}>{isCli ? 'Общий остаток:' : 'Общий остаток:'}</span>{' '}
          {Number(currentBalance).toFixed(2)} / {salary}{' '}
          <span style={{ color: borderColor }}>на {daysRemaining} дн.</span>
        </div>

        <div>
          <span style={{ color: '#888' }}>{isCli ? 'Расход / Доход сегодня:' : 'Расход / Доход сегодня:'}</span>{' '}
          <span style={{ color: '#ff5555' }}>-{Number(todaySpent).toFixed(2)}</span>
          {' / '}
          <span style={{ color: successColor }}>+{Number(todayIncomes).toFixed(2)}</span>
        </div>
        
      </div>
    </section>
  );
}
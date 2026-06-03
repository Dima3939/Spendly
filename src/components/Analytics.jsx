import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid } from 'recharts';

export default function Analytics({ expenses = [], allTransactions = [], salary = 0, allPeriods = [], theme }) {
  const [scope, setScope] = useState('period');
  const isCli = theme === 'CLI';

  const activeData = scope === 'period' ? expenses : allTransactions;

  const initialIncome = scope === 'period'
    ? Number(salary || 0)
    : allPeriods.reduce((sum, p) => sum + Number(p?.initial_income || 0), 0);

  const totalIncomes = initialIncome + activeData
    .filter(t => t && Number(t.amount) > 0)
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const totalExpenses = activeData
    .filter(t => t && Number(t.amount) < 0)
    .reduce((sum, t) => sum + Math.abs(Number(t.amount)), 0);

  const saved = totalIncomes - totalExpenses;

  // Группировка расходов по категориям
  const categoryMap = {};
  activeData.filter(t => t && Number(t.amount) < 0).forEach(t => {
    categoryMap[t.category] = (categoryMap[t.category] || 0) + Math.abs(Number(t.amount));
  });

  const barData = Object.keys(categoryMap).map(cat => ({
    name: cat,
    value: categoryMap[cat]
  })).sort((a, b) => b.value - a.value);

  // Палитра диаграммы
  const categoryColors = isCli 
    ? ['#facc15', '#ff5555', '#38bdf8', '#4ade80', '#c084fc', '#fb923c'] 
    : ['#38bdf8', '#f43f5e', '#10b981', '#fbbf24', '#a78bfa', '#f97316'];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{ backgroundColor: isCli ? '#000' : '#0f172a', border: isCli ? '1px solid #333' : '1px solid #334155', padding: '8px', fontSize: '0.8rem' }}>
          <p style={{ margin: 0, color: '#fff' }}>{`${payload[0].name.toUpperCase()} : ${payload[0].value.toFixed(2)} ₴`}</p>
        </div>
      );
    }
    return null;
  };

  const borderStyle = isCli ? '1px solid #333' : '1px solid #334155';
  const activeBtnBg = isCli ? '#facc15' : '#38bdf8';

  return (
    <div>
      {/* ПЕРЕКЛЮЧАТЕЛЬ МАСШТАБА */}
      <div style={{ display: 'flex', gap: '5px', marginBottom: '15px' }}>
        <button 
          onClick={() => setScope('period')}
          style={{ flex: 1, padding: '6px', fontFamily: 'inherit', fontSize: '0.75rem', cursor: 'pointer', border: borderStyle, backgroundColor: scope === 'period' ? activeBtnBg : 'transparent', color: scope === 'period' ? '#000' : '#888', borderRadius: isCli ? '0' : '4px' }}
        >
          {isCli ? '[ТЕКУЩИЙ ПЕРИОД]' : 'Текущий период'}
        </button>
        <button 
          onClick={() => setScope('all')}
          style={{ flex: 1, padding: '6px', fontFamily: 'inherit', fontSize: '0.75rem', cursor: 'pointer', border: borderStyle, backgroundColor: scope === 'all' ? activeBtnBg : 'transparent', color: scope === 'all' ? '#000' : '#888', borderRadius: isCli ? '0' : '4px' }}
        >
          {isCli ? '[ЗА ВСЁ ВРЕМЯ]' : 'За всё время'}
        </button>
      </div>

      {/* ФИНАНСОВЫЕ СВОДКИ */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', backgroundColor: isCli ? '#111' : '#1e293b', padding: '12px', fontSize: '0.85rem', marginBottom: '20px', borderRadius: isCli ? '0' : '6px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ color: '#888' }}>{isCli ? 'ОБЩИЙ ВЛИЯНИЕ / ДОХОД:' : 'Всего доходов:'}</span>
          <span style={{ color: isCli ? '#00ff66' : '#10b981', fontWeight: 'bold' }}>{totalIncomes.toFixed(2)} ₴</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ color: '#888' }}>{isCli ? 'ОБЩИЙ СЛИВ / РАСХОД:' : 'Всего расходов:'}</span>
          <span style={{ color: isCli ? '#ff5555' : '#f43f5e', fontWeight: 'bold' }}>{totalExpenses.toFixed(2)} ₴</span>
        </div>
        <div style={{ height: '1px', backgroundColor: isCli ? '#222' : '#334155', margin: '5px 0' }}></div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ color: '#888' }}>{isCli ? 'СВОБОДНЫЙ ОСТАТОК (ДЕЛЬТА):' : 'Чистый остаток:'}</span>
          <span style={{ color: saved >= 0 ? (isCli ? '#00ff66' : '#10b981') : (isCli ? '#ff5555' : '#f43f5e'), fontWeight: 'bold' }}>
            {saved.toFixed(2)} ₴
          </span>
        </div>
      </div>

      {/* ГРАФИК РАСХОДОВ */}
      <div style={{ border: borderStyle, padding: '15px 10px 15px 0px', backgroundColor: isCli ? '#000' : '#111827', borderRadius: isCli ? '0' : '6px' }}>
        <div style={{ fontSize: '0.8rem', color: '#888', paddingLeft: '15px', marginBottom: '15px', letterSpacing: '0.5px' }}>
          {isCli ? '[РАСПРЕДЕЛЕНИЕ РАСХОДОВ]' : 'Распределение расходов'}
        </div>

        {barData.length === 0 ? (
          <div style={{ color: '#555', fontSize: '0.8rem', fontStyle: 'italic', textAlign: 'center', padding: '20px 0' }}>
            {isCli ? 'НЕТ ДАННЫХ ДЛЯ МАТРИЦЫ' : 'Нет данных для анализа'}
          </div>
        ) : (
          <div style={{ width: '100%', height: 180, fontFamily: 'monospace', fontSize: '10px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} layout="vertical" margin={{ top: 0, right: 10, left: -15, bottom: 0 }}>
                <CartesianGrid stroke={isCli ? '#151515' : '#1f2937'} strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" stroke="#444" tick={{ fill: '#666' }} />
                <YAxis dataKey="name" type="category" stroke="#444" tick={{ fill: '#aaa' }} width={85} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.02)' }} />
                <Bar dataKey="value" radius={isCli ? 0 : 3} barSize={10}>
                  {barData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={categoryColors[index % categoryColors.length]} />
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
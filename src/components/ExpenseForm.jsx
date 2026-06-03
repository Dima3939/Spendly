import React, { useState, useEffect } from 'react';

export default function ExpenseForm({ onAddExpense, categories, onAddCategory, theme }) {
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState(categories[0] || 'Продукты');
  const [description, setDescription] = useState('');

  const [showAddCat, setShowAddCat] = useState(false);
  const [newCatName, setNewCatName] = useState('');

  const isCli = theme === 'CLI';
  const containerBg = isCli ? '#000' : '#1e293b';
  const borderStyle = isCli ? '1px solid #333' : '1px solid #334155';
  const inputBg = isCli ? '#000' : '#0f172a';
  const actionColor = isCli ? '#ff5555' : '#f43f5e';

  useEffect(() => {
    if (categories && categories.length > 0 && !categories.includes(category)) {
      setCategory(categories[0]);
    }
  }, [categories]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!amount || Number(amount) <= 0) return;

    onAddExpense({
      amount: amount,
      category: category,
      description: description.trim()
    });

    setAmount('');
    setDescription('');
    setCategory(categories[0] || 'Продукты');
  };

  const handleCreateCategory = () => {
    if (!newCatName.trim()) return;
    onAddCategory(newCatName.trim());
    setCategory(newCatName.trim());
    setNewCatName('');
    setShowAddCat(false);
  };

  return (
    <form onSubmit={handleSubmit} style={{ 
      border: borderStyle, 
      padding: '15px', 
      borderRadius: isCli ? '0' : '6px', 
      marginBottom: '15px', 
      backgroundColor: containerBg,
      display: 'flex',
      flexDirection: 'column',
      gap: '12px'
    }}>
      
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <span style={{ color: '#888', width: '90px', fontSize: '0.85rem' }}>{isCli ? 'СУММА:' : 'Сумма:'}</span>
        <input
          type="number"
          step="0.01"
          placeholder="0.00 ₴"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          style={{ backgroundColor: inputBg, border: borderStyle, color: '#fff', padding: '6px 8px', fontFamily: 'monospace', fontSize: '0.9rem', outline: 'none', flex: 1, borderRadius: isCli ? '0' : '4px' }}
          required
        />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span style={{ color: '#888', width: '90px', fontSize: '0.85rem' }}>{isCli ? 'КАТЕГОРИЯ:' : 'Категория:'}</span>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            style={{ backgroundColor: inputBg, border: borderStyle, color: '#fff', padding: '6px', fontFamily: 'monospace', fontSize: '0.9rem', outline: 'none', flex: 1, cursor: 'pointer', borderRadius: isCli ? '0' : '4px' }}
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {isCli ? cat.toUpperCase() : cat}
              </option>
            ))}
          </select>
          
          {!showAddCat && (
            <button
              type="button"
              onClick={() => setShowAddCat(true)}
              style={{ marginLeft: '5px', backgroundColor: 'transparent', border: borderStyle, color: isCli ? '#facc15' : '#38bdf8', padding: '6px 10px', cursor: 'pointer', fontFamily: 'monospace', borderRadius: isCli ? '0' : '4px' }}
            >
              +
            </button>
          )}
        </div>

        {showAddCat && (
          <div style={{ display: 'flex', alignItems: 'center', marginLeft: '90px', gap: '5px', marginTop: '2px' }}>
            <input 
              type="text" 
              placeholder={isCli ? 'НОВАЯ КАТЕГОРИЯ' : 'Название категории'}
              value={newCatName}
              onChange={(e) => setNewCatName(e.target.value)}
              style={{ backgroundColor: inputBg, border: borderStyle, color: '#fff', padding: '4px 6px', fontSize: '0.8rem', fontFamily: 'monospace', flex: 1, outline: 'none', borderRadius: isCli ? '0' : '4px' }}
            />
            <button type="button" onClick={handleCreateCategory} style={{ background: isCli ? '#facc15' : '#38bdf8', color: '#000', border: 'none', padding: '4px 8px', fontSize: '0.8rem', fontWeight: 'bold', cursor: 'pointer', borderRadius: isCli ? '0' : '4px' }}>
              [OK]
            </button>
            <button type="button" onClick={() => { setShowAddCat(false); setNewCatName(''); }} style={{ background: 'none', border: borderStyle, color: '#888', padding: '4px 8px', fontSize: '0.8rem', cursor: 'pointer', borderRadius: isCli ? '0' : '4px' }}>
              [X]
            </button>
          </div>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center' }}>
        <span style={{ color: '#888', width: '90px', fontSize: '0.85rem' }}>{isCli ? 'ОПИСАНИЕ:' : 'Описание:'}</span>
        <input
          type="text"
          placeholder={isCli ? 'АТБ, СИЛЬПО, СТО...' : 'Где или на что потрачено'}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={{ backgroundColor: inputBg, border: borderStyle, color: '#fff', padding: '6px 8px', fontFamily: 'monospace', fontSize: '0.9rem', outline: 'none', flex: 1, borderRadius: isCli ? '0' : '4px' }}
        />
      </div>

      <button
        type="submit"
        style={{ 
          backgroundColor: 'transparent', 
          border: `1px solid ${actionColor}`, 
          color: actionColor, 
          padding: '10px', 
          fontFamily: 'monospace', 
          fontWeight: 'bold', 
          cursor: 'pointer', 
          textTransform: 'uppercase', 
          fontSize: '0.85rem',
          marginTop: '5px',
          borderRadius: isCli ? '0' : '4px'
        }}
      >
        {isCli ? '[ЗАРЕГИСТРИРОВАТЬ РАСХОД]' : 'Зафиксировать расход'}
      </button>
    </form>
  );
}
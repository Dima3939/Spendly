import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import { X, Camera } from 'lucide-react';
import { DEFAULT_CATEGORIES } from '../services/StorageService';

export default function WebTransactionModal({ isOpen, onClose, onAddExpense, onAddIncome , currency}) {
  const { t } = useTranslation();
  
  const [type, setType] = useState('expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState(DEFAULT_CATEGORIES[0]?.name || 'Other');
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [tags, setTags] = useState('');
  
  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!amount || Number(amount) <= 0) return;
    
    if (type === 'expense') {
      onAddExpense({
        amount,
        category,
        description: title,
        date: date + 'T12:00:00Z'
      });
    } else {
      onAddIncome({
        amount,
        category,
        description: title,
        date: date + 'T12:00:00Z'
      });
    }
    
    setAmount('');
    setTitle('');
    setTags('');
    setDate(new Date().toISOString().split('T')[0]);
    onClose();
  };

  return createPortal(
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 99999
    }} onClick={onClose}>
      
      <div 
        className="animate-fade-in"
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'var(--bg-card)',
          borderRadius: 'var(--radius-lg)',
          width: '100%',
          maxWidth: '560px',
          border: '1px solid var(--border-subtle)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
          overflow: 'hidden'
        }}
      >
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '24px',
          borderBottom: '1px solid var(--border-subtle)'
        }}>
          <div>
            <div style={{ color: 'var(--accent-primary)', fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>
              New Transaction
            </div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: '800', margin: 0 }}>Log an entry</h2>
          </div>
          
          <button 
            onClick={onClose}
            style={{
              background: 'transparent',
              color: 'var(--text-muted)',
              padding: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 'var(--radius-sm)'
            }}
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '24px' }}>
          
          {/* Scan Receipt Placeholder */}
          <div style={{
            border: '1px dashed var(--accent-success)',
            background: 'var(--accent-success-bg)',
            borderRadius: 'var(--radius-md)',
            padding: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            marginBottom: '24px',
            cursor: 'pointer'
          }}>
            <div style={{ color: 'var(--accent-success)' }}>
              <Camera size={24} />
            </div>
            <div>
              <div style={{ fontWeight: '600', color: 'var(--text-primary)' }}>Scan a receipt</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Take a photo or choose one from your library</div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
            {/* Type */}
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '8px', color: 'var(--text-primary)' }}>Type</label>
              <select 
                value={type} 
                onChange={e => setType(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  background: 'var(--bg-input)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-sm)',
                  color: 'var(--text-primary)',
                  fontSize: '0.95rem',
                  outline: 'none',
                  cursor: 'pointer'
                }}
              >
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
            </div>

            {/* Merchant / Source */}
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '8px', color: 'var(--text-primary)' }}>Merchant or source</label>
              <input 
                type="text" 
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="e.g. Starbucks, Salary"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  background: 'var(--bg-input)',
                  border: '1px solid var(--border-focus)', // Highlighted like in screenshot
                  borderRadius: 'var(--radius-sm)',
                  color: 'var(--text-primary)',
                  fontSize: '0.95rem',
                  outline: 'none'
                }}
              />
            </div>

            {/* Amount */}
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '8px', color: 'var(--text-primary)' }}>Amount ({currency})</label>
              <input 
                type="number" 
                step="0.01"
                min="0"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                placeholder="0.00"
                required
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  background: 'var(--bg-input)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-sm)',
                  color: 'var(--text-primary)',
                  fontSize: '0.95rem',
                  outline: 'none'
                }}
              />
            </div>

            {/* Date */}
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '8px', color: 'var(--text-primary)' }}>Date</label>
              <input 
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  background: 'var(--bg-input)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-sm)',
                  color: 'var(--text-primary)',
                  fontSize: '0.95rem',
                  outline: 'none'
                }}
              />
            </div>

            {/* Category */}
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '8px', color: 'var(--text-primary)' }}>Category</label>
              <select 
                value={category}
                onChange={e => setCategory(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  background: 'var(--bg-input)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-sm)',
                  color: 'var(--text-primary)',
                  fontSize: '0.95rem',
                  outline: 'none',
                  cursor: 'pointer'
                }}
              >
                {DEFAULT_CATEGORIES.map(c => (
                  <option key={c.name} value={c.name}>{c.emoji} {t('cat' + c.name) || c.name}</option>
                ))}
              </select>
            </div>

            {/* Tags */}
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '8px', color: 'var(--text-primary)' }}>Tags</label>
              <input 
                type="text" 
                value={tags}
                onChange={e => setTags(e.target.value)}
                placeholder="work, travel"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  background: 'var(--bg-input)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-sm)',
                  color: 'var(--text-primary)',
                  fontSize: '0.95rem',
                  outline: 'none'
                }}
              />
            </div>
          </div>

          {/* Mark as needing review (mockup) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
            <input type="checkbox" id="review-checkbox" style={{ width: '16px', height: '16px', cursor: 'pointer' }} />
            <label htmlFor="review-checkbox" style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', cursor: 'pointer' }}>Mark as needing review</label>
          </div>

          <button 
            type="submit"
            style={{
              width: '100%',
              padding: '16px',
              background: 'var(--accent-success)',
              color: '#fff',
              fontSize: '1rem',
              fontWeight: '700',
              borderRadius: 'var(--radius-sm)',
              boxShadow: '0 4px 14px rgba(16, 185, 129, 0.4)'
            }}
          >
            Save transaction
          </button>
        </form>
      </div>
    </div>,
    document.body
  );
}

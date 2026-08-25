import React, { useState, useEffect, useRef } from 'react';
import { DEFAULT_CATEGORIES } from '../services/StorageService';

export default function QuickExpenseModal({
  isOpen,
  category,
  onClose,
  onSubmit
}) {
  const [amount, setAmount] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(category || DEFAULT_CATEGORIES[0]);
  const [description, setDescription] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    if (category) {
      setSelectedCategory(category);
    }
  }, [category]);

  useEffect(() => {
    if (isOpen) {
      setAmount('');
      setDescription('');
      setTimeout(() => {
        if (inputRef.current) inputRef.current.focus();
      }, 100);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleQuickAdd = (delta) => {
    const current = Number(amount) || 0;
    setAmount((current + delta).toString());
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const num = parseFloat(amount);
    if (!num || num <= 0) return;

    onSubmit({
      amount: num,
      category: selectedCategory.name,
      emoji: selectedCategory.emoji,
      description: description.trim()
    });

    onClose();
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.65)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'flex-end',
      justifyContent: 'center',
      zIndex: 9999,
      padding: '0 0 0 0'
    }} onClick={onClose}>
      <div
        className="animate-slide-up"
        style={{
          width: '100%',
          maxWidth: '460px',
          backgroundColor: 'var(--bg-card)',
          borderTopLeftRadius: 'var(--radius-xl)',
          borderTopRightRadius: 'var(--radius-xl)',
          border: '1px solid var(--border-subtle)',
          padding: '24px 20px 32px 20px',
          boxShadow: '0 -10px 40px rgba(0,0,0,0.5)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '1.8rem' }}>{selectedCategory.emoji}</span>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--text-primary)' }}>
                {selectedCategory.name}
              </h3>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Расход в ₴ тугриках
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'var(--bg-input)',
              color: 'var(--text-muted)',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1rem',
              fontWeight: '700'
            }}
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Main Amount Input */}
          <div style={{
            background: 'var(--bg-input)',
            borderRadius: 'var(--radius-lg)',
            border: '2px solid var(--border-focus)',
            padding: '16px',
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}>
            <input
              ref={inputRef}
              type="number"
              step="any"
              placeholder="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-primary)',
                fontSize: '2.4rem',
                fontWeight: '800',
                textAlign: 'center',
                width: '100%',
                outline: 'none',
                letterSpacing: '-0.02em'
              }}
              required
            />
            <span style={{ fontSize: '1.8rem', fontWeight: '700', color: 'var(--accent-primary)' }}>
              ₴
            </span>
          </div>

          {/* Quick Amount Chips */}
          <div style={{
            display: 'flex',
            gap: '8px',
            marginBottom: '16px'
          }}>
            {[50, 100, 200, 500].map((val) => (
              <button
                key={val}
                type="button"
                onClick={() => handleQuickAdd(val)}
                style={{
                  flex: 1,
                  background: 'var(--bg-card-hover)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '8px 0',
                  color: 'var(--text-secondary)',
                  fontSize: '0.82rem',
                  fontWeight: '600'
                }}
              >
                +{val} ₴
              </button>
            ))}
          </div>

          {/* Note / Description */}
          <div style={{ marginBottom: '20px' }}>
            <input
              type="text"
              placeholder="Заметка (Сильпо, такси в центр, латте...)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{
                width: '100%',
                background: 'var(--bg-input)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--text-primary)',
                padding: '12px 14px',
                fontSize: '0.9rem',
                outline: 'none'
              }}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            style={{
              width: '100%',
              background: 'linear-gradient(135deg, var(--accent-danger) 0%, #e11d48 100%)',
              color: '#ffffff',
              borderRadius: 'var(--radius-md)',
              padding: '16px',
              fontSize: '1.05rem',
              fontWeight: '700',
              boxShadow: '0 4px 20px rgba(244, 63, 94, 0.35)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            Записать расход
          </button>
        </form>
      </div>
    </div>
  );
}

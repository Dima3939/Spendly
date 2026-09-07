import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';

export default function IncomeModal({ isOpen, onClose, onSubmit }) {
  const { t } = useTranslation();
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const inputRef = useRef(null);

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

  const handleSubmit = (e) => {
    e.preventDefault();
    const num = parseFloat(amount);
    if (!num || num <= 0) return;

    onSubmit({
      amount: num,
      category: t('incomeLabel'),
      description: description.trim() || t('budgetTopUp')
    });

    onClose();
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.65)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        zIndex: 9999
      }}
      onClick={onClose}
    >
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
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '1.8rem' }}>💰</span>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--text-primary)' }}>
                {t('addIncomeTitle')}
              </h3>
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
          <div style={{
            background: 'var(--bg-input)',
            borderRadius: 'var(--radius-lg)',
            border: '2px solid var(--accent-success)',
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
                outline: 'none'
              }}
              required
            />
            <span style={{ fontSize: '1.8rem', fontWeight: '700', color: 'var(--accent-success)' }}>
              ₴
            </span>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <input
              type="text"
              placeholder={t('descriptionOptional')}
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

          <button
            type="submit"
            style={{
              width: '100%',
              background: 'linear-gradient(135deg, var(--accent-success) 0%, #059669 100%)',
              color: '#ffffff',
              borderRadius: 'var(--radius-md)',
              padding: '16px',
              fontSize: '1.05rem',
              fontWeight: '700',
              boxShadow: '0 4px 20px rgba(16, 185, 129, 0.35)'
            }}
          >
            {t('add')}
          </button>
        </form>
      </div>
    </div>
  );
}

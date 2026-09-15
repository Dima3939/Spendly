import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import { X } from 'lucide-react';

export default function WebEditPeriodModal({ isOpen, onClose, currentPeriod, onUpdate , currency}) {
  const { t } = useTranslation();
  
  const [initialIncome, setInitialIncome] = useState('');
  const [endDate, setEndDate] = useState('');
  
  useEffect(() => {
    if (currentPeriod) {
      setInitialIncome(currentPeriod.initial_income || '');
      setEndDate(currentPeriod.end_date || '');
    }
  }, [currentPeriod, isOpen]);
  
  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!initialIncome || !endDate) return;
    
    onUpdate(currentPeriod.id, {
      initial_income: initialIncome,
      end_date: endDate
    });
    
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
          maxWidth: '460px',
          border: '1px solid var(--border-subtle)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
          overflow: 'hidden'
        }}
      >
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '24px',
          borderBottom: '1px solid var(--border-subtle)'
        }}>
          <div>
            <div style={{ color: 'var(--accent-primary)', fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>
              Settings
            </div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '800', margin: 0 }}>Edit Budget</h2>
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
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '24px' }}>
          
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '8px', color: 'var(--text-primary)' }}>
              Total Budget Amount ({currency})
            </label>
            <input 
              type="number" 
              step="0.01"
              min="0"
              value={initialIncome}
              onChange={e => setInitialIncome(e.target.value)}
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
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '6px' }}>
              Update the total amount available for this period.
            </p>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '8px', color: 'var(--text-primary)' }}>
              End Date
            </label>
            <input 
              type="date"
              value={endDate}
              onChange={e => setEndDate(e.target.value)}
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
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '6px' }}>
              Change when this budgeting period ends.
            </p>
          </div>

          <button 
            type="submit"
            style={{
              width: '100%',
              padding: '16px',
              background: 'var(--accent-primary)',
              color: '#fff',
              fontSize: '1rem',
              fontWeight: '700',
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(2, 132, 199, 0.4)'
            }}
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>,
    document.body
  );
}

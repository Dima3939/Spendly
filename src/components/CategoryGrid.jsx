import React from 'react';
import { DEFAULT_CATEGORIES } from '../services/StorageService';

export default function CategoryGrid({ onSelectCategory, onCustomExpense }) {
  return (
    <div style={{ marginBottom: '24px' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '12px',
        padding: '0 4px'
      }}>
        <span style={{
          fontSize: '0.78rem',
          fontWeight: '700',
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
          color: 'var(--text-muted)'
        }}>
          Быстрый расход
        </span>
        <button
          onClick={onCustomExpense}
          style={{
            background: 'none',
            color: 'var(--accent-primary)',
            fontSize: '0.78rem',
            fontWeight: '600',
            cursor: 'pointer'
          }}
        >
          + Своя сумма
        </button>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '10px'
      }}>
        {DEFAULT_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onSelectCategory(cat)}
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '14px 6px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--accent-primary)';
              e.currentTarget.style.background = 'var(--bg-card-hover)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--border-subtle)';
              e.currentTarget.style.background = 'var(--bg-card)';
            }}
          >
            <span style={{ fontSize: '1.6rem', lineHeight: '1' }}>{cat.emoji}</span>
            <span style={{
              fontSize: '0.78rem',
              fontWeight: '600',
              color: 'var(--text-secondary)'
            }}>
              {cat.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

export default function CurrencySwitcher({ currency, setCurrency }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const currencies = [
    { symbol: '₴', code: 'UAH' },
    { symbol: '$', code: 'USD' },
    { symbol: '€', code: 'EUR' },
    { symbol: '£', code: 'GBP' },
    { symbol: '¥', code: 'JPY' },
    { symbol: '₽', code: 'RUB' }
  ];

  const currentOption = currencies.find(c => c.symbol === currency) || currencies[0];

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectCurrency = (symbol) => {
    setCurrency(symbol);
    setIsOpen(false);
  };

  return (
    <div ref={dropdownRef} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', zIndex: 50 }}>
      <button 
        type="button"
        onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsOpen(!isOpen);
        }}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          background: 'transparent',
          border: 'none',
          padding: '4px 8px',
          borderRadius: 'var(--radius-sm)',
          color: 'var(--accent-primary)',
          fontSize: '1.25rem',
          fontWeight: '800',
          cursor: 'pointer',
          outline: 'none',
          transition: 'all 0.2s'
        }}
      >
        {currency}
        <ChevronDown size={16} style={{ transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
      </button>

      {isOpen && (
        <div style={{
          position: 'absolute',
          top: '100%',
          right: 0,
          marginTop: '8px',
          background: 'var(--bg-card)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-md)',
          boxShadow: '0 10px 25px rgba(0,0,0,0.5), 0 0 15px rgba(21, 214, 119, 0.1)',
          minWidth: '130px',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          animation: 'fadeIn 0.2s ease-out'
        }}>
          {currencies.map((curr) => (
            <button
              key={curr.code}
              type="button"
              onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  selectCurrency(curr.symbol);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 16px',
                background: 'transparent',
                border: 'none',
                color: currency === curr.symbol ? 'var(--text-primary)' : 'var(--text-secondary)',
                fontSize: '0.95rem',
                fontWeight: currency === curr.symbol ? '700' : '500',
                cursor: 'pointer',
                textAlign: 'left',
                width: '100%',
                transition: 'background 0.2s, color 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'var(--bg-card-hover)';
                e.currentTarget.style.color = 'var(--text-primary)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = currency === curr.symbol ? 'var(--text-primary)' : 'var(--text-secondary)';
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ color: 'var(--accent-primary)', fontWeight: '800', width: '16px', textAlign: 'center' }}>
                  {curr.symbol}
                </span>
                {curr.code}
              </span>
              {currency === curr.symbol && <Check size={16} color="var(--accent-primary)" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

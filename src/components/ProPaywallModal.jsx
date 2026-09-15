import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Sparkles, CheckCircle2, X } from 'lucide-react';

export default function ProPaywallModal({ isOpen, onClose, onUpgrade }) {
  const { t } = useTranslation();
  const [promoCode, setPromoCode] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleBuy = () => {
    // Fake payment flow
    alert('Payment gateway integration pending.');
  };

  const handlePromoSubmit = () => {
    if (promoCode.trim().toUpperCase() === 'PROVERSIONEZ') {
      onUpgrade();
      onClose();
    } else {
      setError('Invalid promo code');
    }
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.8)', zIndex: 1000,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '20px', backdropFilter: 'blur(5px)'
    }}>
      <div className="animate-fade-in" style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--accent-primary)',
        borderRadius: 'var(--radius-lg)',
        width: '100%', maxWidth: '500px',
        position: 'relative', overflow: 'hidden',
        boxShadow: '0 0 40px rgba(21, 214, 119, 0.15)'
      }}>
        {/* Header Graphic */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(21, 214, 119, 0.2) 0%, rgba(0,0,0,0) 100%)',
          padding: '32px 24px', textAlign: 'center',
          borderBottom: '1px solid var(--border-subtle)'
        }}>
          <button 
            onClick={onClose}
            style={{
              position: 'absolute', top: '16px', right: '16px',
              background: 'none', border: 'none', color: 'var(--text-secondary)',
              cursor: 'pointer'
            }}
          >
            <X size={24} />
          </button>
          
          <Sparkles size={48} color="var(--accent-primary)" style={{ margin: '0 auto 16px' }} />
          <h2 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '8px', color: 'var(--text-primary)' }}>
            Spendly <span style={{ color: 'var(--accent-primary)' }}>PRO</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
            Unlock advanced analytics and take absolute control of your finances.
          </p>
        </div>

        {/* Features list */}
        <div style={{ padding: '24px' }}>
          <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px 0', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {[
              'Advanced Interactive Charts (Burn Rate, Distributions)',
              'Historical Trends & Comparisons',
              'Unlimited Categories & Goals',
              'Priority Support & Cloud Sync',
              'Custom Themes (Coming Soon)'
            ].map((feature, i) => (
              <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '1.05rem', color: 'var(--text-primary)' }}>
                <CheckCircle2 size={20} color="var(--accent-primary)" />
                {feature}
              </li>
            ))}
          </ul>

          <button 
            onClick={handleBuy}
            style={{
              width: '100%', padding: '16px',
              background: 'var(--accent-primary)',
              color: '#000', border: 'none',
              borderRadius: 'var(--radius-md)',
              fontSize: '1.2rem', fontWeight: '700',
              cursor: 'pointer', marginBottom: '16px',
              boxShadow: 'var(--shadow-glow)',
              transition: 'transform 0.2s'
            }}
            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.02)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
          >
            Upgrade for $4.99
          </button>

          <div style={{ textAlign: 'center', marginTop: '16px' }}>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>
              Have a promo code?
            </p>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input 
                type="text" 
                value={promoCode}
                onChange={e => { setPromoCode(e.target.value); setError(''); }}
                placeholder="Enter code"
                style={{
                  flex: 1, padding: '10px 12px',
                  background: 'var(--bg-input)', border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)', color: 'var(--text-primary)',
                  textTransform: 'uppercase', outline: 'none'
                }}
              />
              <button 
                onClick={handlePromoSubmit}
                style={{
                  padding: '10px 20px', background: 'var(--bg-card)',
                  color: 'var(--text-primary)', border: '1px solid var(--border-focus)',
                  borderRadius: 'var(--radius-md)', fontWeight: '600', cursor: 'pointer'
                }}
              >
                Apply
              </button>
            </div>
            {error && <p style={{ color: 'var(--danger-primary)', fontSize: '0.85rem', marginTop: '8px' }}>{error}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

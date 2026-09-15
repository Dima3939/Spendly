import CurrencySwitcher from './CurrencySwitcher';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Target, Wallet, Calendar, ArrowRight } from 'lucide-react';

export default function WebPeriodSetup({ onPeriodCreated, currency, setCurrency }) {
  const { t } = useTranslation();
  const [amount, setAmount] = useState('');
  const [endDate, setEndDate] = useState('');
  const [error, setError] = useState('');

  // Quick date presets
  const setQuickEndDate = (days) => {
    const target = new Date();
    target.setDate(target.getDate() + days);
    setEndDate(target.toISOString().split('T')[0]);
  };

  const setEndOfMonth = () => {
    const target = new Date();
    const lastDay = new Date(target.getFullYear(), target.getMonth() + 1, 0);
    setEndDate(lastDay.toISOString().split('T')[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const num = parseFloat(amount);
    if (!num || num <= 0) {
      setError(t('errorAmountRequired'));
      return;
    }
    if (!endDate) {
      setError(t('errorDateRequired'));
      return;
    }

    const today = new Date().toISOString().split('T')[0];
    if (endDate <= today) {
      setError(t('endDateFuture'));
      return;
    }

    onPeriodCreated({
      initial_income: num,
      start_date: today,
      end_date: endDate
    });
  };

  return (
    <div className="animate-fade-in" style={{ 
      display: 'flex', 
      gap: '60px', 
      alignItems: 'center', 
      justifyContent: 'center', 
      minHeight: '70vh',
      maxWidth: '1000px',
      margin: '0 auto',
      padding: '20px'
    }}>
      
      {/* Illustration / Info Side */}
      <div style={{ flex: 1, maxWidth: '480px' }}>
        <div style={{ 
          width: '64px', height: '64px', borderRadius: '16px', 
          background: 'linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-success) 100%)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px',
          boxShadow: '0 8px 16px rgba(0,0,0,0.2)'
        }}>
          <Target color="white" size={32} />
        </div>
        
        <h1 style={{ fontSize: '3.5rem', fontWeight: '800', marginBottom: '20px', lineHeight: '1.15', letterSpacing: '-0.02em' }}>
          {t('takeControl')}
        </h1>
        
        <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', marginBottom: '40px', lineHeight: '1.5' }}>
          {t('takeControlDesc')}
        </p>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--bg-input)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Wallet color="var(--accent-primary)" size={24} />
            </div>
            <div>
              <div style={{ fontWeight: '700', fontSize: '1.1rem' }}>{t('envelopeBudgeting')}</div>
              <div style={{ color: 'var(--text-secondary)' }}>{t('allocateFunds')}</div>
            </div>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--bg-input)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Calendar color="var(--accent-success)" size={24} />
            </div>
            <div>
              <div style={{ fontWeight: '700', fontSize: '1.1rem' }}>{t('dynamicLimits')}</div>
              <div style={{ color: 'var(--text-secondary)' }}>{t('paceAutoAdjusts')}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Form Side */}
      <div style={{ 
        flex: 1, 
        maxWidth: '440px', 
        background: 'var(--bg-card)', 
        padding: '40px', 
        borderRadius: 'var(--radius-lg)', 
        boxShadow: 'var(--shadow-card)',
        border: '1px solid var(--border-subtle)'
      }}>
        <h2 style={{ fontSize: '1.75rem', fontWeight: '800', marginBottom: '8px' }}>
          {t('setupTitle')}
        </h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>
          {t('setupDesc')}
        </p>

        {error && (
          <div style={{ background: 'var(--accent-danger)', color: '#fff', padding: '12px', borderRadius: 'var(--radius-sm)', marginBottom: '24px', fontWeight: '600' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Amount */}
          <div style={{ marginBottom: '32px' }}>
            <label style={{ display: 'block', fontWeight: '700', marginBottom: '12px', fontSize: '1.1rem' }}>
              {t('step1Amount')}
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="number"
                placeholder={t('exampleAmount')}
                value={amount}
                onChange={e => setAmount(e.target.value)}
                style={{
                  width: '100%',
                  background: 'var(--bg-input)',
                  border: '2px solid var(--border-subtle)',
                  padding: '16px 20px',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--text-primary)',
                  fontSize: '1.25rem',
                  fontWeight: '600',
                  outline: 'none',
                  transition: 'border-color 0.2s'
                }}
                onFocus={(e) => e.target.style.borderColor = 'var(--accent-primary)'}
                onBlur={(e) => e.target.style.borderColor = 'var(--border-subtle)'}
              />
              <CurrencySwitcher currency={currency} setCurrency={setCurrency} />
            </div>
          </div>

          {/* Date */}
          <div style={{ marginBottom: '40px' }}>
            <label style={{ display: 'block', fontWeight: '700', marginBottom: '12px', fontSize: '1.1rem' }}>
              {t('step2Date')}
            </label>
            <input
              type="date"
              value={endDate}
              onChange={e => setEndDate(e.target.value)}
              style={{
                width: '100%',
                background: 'var(--bg-input)',
                border: '2px solid var(--border-subtle)',
                padding: '16px 20px',
                borderRadius: 'var(--radius-md)',
                color: 'var(--text-primary)',
                fontSize: '1.1rem',
                fontWeight: '500',
                outline: 'none',
                marginBottom: '16px',
                transition: 'border-color 0.2s'
              }}
              onFocus={(e) => e.target.style.borderColor = 'var(--accent-primary)'}
              onBlur={(e) => e.target.style.borderColor = 'var(--border-subtle)'}
            />
            
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <button 
                type="button" 
                onClick={() => setQuickEndDate(14)}
                style={{ flex: 1, padding: '10px', background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', color: 'var(--text-primary)', fontWeight: '600', cursor: 'pointer' }}
              >
                14 {t('daysText')}
              </button>
              <button 
                type="button" 
                onClick={setEndOfMonth}
                style={{ flex: 1, padding: '10px', background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', color: 'var(--text-primary)', fontWeight: '600', cursor: 'pointer' }}
              >
                {t('endOfMonth')}
              </button>
              <button 
                type="button" 
                onClick={() => setQuickEndDate(30)}
                style={{ flex: 1, padding: '10px', background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', color: 'var(--text-primary)', fontWeight: '600', cursor: 'pointer' }}
              >
                30 {t('daysText')}
              </button>
            </div>
          </div>

          <button 
            type="submit"
            style={{
              width: '100%',
              padding: '16px',
              background: 'linear-gradient(90deg, var(--accent-primary), var(--accent-success))',
              color: 'white',
              border: 'none',
              borderRadius: 'var(--radius-md)',
              fontWeight: '700',
              fontSize: '1.1rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
            }}
          >
            {t('startTracking')}
            <ArrowRight size={20} />
          </button>
        </form>
      </div>
    </div>
  );
}

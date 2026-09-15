import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import i18n from '../i18n';
import { DEFAULT_CATEGORIES } from '../services/StorageService';

export default function WebPlan({ expenses = [], currentPeriod, salary , currency}) {
  const { t } = useTranslation();

  const formatMoney = (val) => {
    return Math.round(Number(val) || 0).toLocaleString('ru-RU');
  };

  const categoryTotals = useMemo(() => {
    const totals = {};
    expenses.forEach(ex => {
      if (Number(ex.amount) < 0) {
        const cat = ex.category || 'Other';
        totals[cat] = (totals[cat] || 0) + Math.abs(Number(ex.amount));
      }
    });
    return totals;
  }, [expenses]);

  const totalSpent = useMemo(() => {
    return Object.values(categoryTotals).reduce((sum, val) => sum + val, 0);
  }, [categoryTotals]);

  const totalBudget = salary || 0;
  const unassigned = Math.max(0, totalBudget - totalSpent);

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>{t('yourSpendingPlan')}</div>
          <h2 style={{ fontSize: '2rem', fontWeight: '800' }}>{t('monthlyPlan')}</h2>
        </div>
        <button style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-subtle)',
          color: 'var(--text-primary)',
          padding: '12px 24px',
          borderRadius: 'var(--radius-sm)',
          fontWeight: '600'
        }}>{t('copyPreviousMonth')}</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '32px' }}>
        {/* Envelopes List */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '700' }}>{t('categories')}</h3>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              {t('unassignedLabel', { amount: formatMoney(unassigned) + ' ' + currency })}
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {DEFAULT_CATEGORIES.map(cat => {
              const spent = categoryTotals[cat.name] || 0;
              // Mocking a budget limit for visual purposes
              const limit = Math.max(spent + 500, 2000); 
              const progress = Math.min(100, (spent / limit) * 100);
              
              return (
                <div key={cat.name} style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '20px'
                }}>
                  <div style={{ fontSize: '2rem', width: '48px', textAlign: 'center' }}>{cat.emoji}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{ fontWeight: '600', fontSize: '1.05rem' }}>{i18n.exists('cat' + cat.name) ? t('cat' + cat.name) : cat.name.replace('cat', '')}</span>
                      <span style={{ fontWeight: '700' }}>{formatMoney(limit)} {currency}</span>
                    </div>
                    {/* Progress Bar */}
                    <div style={{ width: '100%', height: '8px', background: 'var(--bg-input)', borderRadius: '999px', overflow: 'hidden' }}>
                      <div style={{ 
                        height: '100%', 
                        width: `${progress}%`, 
                        background: progress > 90 ? 'var(--accent-danger)' : 'var(--accent-primary)',
                        borderRadius: '999px'
                      }}></div>
                    </div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '8px' }}>
                      {t('spentLabel', { amount: formatMoney(spent) + ' ' + currency })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Sidebar Summary */}
        <div>
          <div style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-lg)',
            padding: '24px',
            position: 'sticky',
            top: '24px'
          }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '24px' }}>{t('summary')}</h3>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', paddingBottom: '16px', borderBottom: '1px solid var(--border-subtle)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>{t('totalBudget')}</span>
              <span style={{ fontWeight: '700' }}>{formatMoney(totalBudget)} {currency}</span>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', paddingBottom: '16px', borderBottom: '1px solid var(--border-subtle)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>{t('totalSpentPlan')}</span>
              <span style={{ fontWeight: '700' }}>{formatMoney(totalSpent)} {currency}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--accent-success)', fontWeight: '700' }}>
              <span>{t('remaining')}</span>
              <span>{formatMoney(totalBudget - totalSpent)} {currency}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Target, Plus } from 'lucide-react';

export default function WebGoals({ currentPeriod , currency}) {
  const { t } = useTranslation();
  
  // Mock data for goals since we don't have a goals table yet
  const mockupGoals = [
    { id: 1, title: 'New Laptop', target: 2000, saved: 450, deadline: '2027-01-01', emoji: '💻' },
    { id: 2, title: 'Summer Vacation', target: 5000, saved: 1200, deadline: '2027-06-01', emoji: '🏖️' }
  ];

  const formatMoney = (val) => {
    return Math.round(Number(val) || 0).toLocaleString('ru-RU');
  };

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>{t('makeRoom')}</div>
          <h2 style={{ fontSize: '2rem', fontWeight: '800' }}>{t('goalsTitle')}</h2>
        </div>
        <button style={{
          background: 'var(--accent-primary)',
          color: '#fff',
          padding: '12px 24px',
          borderRadius: 'var(--radius-sm)',
          fontWeight: '600',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          boxShadow: 'var(--shadow-glow)'
        }}>
          <Plus size={18} />{t('newGoalBtn')}</button>
      </div>

      <p style={{ color: 'var(--text-secondary)', marginBottom: '32px', fontSize: '1.05rem' }}>
        Track several goals and see the monthly contribution needed to stay on time.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '24px' }}>
        {mockupGoals.map(goal => {
          const progress = Math.min(100, (goal.saved / goal.target) * 100);
          
          return (
            <div key={goal.id} style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-lg)',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: 'var(--shadow-card)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
                <div style={{ fontSize: '2.5rem', background: 'var(--bg-input)', width: '64px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 'var(--radius-md)' }}>
                  {goal.emoji}
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '4px' }}>{t('targetLabel')}</div>
                  <div style={{ fontWeight: '800', fontSize: '1.2rem' }}>{formatMoney(goal.target)} {currency}</div>
                </div>
              </div>
              
              <h3 style={{ fontSize: '1.4rem', fontWeight: '700', marginBottom: '8px' }}>{goal.title}</h3>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '24px' }}>
                Deadline: {new Date(goal.deadline).toLocaleDateString('ru-RU')}
              </div>

              <div style={{ marginTop: 'auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9rem' }}>
                  <span style={{ fontWeight: '600' }}>{formatMoney(goal.saved)} {currency} saved</span>
                  <span style={{ color: 'var(--text-muted)' }}>{Math.round(progress)}%</span>
                </div>
                <div style={{ width: '100%', height: '8px', background: 'var(--bg-input)', borderRadius: '999px', overflow: 'hidden' }}>
                  <div style={{ 
                    height: '100%', 
                    width: `${progress}%`, 
                    background: 'var(--accent-success)',
                    borderRadius: '999px'
                  }}></div>
                </div>
              </div>
            </div>
          );
        })}

        {/* Empty State / Add New Card */}
        <div style={{
          border: '1px dashed var(--border-focus)',
          borderRadius: 'var(--radius-lg)',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '280px',
          cursor: 'pointer',
          transition: 'background 0.2s',
          color: 'var(--text-muted)'
        }}
        onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-card-hover)'}
        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
        >
          <div style={{ background: 'var(--bg-card)', padding: '16px', borderRadius: 'var(--radius-full)', marginBottom: '16px', boxShadow: 'var(--shadow-glow)' }}>
            <Target size={32} color="var(--accent-primary)" />
          </div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '8px' }}>{t('createNewGoal')}</h3>
          <p style={{ textAlign: 'center', fontSize: '0.9rem' }}>{t('giveSavingsTarget')}</p>
        </div>
      </div>
    </div>
  );
}
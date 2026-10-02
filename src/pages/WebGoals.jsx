import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Target, Plus, X } from 'lucide-react';
import { createPortal } from 'react-dom';

export default function WebGoals({ currentPeriod, currency }) {
  const { t } = useTranslation();
  
  const [goals, setGoals] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Modal state
  const [goalTitle, setGoalTitle] = useState('');
  const [goalTarget, setGoalTarget] = useState('');
  const [goalDeadline, setGoalDeadline] = useState('');
  const [goalEmoji, setGoalEmoji] = useState('🎯');

  useEffect(() => {
    const saved = localStorage.getItem('spendly_guest_goals');
    if (saved) {
      setGoals(JSON.parse(saved));
    } else {
      const mockupGoals = [
        { id: 1, title: t('goalLaptop') || 'New Laptop', target: 2000, saved: 450, deadline: '2027-01-01', emoji: '💻' },
        { id: 2, title: t('goalVacation') || 'Summer Vacation', target: 5000, saved: 1200, deadline: '2027-06-01', emoji: '🏖️' }
      ];
      setGoals(mockupGoals);
      localStorage.setItem('spendly_guest_goals', JSON.stringify(mockupGoals));
    }
  }, [t]);

  const saveGoals = (newGoals) => {
    setGoals(newGoals);
    localStorage.setItem('spendly_guest_goals', JSON.stringify(newGoals));
  };

  const handleAddGoal = (e) => {
    e.preventDefault();
    if (!goalTitle || !goalTarget || !goalDeadline) return;
    
    const newGoal = {
      id: Date.now(),
      title: goalTitle,
      target: Number(goalTarget),
      saved: 0,
      deadline: goalDeadline,
      emoji: goalEmoji
    };
    
    saveGoals([...goals, newGoal]);
    
    // Reset form
    setGoalTitle('');
    setGoalTarget('');
    setGoalDeadline('');
    setGoalEmoji('🎯');
    setIsModalOpen(false);
  };

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
        <button 
          onClick={() => setIsModalOpen(true)}
          style={{
          background: 'var(--accent-primary)',
          color: '#fff',
          padding: '12px 24px',
          borderRadius: 'var(--radius-sm)',
          fontWeight: '600',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          boxShadow: 'var(--shadow-glow)',
          border: 'none',
          cursor: 'pointer'
        }}>
          <Plus size={18} />{t('newGoalBtn')}</button>
      </div>

      <p style={{ color: 'var(--text-secondary)', marginBottom: '32px', fontSize: '1.05rem' }}>
        {t('goalsDesc')}
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '24px' }}>
        {goals.map(goal => {
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
                {t('deadlineLabel')} {new Date(goal.deadline).toLocaleDateString('ru-RU')}
              </div>

              <div style={{ marginTop: 'auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9rem', fontWeight: '600' }}>
                  <span style={{ color: 'var(--text-primary)' }}>{formatMoney(goal.saved)} {currency} {t('savedLabel')}</span>
                  <span style={{ color: 'var(--accent-primary)' }}>{Math.round(progress)}%</span>
                </div>
                <div style={{ width: '100%', height: '8px', background: 'var(--bg-input)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ 
                    width: progress + '%', 
                    height: '100%', 
                    background: 'var(--accent-primary)',
                    borderRadius: '4px',
                    transition: 'width 1s cubic-bezier(0.4, 0, 0.2, 1)'
                  }} />
                </div>
              </div>
            </div>
          );
        })}

        {/* Create New Card */}
        <button 
          onClick={() => setIsModalOpen(true)}
          style={{
          background: 'transparent',
          border: '1px dashed var(--accent-primary)',
          borderRadius: 'var(--radius-lg)',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '16px',
          cursor: 'pointer',
          minHeight: '260px'
        }}>
          <div style={{ background: 'var(--accent-primary-bg)', padding: '16px', borderRadius: '50%', color: 'var(--accent-primary)' }}>
            <Target size={32} />
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontWeight: '700', fontSize: '1.1rem', color: 'var(--text-primary)', marginBottom: '4px' }}>{t('newGoalBtn')}</div>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', maxWidth: '200px' }}>
              {t('goalPromptDesc')}
            </div>
          </div>
        </button>
      </div>

      {isModalOpen && createPortal(
        <div style={{
          position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.7)',
          backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 99999
        }} onClick={() => setIsModalOpen(false)}>
          <div className="animate-fade-in" onClick={e => e.stopPropagation()} style={{
            background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', width: '100%', maxWidth: '400px',
            border: '1px solid var(--border-subtle)', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)', overflow: 'hidden'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px', borderBottom: '1px solid var(--border-subtle)' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: '800', margin: 0 }}>{t('newGoalBtn')}</h2>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleAddGoal} style={{ padding: '24px' }}>
              <div style={{ display: 'flex', gap: '16px', marginBottom: '20px' }}>
                <div style={{ width: '80px' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '8px', color: 'var(--text-primary)' }}>Emoji</label>
                  <input type="text" value={goalEmoji} onChange={e => setGoalEmoji(e.target.value)}
                    style={{ width: '100%', padding: '12px', background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', color: 'var(--text-primary)', fontSize: '1.2rem', textAlign: 'center', outline: 'none' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '8px', color: 'var(--text-primary)' }}>{t('subsInputTitle')}</label>
                  <input type="text" value={goalTitle} onChange={e => setGoalTitle(e.target.value)} required placeholder={t('goalLaptop')}
                    style={{ width: '100%', padding: '12px', background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', color: 'var(--text-primary)', outline: 'none' }} />
                </div>
              </div>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '8px', color: 'var(--text-primary)' }}>{t('targetLabel')} ({currency})</label>
                <input type="number" value={goalTarget} onChange={e => setGoalTarget(e.target.value)} required min="1" placeholder="1000"
                  style={{ width: '100%', padding: '12px', background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', color: 'var(--text-primary)', outline: 'none' }} />
              </div>
              <div style={{ marginBottom: '32px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '8px', color: 'var(--text-primary)' }}>{t('deadlineLabel')}</label>
                <input type="date" value={goalDeadline} onChange={e => setGoalDeadline(e.target.value)} required
                  style={{ width: '100%', padding: '12px', background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', color: 'var(--text-primary)', outline: 'none' }} />
              </div>
              <button type="submit" style={{ width: '100%', padding: '16px', background: 'var(--accent-primary)', color: '#000', fontSize: '1rem', fontWeight: '700', borderRadius: 'var(--radius-sm)', border: 'none', cursor: 'pointer' }}>
                {t('save')}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
import React from 'react';
import { useTranslation } from 'react-i18next';
import { User, LogOut, Shield, Bell, Palette } from 'lucide-react';

import { useState } from 'react';
import databaseService from '../services/SupabaseService';

export default function WebSettings({ user, currentPeriod, currency, setCurrency, handleResetPeriod, setUser }) {
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [newName, setNewName] = useState(user?.user_metadata?.username || user?.email || localStorage.getItem('spendly_guest_name') || 'Guest User');
  const { t } = useTranslation();

  const handleSaveProfile = async () => {
    try {
      if (user) {
        // Authenticated user
        const updatedUser = await databaseService.updateUserMetadata({ username: newName });
        setUser(updatedUser);
      } else {
        // Guest user
        localStorage.setItem('spendly_guest_name', newName);
        // Force re-render
        setNewName(newName);
      }
      setIsEditingProfile(false);
    } catch (err) {
      alert('Error updating profile: ' + err.message);
    }
  };


  return (
    <div className="animate-fade-in" style={{ maxWidth: '800px' }}>
      <div style={{ marginBottom: '40px' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '8px' }}>{t('settingsTitle')}</h2>
        <p style={{ color: 'var(--text-secondary)' }}>{t('settingsDesc')}</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* Profile Section */}
        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-lg)',
          padding: '32px',
          display: 'flex',
          gap: '24px',
          alignItems: 'center'
        }}>
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: 'var(--accent-primary)',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '2.5rem',
            fontWeight: '700'
          }}>
            {user?.user_metadata?.username ? user.user_metadata.username.charAt(0).toUpperCase() : (user?.email ? user.email.charAt(0).toUpperCase() : (localStorage.getItem('spendly_guest_name') ? localStorage.getItem('spendly_guest_name').charAt(0).toUpperCase() : 'G'))}
          </div>
          <div style={{ flex: 1 }}>
            <h3 style={{ fontSize: '1.4rem', fontWeight: '700', marginBottom: '4px' }}>
              {user?.user_metadata?.username || user?.email || localStorage.getItem('spendly_guest_name') || 'Guest User'}
            </h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '16px' }}>
              {user ? t('syncedWithCloud') : t('localStorageOnly')}
            </p>
            
            {isEditingProfile ? (
              <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                <input 
                  type="text" 
                  value={newName} 
                  onChange={(e) => setNewName(e.target.value)}
                  style={{
                    background: 'var(--bg-input)',
                    border: '1px solid var(--border-focus)',
                    color: 'var(--text-primary)',
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-md)',
                    outline: 'none',
                    width: '250px'
                  }}
                  autoFocus
                />
                <button 
                  onClick={handleSaveProfile}
                  style={{
                    background: 'var(--accent-primary)',
                    color: '#fff',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: 'var(--radius-md)',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  {t('save', 'Save')}
                </button>
                <button 
                  onClick={() => setIsEditingProfile(false)}
                  style={{
                    background: 'transparent',
                    color: 'var(--text-secondary)',
                    border: '1px solid var(--border-subtle)',
                    padding: '8px 16px',
                    borderRadius: 'var(--radius-md)',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >{t('cancel', 'Cancel')}</button>
              </div>
            ) : (
              <button 
                onClick={() => setIsEditingProfile(true)}
                style={{
                  background: 'var(--bg-input)',
                  border: '1px solid var(--border-subtle)',
                  padding: '8px 16px',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--text-primary)',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'background 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-card-hover)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'var(--bg-input)'}
              >
                {t('editProfile')}
              </button>
            )}

          </div>
        </div>

        {/* Preferences */}
        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden'
        }}>
          <div style={{ padding: '24px', borderBottom: '1px solid var(--border-subtle)' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '700' }}>{t('preferencesTitle')}</h3>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', borderBottom: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <Palette color="var(--text-muted)" />
                <div>
                  <div style={{ fontWeight: '600', marginBottom: '4px' }}>{t('baseCurrency')}</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{t('baseCurrencyDesc')}</div>
                </div>
              </div>
              <select 
                value={currency} 
                onChange={(e) => setCurrency(e.target.value)}
                style={{ background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', padding: '8px 12px', borderRadius: 'var(--radius-sm)', color: 'var(--text-primary)' }}
              >
                <option value="₽">RUB (₽)</option>
                <option value="$">USD ($)</option>
                <option value="€">EUR (€)</option>
                <option value="₴">UAH (₴)</option>
              </select>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <Bell color="var(--text-muted)" />
                <div>
                  <div style={{ fontWeight: '600', marginBottom: '4px' }}>{t('notifications')}</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{t('notificationsDesc')}</div>
                </div>
              </div>
              <input type="checkbox" defaultChecked style={{ width: '20px', height: '20px' }} />
            </div>
          </div>
        </div>

        {/* {t('dangerZone')} */}
        <div style={{
          border: '1px solid var(--accent-danger)',
          borderRadius: 'var(--radius-lg)',
          padding: '24px'
        }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: 'var(--accent-danger)', marginBottom: '16px' }}>{t('dangerZone')}</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
            {t('irreversibleActions')}
          </p>
          <div style={{ display: 'flex', gap: '16px' }}>
            <button 
              onClick={handleResetPeriod}
              style={{
              background: 'transparent',
              border: '1px solid var(--accent-danger)',
              color: 'var(--accent-danger)',
              padding: '8px 16px',
              borderRadius: 'var(--radius-sm)',
              fontWeight: '600'
            }}>
              {t('clearAllData')}
            </button>
            <button style={{
              background: 'var(--accent-danger)',
              border: 'none',
              color: '#fff',
              padding: '8px 16px',
              borderRadius: 'var(--radius-sm)',
              fontWeight: '600'
            }}>{t('deleteAccount')}</button>
          </div>
        </div>
      </div>
    </div>
  );
}
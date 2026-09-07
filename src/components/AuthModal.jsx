import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import databaseService from '../services/SupabaseService';

export default function AuthModal({
  isOpen,
  currentUser,
  onClose,
  onLoginSuccess,
  onLogout
}) {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isRegistering) {
        if (!username.trim()) {
          setError(t('errorNameRequired', 'Введи имя или никнейм'));
          setLoading(false);
          return;
        }
        await databaseService.signUp(email, password, username);
        alert(t('registerSuccess', 'Регистрация успешна! Теперь ты можешь войти.'));
        setIsRegistering(false);
      } else {
        const user = await databaseService.signIn(email, password);
        onLoginSuccess(user);
        onClose();
      }
    } catch (err) {
      setError(err.message || t('errorAuth', 'Ошибка авторизации'));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setError('');
      setLoading(true);
      await databaseService.signInWithGoogle();
    } catch (err) {
      setError(err.message || t('errorGoogleAuth', 'Ошибка входа через Google'));
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: '16px'
      }}
      onClick={onClose}
    >
      <div
        className="animate-slide-up"
        style={{
          width: '100%',
          maxWidth: '400px',
          backgroundColor: 'var(--bg-card)',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--border-subtle)',
          padding: '28px 24px',
          boxShadow: 'var(--shadow-card)',
          position: 'relative'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'var(--bg-input)',
            color: 'var(--text-muted)',
            borderRadius: '50%',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '0.9rem',
            fontWeight: '700'
          }}
        >
          ✕
        </button>

        {currentUser ? (
          /* Profile view when authenticated */
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: '12px' }}>👤</div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '4px' }}>
              {currentUser.user_metadata?.username || currentUser.email}
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--accent-success)', marginBottom: '24px' }}>
              ● {t('cloudSyncActive', 'Облачная синхронизация активна')}
            </p>

            <button
              onClick={() => {
                onLogout();
                onClose();
              }}
              style={{
                width: '100%',
                background: 'var(--accent-danger-bg)',
                color: 'var(--accent-danger)',
                border: '1px solid rgba(244, 63, 94, 0.3)',
                borderRadius: 'var(--radius-md)',
                padding: '12px',
                fontSize: '0.9rem',
                fontWeight: '700'
              }}
            >
              {t('signOut')}
            </button>
          </div>
        ) : (
          /* Login & Registration Form */
          <div>
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <div style={{ fontSize: '2.4rem', marginBottom: '8px' }}>☁️</div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '4px' }}>
                {isRegistering ? t('createProfile', 'Создать профиль') : t('authTitle', 'Облачная синхронизация')}
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                {isRegistering 
                  ? t('registerDesc', 'Сохраняй траты и пользуйся на любом устройстве') 
                  : t('authDesc')}
              </p>
            </div>

            {error && (
              <div style={{
                background: 'var(--accent-danger-bg)',
                color: 'var(--accent-danger)',
                borderRadius: 'var(--radius-md)',
                padding: '10px 12px',
                fontSize: '0.82rem',
                marginBottom: '16px',
                textAlign: 'center'
              }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {isRegistering && (
                <div>
                  <input
                    type="text"
                    placeholder={t('namePlaceholder', 'Твое имя или никнейм')}
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    style={{
                      width: '100%',
                      background: 'var(--bg-input)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-md)',
                      color: 'var(--text-primary)',
                      padding: '12px',
                      fontSize: '0.9rem',
                      outline: 'none'
                    }}
                    required
                  />
                </div>
              )}

              <div>
                <input
                  type="email"
                  placeholder={t('email')}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    width: '100%',
                    background: 'var(--bg-input)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-md)',
                    color: 'var(--text-primary)',
                    padding: '12px',
                    fontSize: '0.9rem',
                    outline: 'none'
                  }}
                  required
                />
              </div>

              <div>
                <input
                  type="password"
                  placeholder={t('password')}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{
                    width: '100%',
                    background: 'var(--bg-input)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-md)',
                    color: 'var(--text-primary)',
                    padding: '12px',
                    fontSize: '0.9rem',
                    outline: 'none'
                  }}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  background: 'linear-gradient(135deg, var(--accent-primary) 0%, #0284c7 100%)',
                  color: '#ffffff',
                  borderRadius: 'var(--radius-md)',
                  padding: '14px',
                  fontSize: '0.95rem',
                  fontWeight: '700',
                  marginTop: '4px'
                }}
              >
                {loading ? t('loading') : isRegistering ? t('signUp') : t('signIn')}
              </button>

              <div style={{ display: 'flex', alignItems: 'center', margin: '4px 0', gap: '8px' }}>
                <div style={{ flex: 1, height: '1px', background: 'var(--border-subtle)' }} />
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{t('or', 'или')}</span>
                <div style={{ flex: 1, height: '1px', background: 'var(--border-subtle)' }} />
              </div>

              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={loading}
                style={{
                  width: '100%',
                  background: 'var(--bg-card-hover)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-primary)',
                  borderRadius: 'var(--radius-md)',
                  padding: '12px',
                  fontSize: '0.85rem',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                <span>Google</span>
              </button>

              <button
                type="button"
                onClick={() => { setIsRegistering(!isRegistering); setError(''); }}
                style={{
                  background: 'none',
                  color: 'var(--accent-primary)',
                  fontSize: '0.8rem',
                  fontWeight: '600',
                  marginTop: '6px'
                }}
              >
                {isRegistering ? t('haveAccount', 'Уже есть аккаунт? Войти') : t('noAccount', 'Нет аккаунта? Зарегистрироваться')}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

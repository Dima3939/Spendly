import { useState } from 'react';
import databaseService from '../services/SupabaseService';

export default function Auth({ onLoginSuccess, theme }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const isCli = theme === 'CLI';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      let user;
      if (isRegistering) {
        if (!username.trim()) {
          setError(isCli ? 'ВВЕДИТЕ ЛОГИН!' : 'Введите логин!');
          setLoading(false);
          return;
        }
        user = await databaseService.signUp(email, password, username);
        alert(isCli 
          ? '[СИСТЕМА]: РЕГИСТРАЦИЯ УСПЕШНА! ТЕПЕРЬ ВЫ МОЖЕТЕ ВОЙТИ.' 
          : 'Регистрация успешна! Теперь вы можете войти под своими данными.'
        );
        setIsRegistering(false);
      } else {
        user = await databaseService.signIn(email, password);
        onLoginSuccess(user);
      }
    } catch (err) {
      setError(err.message);
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
      setError(`GOOGLE AUTH ERROR: ${err.message}`);
      setLoading(false);
    }
  };

  // Стили в зависимости от темы
  const containerBg = isCli ? '#000' : '#1e293b';
  const borderColor = isCli ? '#facc15' : '#38bdf8';
  const textColor = isCli ? '#facc15' : '#38bdf8';
  const inputBg = isCli ? '#111' : '#0f172a';
  const inputBorder = isCli ? '#555' : '#475569';
  const btnBg = isCli ? '#facc15' : '#38bdf8';
  const btnText = '#000';

  return (
    <div style={{ 
      maxWidth: '400px', 
      width: '400px', 
      border: `1px solid ${borderColor}`, 
      padding: '20px', 
      borderRadius: isCli ? '0px' : '6px', 
      background: containerBg,
      boxSizing: 'border-box'
    }}>
      <h2 style={{ color: textColor, marginTop: 0, fontSize: '1.2rem', letterSpacing: '1px', textTransform: 'uppercase' }}>
        {isRegistering 
          ? (isCli ? '[РЕГИСТРАЦИЯ]' : 'Регистрация') 
          : (isCli ? '[АВТОРИЗАЦИЯ]' : 'Авторизация')}
      </h2>
      
      {error && (
        <p style={{ color: isCli ? '#ff5555' : '#f43f5e', fontSize: '0.85rem', borderLeft: '2px solid', paddingLeft: '5px' }}>
          {isCli ? `ОШИБКА: ${error.toUpperCase()}` : `Ошибка: ${error}`}
        </p>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        
        {/* Поле Username показывается только при регистрации */}
        {isRegistering && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <label style={{ color: '#888', fontSize: '0.75rem' }}>{isCli ? 'ЛОГИН / НИКНЕЙМ:' : 'Логин / Никнейм:'}</label>
            <input 
              type="text" 
              placeholder={isCli ? 'NICKNAME' : 'Ваш никнейм'}
              value={username} 
              onChange={(e) => setUsername(e.target.value)}
              style={{ background: inputBg, color: '#fff', border: `1px solid ${inputBorder}`, padding: '10px', fontFamily: 'inherit', outline: 'none', borderRadius: isCli ? '0' : '4px' }}
              required 
            />
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
          <label style={{ color: '#888', fontSize: '0.75rem' }}>E-MAIL:</label>
          <input 
            type="email" 
            placeholder="example@mail.com" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)}
            style={{ background: inputBg, color: '#fff', border: `1px solid ${inputBorder}`, padding: '10px', fontFamily: 'inherit', outline: 'none', borderRadius: isCli ? '0' : '4px' }}
            required 
          />
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
          <label style={{ color: '#888', fontSize: '0.75rem' }}>{isCli ? 'ПАРОЛЬ:' : 'Пароль:'}</label>
          <input 
            type="password" 
            placeholder="••••••••" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)}
            style={{ background: inputBg, color: '#fff', border: `1px solid ${inputBorder}`, padding: '10px', fontFamily: 'inherit', outline: 'none', borderRadius: isCli ? '0' : '4px' }}
            required 
          />
        </div>
        
        <button 
          type="submit" 
          disabled={loading}
          style={{ background: btnBg, color: btnText, border: 'none', padding: '11px', fontWeight: 'bold', cursor: 'pointer', fontFamily: 'inherit', textTransform: 'uppercase', fontSize: '0.85rem', borderRadius: isCli ? '0' : '4px', marginTop: '5px' }}
        >
          {loading 
            ? (isCli ? '[ОБРАБОТКА...]' : 'Загрузка...') 
            : isRegistering 
              ? (isCli ? 'ЗАГРУЗИТЬ ПРОФИЛЬ В БД' : 'Создать аккаунт') 
              : (isCli ? 'ВХОД В СИСТЕМУ' : 'Войти')}
        </button>

        {/* Разделитель */}
        <div style={{ display: 'flex', alignItems: 'center', margin: '5px 0', gap: '10px' }}>
          <div style={{ flex: 1, height: '1px', backgroundColor: isCli ? '#222' : '#334155' }}></div>
          <span style={{ color: '#555', fontSize: '0.7rem' }}>OR</span>
          <div style={{ flex: 1, height: '1px', backgroundColor: isCli ? '#222' : '#334155' }}></div>
        </div>

        {/* Кнопка Google Входа */}
        <button 
          type="button"
          onClick={handleGoogleSignIn}
          disabled={loading}
          style={{ 
            background: 'transparent', 
            border: isCli ? '1px solid #4ade80' : '1px solid #10b981', 
            color: isCli ? '#4ade80' : '#10b981', 
            padding: '10px', 
            fontWeight: 'bold', 
            cursor: 'pointer', 
            fontFamily: 'inherit', 
            textTransform: 'uppercase', 
            fontSize: '0.8rem',
            borderRadius: isCli ? '0' : '4px'
          }}
        >
          {isCli ? '[ВХОД ЧЕРЕЗ GOOGLE / GMAIL]' : 'Войти через Google'}
        </button>

        {/* Переключатель режима авторизации */}
        <button 
          type="button" 
          onClick={() => { setIsRegistering(!isRegistering); setError(''); }}
          style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer', textDecoration: 'underline', fontFamily: 'inherit', fontSize: '0.8rem', marginTop: '5px' }}
        >
          {isRegistering 
            ? (isCli ? '[УЖЕ ЕСТЬ АККАУНТ? МИГРИРОВАТЬ НА ВХОД]' : 'Уже есть аккаунт? Войти') 
            : (isCli ? '[НЕТ АККАУНТА? ИНИЦИАЛИЗИРОВАТЬ РЕГИСТРАЦИЮ]' : 'Нет аккаунта? Зарегистрироваться')}
        </button>
      </form>
    </div>
  );
}
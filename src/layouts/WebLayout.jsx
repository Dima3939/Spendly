import React from 'react';
import { useTranslation } from 'react-i18next';
import Sidebar from './Sidebar';
import LanguageSwitcher from '../components/LanguageSwitcher';
import { Globe, Moon, Sun } from 'lucide-react';

export default function WebLayout({ user, onLogout, children }) {
  const { i18n } = useTranslation();
  const [theme, setTheme] = React.useState(localStorage.getItem('spendly_theme') || 'dark');

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('spendly_theme', newTheme);
  };

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      width: '100%',
      background: 'var(--bg-app)',
    }}>
      <Sidebar user={user} onLogout={onLogout} />
      
      <main style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'auto'
      }}>
        {/* Top Header */}
        <header style={{
          padding: '24px 48px',
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          gap: '16px',
          borderBottom: '1px solid var(--border-subtle)'
        }}>
          {/* Language Switcher */}
          <LanguageSwitcher />

          {/* Theme Switcher */}
          <button
            onClick={toggleTheme}
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-primary)',
              width: '38px',
              height: '38px',
              borderRadius: 'var(--radius-full)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </header>

        {/* Content Area */}
        <div style={{
          padding: '32px 48px',
          maxWidth: '1200px',
          margin: '0 auto',
          width: '100%'
        }}>
          {children}
        </div>
      </main>
    </div>
  );
}

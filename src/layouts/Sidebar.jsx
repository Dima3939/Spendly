import React from 'react';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ArrowLeftRight, 
  CalendarDays, 
  Target, 
  Settings, 
  LogOut 
} from 'lucide-react';

export default function Sidebar({ user, onLogout }) {
  const { t } = useTranslation();
  const navItems = [
    { to: '/', icon: <LayoutDashboard size={20} />, label: t('navOverview') },
    { to: '/transactions', icon: <ArrowLeftRight size={20} />, label: t('navTransactions') },
    { to: '/plan', icon: <CalendarDays size={20} />, label: t('navMonthlyPlan') },
    { to: '/goals', icon: <Target size={20} />, label: t('navGoals') },
    { to: '/settings', icon: <Settings size={20} />, label: t('navSettings') },
  ];

  return (
    <div style={{
      width: '260px',
      background: 'var(--bg-app)',
      borderRight: '1px solid var(--border-subtle)',
      display: 'flex',
      flexDirection: 'column',
      padding: '24px 0',
      position: 'sticky',
      top: 0,
      height: '100vh',
      overflowY: 'auto'
    }}>
          {/* Brand */}
      <div style={{ padding: '0 24px', marginBottom: '40px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <img 
          src="/logo.jpg" 
          alt="Spendly" 
          style={{ 
            width: '32px', 
            height: '32px', 
            borderRadius: '8px',
            boxShadow: 'var(--shadow-glow)'
          }} 
        />
        <h1 style={{
          fontSize: '1.5rem',
          fontWeight: '800',
          color: 'var(--text-primary)',
          letterSpacing: '-0.02em',
          margin: 0
        }}>
          Spendly
        </h1>
      </div>

      {/* Nav Links */}
      <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px', padding: '0 12px' }}>
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 16px',
              borderRadius: 'var(--radius-sm)',
              color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
              background: isActive ? 'var(--bg-card-hover)' : 'transparent',
              textDecoration: 'none',
              fontWeight: isActive ? '600' : '500',
              transition: 'all 0.2s ease'
            })}
          >
            {item.icon}
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* Footer / User */}
      <div style={{ padding: '24px', borderTop: '1px solid var(--border-subtle)', marginTop: 'auto' }}>
        {user ? (
          <button
            onClick={onLogout}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              width: '100%',
              padding: '12px 16px',
              background: 'transparent',
              color: 'var(--text-secondary)',
              borderRadius: 'var(--radius-sm)',
              textAlign: 'left',
              fontWeight: '500'
            }}
          >
            <LogOut size={20} />{t('navSignOut')}</button>
        ) : (
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Not logged in
          </div>
        )}
      </div>
    </div>
  );
}

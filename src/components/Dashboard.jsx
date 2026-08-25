import React from 'react';

export default function Dashboard({
  availableToday = 0,
  baseDailyLimit = 0,
  dynamicDailyLimit = 0,
  futureDailyLimit = 0,
  currentBalance = 0,
  salary = 0,
  daysRemaining = 1,
  todaySpent = 0,
  todayIncomes = 0,
  isOverspent = false,
  overspentAmount = 0,
  onOpenIncome,
  onResetPeriod
}) {
  // Format numbers
  const formatMoney = (val) => {
    return Math.round(Number(val) || 0).toLocaleString('ru-RU');
  };

  // Calculate daily spent ratio
  const spentRatio = baseDailyLimit > 0 ? (todaySpent / baseDailyLimit) : (todaySpent > 0 ? 1 : 0);

  return (
    <div style={{
      background: 'linear-gradient(145deg, var(--bg-card) 0%, var(--bg-card-elevated) 100%)',
      borderRadius: 'var(--radius-xl)',
      padding: '24px 20px',
      border: '1px solid var(--border-subtle)',
      boxShadow: 'var(--shadow-card)',
      position: 'relative',
      overflow: 'hidden',
      marginBottom: '20px'
    }}>
      {/* Decorative ambient glow */}
      <div style={{
        position: 'absolute',
        top: '-40px',
        right: '-40px',
        width: '120px',
        height: '120px',
        background: isOverspent ? 'var(--accent-danger)' : 'var(--accent-primary)',
        opacity: 0.12,
        borderRadius: '50%',
        filter: 'blur(30px)',
        pointerEvents: 'none'
      }} />

      {/* Top Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '12px'
      }}>
        <span style={{
          fontSize: '0.8rem',
          fontWeight: '700',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          color: 'var(--text-muted)'
        }}>
          Доступно на сегодня
        </span>

        <button
          onClick={onOpenIncome}
          style={{
            background: 'var(--accent-success-bg)',
            color: 'var(--accent-success)',
            border: '1px solid rgba(16, 185, 129, 0.25)',
            borderRadius: 'var(--radius-full)',
            padding: '4px 12px',
            fontSize: '0.75rem',
            fontWeight: '700',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}
        >
          <span>+</span> Доход
        </button>
      </div>

      {/* Primary Amount */}
      <div style={{
        display: 'flex',
        alignItems: 'baseline',
        gap: '8px',
        marginBottom: '6px'
      }}>
        <span style={{
          fontSize: '3.2rem',
          fontWeight: '800',
          lineHeight: '1',
          color: isOverspent ? 'var(--accent-danger)' : 'var(--text-primary)',
          letterSpacing: '-0.03em'
        }}>
          {formatMoney(availableToday)}
        </span>
        <span style={{
          fontSize: '1.8rem',
          fontWeight: '700',
          color: isOverspent ? 'var(--accent-danger)' : 'var(--accent-primary)'
        }}>
          ₴
        </span>
        <span style={{
          fontSize: '0.85rem',
          color: 'var(--text-muted)',
          fontWeight: '500',
          marginLeft: '-2px'
        }}>
          тугриков
        </span>
      </div>

      {/* Dynamic Status Badge */}
      <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '6px',
        background: isOverspent ? 'var(--accent-danger-bg)' : todaySpent > 0 ? 'rgba(56, 189, 248, 0.1)' : 'var(--accent-success-bg)',
        color: isOverspent ? 'var(--accent-danger)' : todaySpent > 0 ? 'var(--accent-primary)' : 'var(--accent-success)',
        border: `1px solid ${isOverspent ? 'rgba(244, 63, 94, 0.25)' : 'rgba(56, 189, 248, 0.2)'}`,
        borderRadius: 'var(--radius-md)',
        padding: '6px 12px',
        fontSize: '0.82rem',
        fontWeight: '600',
        marginBottom: '18px',
        lineHeight: '1.4'
      }}>
        {isOverspent ? (
          <span>
            ⚠️ Лимит дня исчерпан (потрачено {formatMoney(todaySpent)} ₴). Со завтра норма: <strong>{formatMoney(futureDailyLimit)} ₴/день</strong>
          </span>
        ) : todaySpent > 0 ? (
          <span>
            Потрачено сегодня: {formatMoney(todaySpent)} ₴ из {formatMoney(baseDailyLimit)} ₴ 👍
          </span>
        ) : (
          <span>
            Отлично, ты в плюсе! Норма дня: {formatMoney(baseDailyLimit)} ₴ 😊
          </span>
        )}
      </div>

      {/* Day Progress Indicator */}
      <div style={{
        width: '100%',
        height: '6px',
        background: 'rgba(255, 255, 255, 0.06)',
        borderRadius: 'var(--radius-full)',
        overflow: 'hidden',
        marginBottom: '16px'
      }}>
        <div style={{
          width: `${Math.min(Math.max(spentRatio * 100, 0), 100)}%`,
          height: '100%',
          background: isOverspent 
            ? 'var(--accent-danger)' 
            : 'linear-gradient(90deg, var(--accent-primary), var(--accent-success))',
          borderRadius: 'var(--radius-full)',
          transition: 'width 0.4s ease'
        }} />
      </div>

      {/* Info Footer (Dynamic Recalculation) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '8px',
        paddingTop: '14px',
        borderTop: '1px solid var(--border-subtle)'
      }}>
        <div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '2px' }}>
            Норма в день
          </div>
          <div style={{ fontSize: '0.92rem', fontWeight: '800', color: 'var(--text-primary)' }}>
            {formatMoney(dynamicDailyLimit)} ₴
          </div>
        </div>

        <div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '2px' }}>
            Остаток на {daysRemaining} дн.
          </div>
          <div style={{ fontSize: '0.92rem', fontWeight: '800', color: 'var(--accent-primary)' }}>
            {formatMoney(currentBalance)} ₴
          </div>
        </div>

        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '2px' }}>
            Всего бюджет
          </div>
          <div style={{ fontSize: '0.92rem', fontWeight: '800', color: 'var(--text-secondary)' }}>
            {formatMoney(salary)} ₴
          </div>
        </div>
      </div>
    </div>
  );
}
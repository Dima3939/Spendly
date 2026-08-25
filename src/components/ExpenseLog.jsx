import React, { useState, useEffect } from 'react';
import { DEFAULT_CATEGORIES } from '../services/StorageService';
import { parseTxDate, isSameDay } from '../utils/dateUtils';

export default function ExpenseLog({ expenses = [], onDelete, onEdit }) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  // Automatically adjust page if item count changes
  const totalPages = Math.ceil(expenses.length / itemsPerPage) || 1;
  const activePage = Math.min(Math.max(1, currentPage), totalPages);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [expenses.length, totalPages, currentPage]);

  const startIndex = (activePage - 1) * itemsPerPage;
  const visibleItems = expenses.slice(startIndex, startIndex + itemsPerPage);

  // Retrieve category emoji
  const getCategoryEmoji = (catName, isIncome) => {
    if (isIncome) return '💰';
    const found = DEFAULT_CATEGORIES.find(c => c.name.toLowerCase() === (catName || '').toLowerCase());
    return found ? found.emoji : '💸';
  };

  const formatTime = (dateStr) => {
    if (!dateStr) return '';
    const date = parseTxDate(dateStr);
    return date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = parseTxDate(dateStr);
    const today = new Date();

    if (isSameDay(date, today)) {
      return `Сегодня, ${formatTime(dateStr)}`;
    }

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    if (isSameDay(date, yesterday)) {
      return `Вчера, ${formatTime(dateStr)}`;
    }

    return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });
  };

  return (
    <div style={{ marginBottom: '24px' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '12px',
        padding: '0 4px'
      }}>
        <span style={{
          fontSize: '0.78rem',
          fontWeight: '700',
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
          color: 'var(--text-muted)'
        }}>
          История трат
        </span>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          {expenses.length} операций
        </span>
      </div>

      {expenses.length === 0 ? (
        <div style={{
          background: 'var(--bg-card)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-subtle)',
          padding: '32px 20px',
          textAlign: 'center',
          color: 'var(--text-muted)'
        }}>
          <div style={{ fontSize: '2rem', marginBottom: '8px' }}>🎉</div>
          <div style={{ fontSize: '0.95rem', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '4px' }}>
            Трат пока нет
          </div>
          <div style={{ fontSize: '0.8rem' }}>
            Нажми на любую категорию выше, чтобы быстро записать расход
          </div>
        </div>
      ) : (
        <>
          <div style={{
            background: 'var(--bg-card)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-subtle)',
            overflow: 'hidden',
            boxShadow: 'var(--shadow-card)',
            marginBottom: '12px'
          }}>
            {visibleItems.map((tx, idx) => {
              const isIncome = Number(tx.amount) > 0;
              const emoji = getCategoryEmoji(tx.category, isIncome);
              const isLast = idx === visibleItems.length - 1;

              return (
                <div
                  key={tx.id || idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '13px 16px',
                    borderBottom: isLast ? 'none' : '1px solid var(--border-subtle)',
                    transition: 'background 0.15s ease'
                  }}
                >
                  {/* Icon & Details */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: 0 }}>
                    <div style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: 'var(--radius-md)',
                      background: isIncome ? 'var(--accent-success-bg)' : 'var(--bg-card-hover)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.25rem',
                      flexShrink: 0
                    }}>
                      {emoji}
                    </div>

                    <div style={{ minWidth: 0, flex: 1 }}>
                      <div style={{
                        fontSize: '0.88rem',
                        fontWeight: '600',
                        color: 'var(--text-primary)',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}>
                        {tx.category}
                      </div>
                      <div style={{
                        fontSize: '0.74rem',
                        color: 'var(--text-muted)',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}>
                        {tx.description ? `${tx.description} • ` : ''}
                        {formatDate(tx.created_at)}
                      </div>
                    </div>
                  </div>

                  {/* Amount & Delete */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{
                      fontSize: '0.92rem',
                      fontWeight: '700',
                      color: isIncome ? 'var(--accent-success)' : 'var(--text-primary)',
                      letterSpacing: '-0.01em'
                    }}>
                      {isIncome ? '+' : '-'}{Math.abs(Number(tx.amount)).toLocaleString('ru-RU')} ₴
                    </span>

                    <button
                      onClick={() => onDelete(tx)}
                      title="Удалить"
                      style={{
                        background: 'none',
                        color: 'var(--text-muted)',
                        padding: '4px',
                        borderRadius: 'var(--radius-sm)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.85rem',
                        opacity: 0.6,
                        cursor: 'pointer'
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--accent-danger)'; e.currentTarget.style.opacity = 1; }}
                      onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.opacity = 0.6; }}
                    >
                      ✕
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination (7 items per page) */}
          {totalPages > 1 && (
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '4px 6px',
              gap: '10px'
            }}>
              <button
                disabled={activePage <= 1}
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-full)',
                  padding: '6px 14px',
                  fontSize: '0.78rem',
                  fontWeight: '600',
                  color: activePage <= 1 ? 'var(--text-muted)' : 'var(--text-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
                }}
              >
                ← Назад
              </button>

              <span style={{
                fontSize: '0.78rem',
                fontWeight: '600',
                color: 'var(--text-muted)'
              }}>
                {activePage} из {totalPages}
              </span>

              <button
                disabled={activePage >= totalPages}
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-full)',
                  padding: '6px 14px',
                  fontSize: '0.78rem',
                  fontWeight: '600',
                  color: activePage >= totalPages ? 'var(--text-muted)' : 'var(--text-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
                }}
              >
                Вперед →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
import { exportTransactionsToCSV } from '../utils/exportCsv';
import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import i18n from '../i18n';
import { parseTxDate } from '../utils/dateUtils';
import { Search, ArrowDownToLine, Plus, Trash2 } from 'lucide-react';
import WebTransactionModal from '../components/WebTransactionModal';

export default function WebTransactions({ expenses = [], currentPeriod, handleAddExpense, handleAddIncome, handleDeleteTx , currency}) {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all'); // all, expense, income
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 15; // Set to 15 items per page

  const formatMoney = (val) => {
    return Math.round(Number(val) || 0).toLocaleString('ru-RU');
  };

  const formatDate = (dateStr) => {
    const d = parseTxDate(dateStr);
    return d.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredExpenses = useMemo(() => {
    let result = [...expenses];
    
    // Sort newest first
    result.sort((a, b) => parseTxDate(b.created_at) - parseTxDate(a.created_at));

    // Filter by type
    if (filterType === 'expense') result = result.filter(e => Number(e.amount) < 0);
    if (filterType === 'income') result = result.filter(e => Number(e.amount) > 0);

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(e => {
        const titleMatch = e.title?.toLowerCase().includes(q) || e.description?.toLowerCase().includes(q);
        const catMatch = e.category?.toLowerCase().includes(q);
        return titleMatch || catMatch;
      });
    }

    return result;
  }, [expenses, searchQuery, filterType]);

  // Reset page when filter changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filterType, expenses.length]);

  const totalPages = Math.ceil(filteredExpenses.length / ITEMS_PER_PAGE);
  const displayedExpenses = filteredExpenses.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: '800' }}>{t('transactionsTitle')}</h2>
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
          boxShadow: 'var(--shadow-glow)'
        }}>
          <Plus size={18} />
          Add transaction
        </button>
      </div>

      {/* Toolbar */}
      <div style={{
        display: 'flex',
        gap: '16px',
        marginBottom: '24px',
        flexWrap: 'wrap'
      }}>
        {/* Search */}
        <div style={{
          flex: 1,
          minWidth: '280px',
          position: 'relative',
          display: 'flex',
          alignItems: 'center'
        }}>
          <Search size={18} style={{ position: 'absolute', left: '16px', color: 'var(--text-muted)' }} />
          <input 
            type="text" 
            placeholder={t('searchPlaceholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              background: 'var(--bg-input)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-primary)',
              padding: '12px 16px 12px 44px',
              borderRadius: 'var(--radius-md)',
              outline: 'none',
              fontSize: '0.95rem'
            }}
          />
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: '12px' }}>
          <select 
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-primary)',
              padding: '12px 16px',
              borderRadius: 'var(--radius-md)',
              outline: 'none',
              cursor: 'pointer',
              minWidth: '140px'
            }}
          >
            <option value="all">{t('allTypes')}</option>
            <option value="expense">Expenses Only</option>
            <option value="income">Income Only</option>
          </select>

          <button onClick={() => { if (isPro) { exportTransactionsToCSV(expenses, currency); } else { upgradeToPro(); } }} style={{ background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)', padding: '10px 16px', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: '500' }}>
              <ArrowDownToLine size={18} />
              Export CSV {!isPro && <span style={{ fontSize: '0.65rem', background: 'var(--accent-primary)', color: '#000', padding: '2px 6px', borderRadius: '4px', fontWeight: '800' }}>PRO</span>}
            </button>
        </div>
      </div>

      {/* Table */}
      <div style={{
        background: 'var(--bg-card)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-subtle)',
        boxShadow: 'var(--shadow-card)',
        overflow: 'hidden'
      }}>
        {filteredExpenses.length > 0 ? (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                <th style={{ padding: '20px 24px', fontWeight: '600' }}>{t('thDateTime')}</th>
                <th style={{ padding: '20px 24px', fontWeight: '600' }}>{t('thCategory')}</th>
                <th style={{ padding: '20px 24px', fontWeight: '600' }}>{t('thNoteTags')}</th>
                <th style={{ padding: '20px 24px', fontWeight: '600', textAlign: 'right' }}>{t('thAmount')}</th>
                <th style={{ padding: '20px 24px', fontWeight: '600', textAlign: 'right' }}></th>
              </tr>
            </thead>
            <tbody>
              {displayedExpenses.map((ex, idx) => (
                <tr key={ex.id || idx} className="table-row" style={{ 
                  borderBottom: idx === displayedExpenses.length - 1 ? 'none' : '1px solid var(--border-subtle)',
                  transition: 'background 0.2s'
                }}>
                  <td style={{ padding: '20px 24px', color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                    {formatDate(ex.created_at)}
                  </td>
                  <td style={{ padding: '20px 24px', fontWeight: '500' }}>
                    {ex.category ? (i18n.exists('cat' + ex.category) ? t('cat' + ex.category) : ex.category.replace('cat', '')) : t('uncategorized')}
                  </td>
                  <td style={{ padding: '20px 24px', color: 'var(--text-secondary)' }}>
                    {ex.title || ex.description || '-'}
                  </td>
                  <td style={{ 
                    padding: '20px 24px', 
                    textAlign: 'right', 
                    fontWeight: '700',
                    color: Number(ex.amount) > 0 ? 'var(--accent-success)' : 'var(--text-primary)'
                  }}>
                    {Number(ex.amount) > 0 ? '+' : ''}{formatMoney(ex.amount)} {currency}
                  </td>
                  <td style={{ padding: '20px 24px', textAlign: 'right' }}>
                    <button 
                      onClick={() => {
                        if (confirm('Delete this transaction?')) handleDeleteTx(ex);
                      }}
                      style={{
                        background: 'transparent',
                        color: 'var(--text-muted)',
                        padding: '4px',
                        borderRadius: 'var(--radius-sm)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: 'none',
                        cursor: 'pointer'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.color = 'var(--accent-danger)'}
                      onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div style={{
            padding: '60px 20px',
            textAlign: 'center',
            color: 'var(--text-muted)'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '16px', opacity: 0.5 }}>🧾</div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: '8px', color: 'var(--text-primary)' }}>{t('noTransactions')}</h3>
            <p>Change the filters or log a new entry</p>
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '16px', marginTop: '24px' }}>
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            style={{
              padding: '8px 16px',
              background: 'var(--bg-card)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-sm)',
              color: currentPage === 1 ? 'var(--text-muted)' : 'var(--text-primary)',
              cursor: currentPage === 1 ? 'not-allowed' : 'pointer'
            }}
          >
            Previous
          </button>
          
          <span style={{ color: 'var(--text-secondary)' }}>
            Page {currentPage} of {totalPages}
          </span>
          
          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            style={{
              padding: '8px 16px',
              background: 'var(--bg-card)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-sm)',
              color: currentPage === totalPages ? 'var(--text-muted)' : 'var(--text-primary)',
              cursor: currentPage === totalPages ? 'not-allowed' : 'pointer'
            }}
          >
            Next
          </button>
        </div>
      )}

      <WebTransactionModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        onAddExpense={handleAddExpense}
        onAddIncome={handleAddIncome}
      />
    </div>
  );
}

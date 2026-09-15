import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';
import { parseTxDate } from '../utils/dateUtils';
import { Settings2 } from 'lucide-react';
import WebEditPeriodModal from '../components/WebEditPeriodModal';

export default function WebOverview({
  expenses = [],
  currentPeriod,
  availableToday,
  baseDailyLimit,
  dynamicDailyLimit,
  currentBalance,
  salary,
  totalSpent,
  todaySpent,
  isOverspent,
  overspentAmount,
  handleUpdatePeriod
, currency}) {
  const { t } = useTranslation();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const formatMoney = (val) => {
    return Math.round(Number(val) || 0).toLocaleString('ru-RU');
  };

  const chartData = useMemo(() => {
    if (!currentPeriod) return [];
    
    const start = parseTxDate(currentPeriod.startDate || currentPeriod.start_date);
    const end = parseTxDate(currentPeriod.endDate || currentPeriod.end_date);
    
    const data = [];
    let cumulativeSpent = 0;
    
    // Create an array of days
    const daysCount = Math.floor((end - start) / (1000 * 60 * 60 * 24)) + 1;
    const today = new Date();
    
    for (let i = 0; i < daysCount; i++) {
      const currentDay = new Date(start.getTime() + i * 24 * 60 * 60 * 1000);
      
      // Calculate spent on this specific day
      const spentOnDay = expenses
        .filter(ex => Number(ex.amount) < 0)
        .filter(ex => {
          const exDate = parseTxDate(ex.created_at);
          return exDate.getFullYear() === currentDay.getFullYear() &&
                 exDate.getMonth() === currentDay.getMonth() &&
                 exDate.getDate() === currentDay.getDate();
        })
        .reduce((sum, ex) => sum + Math.abs(Number(ex.amount)), 0);

      cumulativeSpent += spentOnDay;
      const idealPace = baseDailyLimit * (i + 1);
      
      // Only show fact line up to today
      const isPastOrToday = currentDay.setHours(0,0,0,0) <= today.setHours(0,0,0,0);
      
      data.push({
        name: currentDay.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' }),
        fact: isPastOrToday ? cumulativeSpent : null,
        plan: idealPace
      });
    }
    
    return data;
  }, [currentPeriod, expenses, baseDailyLimit]);

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: '800' }}>{t('overviewTitle')}</h2>
        <button 
          onClick={() => setIsEditModalOpen(true)}
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-subtle)',
            color: 'var(--text-primary)',
            padding: '10px 16px',
            borderRadius: 'var(--radius-sm)',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-card-hover)'}
          onMouseLeave={(e) => e.currentTarget.style.background = 'var(--bg-card)'}
        >
          <Settings2 size={18} />{t('editBudget')}</button>
      </div>

      {/* Main Metric Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '24px',
        marginBottom: '40px'
      }}>
        {/* Safe to spend */}
        <div style={{
          background: 'var(--bg-card)',
          padding: '24px',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-subtle)',
          boxShadow: 'var(--shadow-card)'
        }}>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '8px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {t('safeToSpendToday')}
          </div>
          <div style={{ 
            fontSize: '3rem', 
            fontWeight: '800', 
            color: isOverspent ? 'var(--accent-danger)' : 'var(--accent-success)',
            letterSpacing: '-0.02em',
            marginBottom: '8px'
          }}>
            {formatMoney(availableToday)} {currency}
          </div>
          <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            {isOverspent 
              ? t('overspentBy', { amount: formatMoney(overspentAmount) + ' ' + currency }) 
              : t('currentBalance', { amount: formatMoney(currentBalance) + ' ' + currency })}
          </div>
        </div>

        <div style={{
          background: 'var(--bg-card)',
          padding: '24px',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-subtle)',
          boxShadow: 'var(--shadow-card)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center'
        }}>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '8px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {t('spentTotal')}
          </div>
          <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '8px' }}>
            {formatMoney(totalSpent)} {currency}
          </div>
          <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            {t('outOfBudget', { amount: formatMoney(salary) + ' ' + currency })}
          </div>
        </div>
        
        <div style={{
          background: 'var(--bg-card)',
          padding: '24px',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-subtle)',
          boxShadow: 'var(--shadow-card)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center'
        }}>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '8px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {t('idealDailyLimit')}
          </div>
          <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '8px' }}>
            {formatMoney(baseDailyLimit)} {currency}
          </div>
          <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            {t('recommendedPace')}
          </div>
        </div>
      </div>
      
      {/* Chart Section */}
      <div style={{
        background: 'var(--bg-card)',
        padding: '32px',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-subtle)',
        boxShadow: 'var(--shadow-card)',
        marginBottom: '40px'
      }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '8px' }}>{t('dailyRhythm')}</h3>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '32px', fontSize: '0.95rem' }}>
          {t('comparePace')}
        </p>

        {chartData.length > 0 ? (
          <div style={{ height: '350px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  stroke="var(--text-muted)" 
                  fontSize={12} 
                  tickLine={false}
                  axisLine={false}
                  dy={10}
                />
                <YAxis 
                  stroke="var(--text-muted)" 
                  fontSize={12} 
                  tickLine={false}
                  axisLine={false}
                  dx={-10}
                  tickFormatter={(val) => `${formatMoney(val)}`}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'var(--bg-card-elevated)', 
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '8px',
                    color: 'var(--text-primary)'
                  }}
                  itemStyle={{ fontWeight: '600' }}
                />
                <Line 
                  name={t("planLabel")}
                  type="monotone" 
                  dataKey="plan" 
                  stroke="var(--accent-primary)" 
                  strokeWidth={2}
                  dot={false} 
                  strokeDasharray="5 5"
                />
                <Line 
                  name={t('factSpent')}
                  type="monotone" 
                  dataKey="fact" 
                  stroke="var(--accent-success)" 
                  strokeWidth={3}
                  dot={{ r: 4, fill: 'var(--bg-card)', strokeWidth: 2 }}
                  activeDot={{ r: 6 }} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '40px 0' }}>
            No period data available to show chart.
          </div>
        )}
      </div>

      <WebEditPeriodModal 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)}
        currentPeriod={currentPeriod}
        onUpdate={handleUpdatePeriod}
      />
    </div>
  );
}

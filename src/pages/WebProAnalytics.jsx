import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AreaChart, Area, BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import { Sparkles, Lock } from 'lucide-react';
import ProPaywallModal from '../components/ProPaywallModal';

export default function WebProAnalytics({ expenses = [], salary = 0, isPro, upgradeToPro }) {
  const { t } = useTranslation();
  const [showPaywall, setShowPaywall] = useState(false);

  // 1. Daily Burn Rate Data
  // Group expenses by day
  const dailyMap = {};
  expenses.filter(tx => tx && Number(tx.amount) < 0).forEach(tx => {
    const d = new Date(tx.date).toLocaleDateString('en-CA');
    dailyMap[d] = (dailyMap[d] || 0) + Math.abs(Number(tx.amount));
  });
  
  const sortedDays = Object.keys(dailyMap).sort();
  let cumulative = 0;
  const burnData = sortedDays.map(day => {
    cumulative += dailyMap[day];
    return { day: day.substring(8) + ' ' + day.substring(5,7), spend: cumulative, daily: dailyMap[day] };
  });

  // 2. Income vs Expense by some metric (we'll just use a single bar comparison for the period)
  const totalIncomes = salary + expenses
    .filter(t => t && Number(t.amount) > 0)
    .reduce((sum, tx) => sum + Number(tx.amount), 0);

  const totalExpenses = expenses
    .filter(t => t && Number(t.amount) < 0)
    .reduce((sum, tx) => sum + Math.abs(Number(tx.amount)), 0);

  const incExpData = [
    { name: t('typeIncome', 'Income'), amount: totalIncomes, fill: 'var(--accent-success)' },
    { name: t('typeExpense', 'Expense'), amount: totalExpenses, fill: 'var(--accent-danger)' }
  ];

  // 3. Fake historical trend for demonstration (since we don't have past periods loaded here easily)
  const trendData = [
    { month: 'Apr', saved: 200 },
    { month: 'May', saved: 450 },
    { month: 'Jun', saved: 120 },
    { month: 'Jul', saved: 800 },
    { month: 'Aug', saved: 340 },
    { month: 'Sep', saved: totalIncomes - totalExpenses }
  ];

  return (
    <div className="animate-fade-in" style={{ maxWidth: '1000px', position: 'relative' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
        <Sparkles size={32} color="var(--accent-primary)" />
        <div>
          <h2 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '4px' }}>Pro Analytics</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Deep insights and advanced financial charts.</p>
        </div>
      </div>

      <div style={{ 
        display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px',
        filter: !isPro ? 'blur(8px) grayscale(0.5)' : 'none',
        pointerEvents: !isPro ? 'none' : 'auto',
        transition: 'all 0.3s'
      }}>
        
        {/* Burn Rate Area Chart */}
        <div style={{ background: 'var(--bg-card)', padding: '24px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)', gridColumn: '1 / -1' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '24px', color: 'var(--text-primary)' }}>Cumulative Spend (Burn Rate)</h3>
          <div style={{ width: '100%', height: 300 }}>
            {burnData.length > 0 ? (
              <ResponsiveContainer>
                <AreaChart data={burnData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorSpend" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--accent-primary)" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="var(--accent-primary)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" vertical={false} />
                  <XAxis dataKey="day" stroke="var(--text-muted)" tick={{ fontSize: 12 }} />
                  <YAxis stroke="var(--text-muted)" tick={{ fontSize: 12 }} />
                  <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '8px' }} />
                  <Area type="monotone" dataKey="spend" stroke="var(--accent-primary)" strokeWidth={3} fillOpacity={1} fill="url(#colorSpend)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : <p style={{ color: 'var(--text-muted)' }}>No data available.</p>}
          </div>
        </div>

        {/* Income vs Expense Bar */}
        <div style={{ background: 'var(--bg-card)', padding: '24px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '24px', color: 'var(--text-primary)' }}>Income vs Expense</h3>
          <div style={{ width: '100%', height: 250 }}>
            <ResponsiveContainer>
              <BarChart data={incExpData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" vertical={false} />
                <XAxis dataKey="name" stroke="var(--text-muted)" tick={{ fontSize: 12 }} />
                <YAxis stroke="var(--text-muted)" tick={{ fontSize: 12 }} />
                <Tooltip cursor={{ fill: 'rgba(255,255,255,0.05)' }} contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '8px' }} />
                <Bar dataKey="amount" radius={[6, 6, 0, 0]} barSize={40}>
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Savings Trend Line */}
        <div style={{ background: 'var(--bg-card)', padding: '24px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '24px', color: 'var(--text-primary)' }}>Savings Trend (Mock)</h3>
          <div style={{ width: '100%', height: 250 }}>
            <ResponsiveContainer>
              <LineChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" vertical={false} />
                <XAxis dataKey="month" stroke="var(--text-muted)" tick={{ fontSize: 12 }} />
                <YAxis stroke="var(--text-muted)" tick={{ fontSize: 12 }} />
                <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '8px' }} />
                <Line type="monotone" dataKey="saved" stroke="#a855f7" strokeWidth={3} dot={{ r: 4, fill: '#a855f7' }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Paywall Overlay */}
      {!isPro && (
        <div style={{
          position: 'absolute', top: '100px', left: 0, right: 0, bottom: 0,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          zIndex: 10
        }}>
          <div style={{
            background: 'var(--bg-card)', padding: '40px', borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-focus)', boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
            textAlign: 'center', maxWidth: '400px'
          }}>
            <Lock size={48} color="var(--accent-primary)" style={{ margin: '0 auto 16px' }} />
            <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '8px', color: 'var(--text-primary)' }}>Unlock Pro Analytics</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
              Get deep insights into your spending habits with interactive charts and historical trends.
            </p>
            <button 
              onClick={() => setShowPaywall(true)}
              style={{
                background: 'var(--accent-primary)', color: '#000', border: 'none',
                padding: '12px 24px', borderRadius: 'var(--radius-full)',
                fontWeight: '700', fontSize: '1.1rem', cursor: 'pointer',
                boxShadow: 'var(--shadow-glow)', width: '100%'
              }}
            >
              Learn More
            </button>
          </div>
        </div>
      )}

      <ProPaywallModal 
        isOpen={showPaywall} 
        onClose={() => setShowPaywall(false)} 
        onUpgrade={() => {
          upgradeToPro();
          setShowPaywall(false);
        }} 
      />
    </div>
  );
}

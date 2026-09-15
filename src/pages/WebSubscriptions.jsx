import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Repeat, Plus, Trash2, CreditCard } from 'lucide-react';
import storageService from '../services/StorageService';

export default function WebSubscriptions({ user, currency }) {
  const { t } = useTranslation();
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);

  // Form state
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [cycle, setCycle] = useState('monthly');
  const [nextDate, setNextDate] = useState('');

  const loadSubs = async () => {
    try {
      setLoading(true);
      const subs = await storageService.getSubscriptions(user);
      setSubscriptions(subs || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSubs();
  }, [user]);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!title || !amount || !nextDate) return;
    try {
      const payload = {
        title,
        amount: Number(amount),
        category: category || 'Subscriptions',
        billing_cycle: cycle,
        next_billing_date: nextDate
      };
      await storageService.createSubscription(payload, user);
      setIsAdding(false);
      setTitle(''); setAmount(''); setCategory(''); setNextDate('');
      loadSubs();
    } catch (err) {
      alert("Error adding subscription: " + err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await storageService.deleteSubscription(id, user);
      loadSubs();
    } catch (err) {
      alert("Error deleting: " + err.message);
    }
  };

  return (
    <div className="animate-fade-in" style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
        <div>
          <h2 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '8px' }}>Subscriptions</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Manage recurring payments (Netflix, Rent, etc.)</p>
        </div>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          style={{
            background: 'var(--accent-primary)',
            color: '#fff',
            border: 'none',
            padding: '10px 20px',
            borderRadius: 'var(--radius-md)',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            cursor: 'pointer'
          }}
        >
          <Plus size={18} />
          {isAdding ? 'Cancel' : 'Add New'}
        </button>
      </div>

      {isAdding && (
        <div style={{ background: 'var(--bg-card)', padding: '24px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)', marginBottom: '32px' }}>
          <h3 style={{ marginBottom: '20px' }}>Add Subscription</h3>
          <form onSubmit={handleAdd} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <input type="text" placeholder="Title (e.g. Spotify)" value={title} onChange={e => setTitle(e.target.value)} required style={{ padding: '12px', background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', color: 'var(--text-primary)' }} />
            <input type="number" placeholder="Amount" step="any" value={amount} onChange={e => setAmount(e.target.value)} required style={{ padding: '12px', background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', color: 'var(--text-primary)' }} />
            <input type="date" value={nextDate} onChange={e => setNextDate(e.target.value)} required style={{ padding: '12px', background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', color: 'var(--text-primary)' }} />
            <select value={cycle} onChange={e => setCycle(e.target.value)} style={{ padding: '12px', background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', color: 'var(--text-primary)' }}>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
            <button type="submit" style={{ gridColumn: 'span 2', padding: '14px', background: 'var(--accent-primary)', color: '#fff', border: 'none', borderRadius: 'var(--radius-md)', fontWeight: '700', cursor: 'pointer' }}>Save Subscription</button>
          </form>
        </div>
      )}

      {loading ? (
        <div>Loading...</div>
      ) : subscriptions.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', border: '1px dashed var(--border-subtle)' }}>
          <Repeat size={48} color="var(--text-muted)" style={{ marginBottom: '16px' }} />
          <h3 style={{ fontSize: '1.2rem', color: 'var(--text-primary)', marginBottom: '8px' }}>No subscriptions yet</h3>
          <p style={{ color: 'var(--text-secondary)' }}>Add your recurring payments and they will be deducted automatically.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {subscriptions.map(sub => (
            <div key={sub.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--bg-card)', padding: '20px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--bg-input)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <CreditCard color="var(--accent-primary)" size={24} />
                </div>
                <div>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: '700', margin: '0 0 4px 0' }}>{sub.title}</h4>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    {sub.billing_cycle === 'monthly' ? 'Monthly' : 'Yearly'} • Next bill: {new Date(sub.next_billing_date).toLocaleDateString()}
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                <span style={{ fontSize: '1.2rem', fontWeight: '800' }}>
                  -{sub.amount} {currency}
                </span>
                <button onClick={() => handleDelete(sub.id)} style={{ background: 'transparent', border: 'none', color: 'var(--accent-danger)', cursor: 'pointer' }}>
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

import databaseService from './SupabaseService';

const LOCAL_PERIOD_KEY = 'spendly_guest_periods';
const LOCAL_TX_KEY = 'spendly_guest_transactions';
const LOCAL_CATEGORIES_KEY = 'spendly_guest_categories';

export const DEFAULT_CATEGORIES = [
  { id: 'cat-1', name: 'Еда', emoji: '🍔', color: '#f97316' },
  { id: 'cat-2', name: 'Кофе', emoji: '☕', color: '#d97706' },
  { id: 'cat-3', name: 'Такси', emoji: '🚕', color: '#eab308' },
  { id: 'cat-4', name: 'Покупки', emoji: '🛒', color: '#06b6d4' },
  { id: 'cat-5', name: 'Отдых', emoji: '🎮', color: '#8b5cf6' },
  { id: 'cat-6', name: 'Здоровье', emoji: '💊', color: '#ec4899' },
  { id: 'cat-7', name: 'Быт', emoji: '🏠', color: '#10b981' },
  { id: 'cat-8', name: 'Другое', emoji: '📦', color: '#64748b' },
];

class StorageService {
  // --- FINANCIAL PERIODS ---
  async getPeriods(user = null) {
    if (user && user.id) {
      try {
        return await databaseService.fetchPeriods(user.id);
      } catch (err) {
        console.warn('Supabase offline or error, using local fallback:', err.message);
      }
    }
    const local = localStorage.getItem(LOCAL_PERIOD_KEY);
    return local ? JSON.parse(local) : [];
  }

  async createPeriod(periodData, user = null) {
    if (user && user.id) {
      try {
        const payload = {
          user_id: user.id,
          start_date: periodData.start_date,
          end_date: periodData.end_date,
          initial_income: parseFloat(periodData.initial_income)
        };
        return await databaseService.createPeriod(payload);
      } catch (err) {
        console.error('Failed to create period in Supabase:', err.message);
        throw err;
      }
    }

    // Guest Mode (localStorage)
    const newPeriod = {
      id: 'local-period-' + Date.now(),
      user_id: 'guest',
      start_date: periodData.start_date,
      end_date: periodData.end_date,
      initial_income: parseFloat(periodData.initial_income),
      created_at: new Date().toISOString()
    };

    const existing = await this.getPeriods();
    const updated = [newPeriod, ...existing];
    localStorage.setItem(LOCAL_PERIOD_KEY, JSON.stringify(updated));
    return newPeriod;
  }

  // --- TRANSACTIONS ---
  async getTransactions(periodId, user = null) {
    if (user && user.id) {
      try {
        return await databaseService.fetchTransactions(periodId);
      } catch (err) {
        console.warn('Failed to fetch transactions from Supabase:', err.message);
      }
    }

    const local = localStorage.getItem(LOCAL_TX_KEY);
    const all = local ? JSON.parse(local) : [];
    if (!periodId) return all;
    return all.filter(t => t.period_id === periodId);
  }

  async getAllTransactions(user = null) {
    if (user && user.id) {
      try {
        return await databaseService.fetchAllTransactions(user.id);
      } catch (err) {
        console.warn('Failed to fetch all transactions from Supabase:', err.message);
      }
    }
    const local = localStorage.getItem(LOCAL_TX_KEY);
    return local ? JSON.parse(local) : [];
  }

  async createTransaction(txData, user = null) {
    const nowIso = txData.created_at || new Date().toISOString();
    if (user && user.id) {
      try {
        return await databaseService.createTransaction({
          ...txData,
          user_id: user.id,
          created_at: nowIso
        });
      } catch (err) {
        console.error('Failed to save tx in Supabase:', err.message);
        throw err;
      }
    }

    // Guest Mode
    const newTx = {
      id: 'local-tx-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
      period_id: txData.period_id,
      amount: txData.amount,
      category: txData.category,
      description: txData.description || '',
      created_at: nowIso
    };

    const existing = await this.getAllTransactions();
    const updated = [newTx, ...existing];
    localStorage.setItem(LOCAL_TX_KEY, JSON.stringify(updated));
    return newTx;
  }

  async deleteTransaction(txId, user = null) {
    if (user && user.id && typeof txId === 'number') {
      try {
        await databaseService.deleteTransaction(txId);
        return true;
      } catch (err) {
        console.error('Failed to delete tx in Supabase:', err.message);
        throw err;
      }
    }

    const existing = await this.getAllTransactions();
    const updated = existing.filter(t => t.id !== txId);
    localStorage.setItem(LOCAL_TX_KEY, JSON.stringify(updated));
    return true;
  }

  async updateTransaction(txId, updatedFields, user = null) {
    if (user && user.id && typeof txId === 'number') {
      try {
        return await databaseService.updateTransaction(txId, updatedFields);
      } catch (err) {
        console.error('Failed to update tx in Supabase:', err.message);
        throw err;
      }
    }

    const existing = await this.getAllTransactions();
    let updatedTx = null;
    const updated = existing.map(t => {
      if (t.id === txId) {
        updatedTx = { ...t, ...updatedFields };
        return updatedTx;
      }
      return t;
    });
    localStorage.setItem(LOCAL_TX_KEY, JSON.stringify(updated));
    return updatedTx;
  }

  // --- SYNC GUEST DATA TO SUPABASE ---
  async syncGuestDataToCloud(user) {
    if (!user || !user.id) return;
    const localPeriods = localStorage.getItem(LOCAL_PERIOD_KEY);
    const localTxs = localStorage.getItem(LOCAL_TX_KEY);

    if (!localPeriods && !localTxs) return;

    try {
      const periods = localPeriods ? JSON.parse(localPeriods) : [];
      const txs = localTxs ? JSON.parse(localTxs) : [];

      for (const p of periods) {
        if (typeof p.id === 'string' && p.id.startsWith('local-')) {
          const createdPeriod = await databaseService.createPeriod({
            user_id: user.id,
            start_date: p.start_date,
            end_date: p.end_date,
            initial_income: p.initial_income
          });

          const relatedTxs = txs.filter(t => t.period_id === p.id);
          for (const t of relatedTxs) {
            await databaseService.createTransaction({
              user_id: user.id,
              period_id: createdPeriod.id,
              amount: t.amount,
              category: t.category,
              description: t.description || '',
              created_at: t.created_at
            });
          }
        }
      }

      // Clear guest storage after successful sync
      localStorage.removeItem(LOCAL_PERIOD_KEY);
      localStorage.removeItem(LOCAL_TX_KEY);
    } catch (err) {
      console.error('Failed to sync guest data to Supabase:', err);
    }
  }

  // Reset guest data
  clearGuestData() {
    localStorage.removeItem(LOCAL_PERIOD_KEY);
    localStorage.removeItem(LOCAL_TX_KEY);
  }
}

export default new StorageService();

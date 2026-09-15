const fs = require('fs');

// 1. SupabaseService.js
let sup = fs.readFileSync('src/services/SupabaseService.js', 'utf8');

const supMethods = `
  // SUBSCRIPTIONS
  async fetchSubscriptions(userId) {
    const { data, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .order('next_billing_date', { ascending: true });
    if (error) throw error;
    return data;
  }
  async createSubscription(subData) {
    const { data, error } = await supabase
      .from('subscriptions')
      .insert([subData])
      .select()
      .single();
    if (error) throw error;
    return data;
  }
  async updateSubscription(subId, updates) {
    const { data, error } = await supabase
      .from('subscriptions')
      .update(updates)
      .eq('id', subId)
      .select()
      .single();
    if (error) throw error;
    return data;
  }
  async deleteSubscription(subId) {
    const { error } = await supabase
      .from('subscriptions')
      .delete()
      .eq('id', subId);
    if (error) throw error;
    return true;
  }
`;

sup = sup.replace(/class SupabaseService \{/, "class SupabaseService {\n" + supMethods);
fs.writeFileSync('src/services/SupabaseService.js', sup, 'utf8');

// 2. StorageService.js
let stor = fs.readFileSync('src/services/StorageService.js', 'utf8');

const storMethods = `
  const LOCAL_SUB_KEY = 'spendly_guest_subscriptions';
  
  // SUBSCRIPTIONS
  async getSubscriptions(user) {
    if (user && user.id) {
      try {
        return await databaseService.fetchSubscriptions(user.id);
      } catch (err) {
        console.warn('Supabase offline or error, using local fallback:', err.message);
      }
    }
    const local = localStorage.getItem(LOCAL_SUB_KEY);
    return local ? JSON.parse(local) : [];
  }

  async createSubscription(payload, user) {
    const nowIso = new Date().toISOString();
    if (user && user.id) {
      try {
        return await databaseService.createSubscription({
          ...payload,
          user_id: user.id
        });
      } catch (err) {
        console.error('Failed to create sub in Supabase:', err.message);
        throw err;
      }
    }
    const local = await this.getSubscriptions(null);
    const newSub = {
      ...payload,
      id: crypto.randomUUID(),
      created_at: nowIso
    };
    local.push(newSub);
    localStorage.setItem(LOCAL_SUB_KEY, JSON.stringify(local));
    return newSub;
  }

  async updateSubscription(subId, updates, user) {
    if (user && user.id) {
      try {
        return await databaseService.updateSubscription(subId, updates);
      } catch (err) {
        console.error('Failed to update sub in Supabase:', err.message);
        throw err;
      }
    }
    const local = await this.getSubscriptions(null);
    const idx = local.findIndex(s => s.id === subId);
    if (idx !== -1) {
      local[idx] = { ...local[idx], ...updates };
      localStorage.setItem(LOCAL_SUB_KEY, JSON.stringify(local));
      return local[idx];
    }
    throw new Error('Subscription not found locally');
  }

  async deleteSubscription(subId, user) {
    if (user && user.id) {
      try {
        await databaseService.deleteSubscription(subId);
        return true;
      } catch (err) {
        console.error('Failed to delete sub in Supabase:', err.message);
        throw err;
      }
    }
    const local = await this.getSubscriptions(null);
    const filtered = local.filter(s => s.id !== subId);
    localStorage.setItem(LOCAL_SUB_KEY, JSON.stringify(filtered));
    return true;
  }
`;

stor = stor.replace(/const LOCAL_TX_KEY = 'spendly_guest_transactions';/, "const LOCAL_TX_KEY = 'spendly_guest_transactions';\n" + storMethods);
fs.writeFileSync('src/services/StorageService.js', stor, 'utf8');

console.log('Updated services for Subscriptions');

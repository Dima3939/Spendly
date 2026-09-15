const fs = require('fs');

let stor = fs.readFileSync('src/services/StorageService.js', 'utf8');

const storMethods = `
  // SUBSCRIPTIONS
  async getSubscriptions(user) {
    if (user && user.id) {
      try {
        return await databaseService.fetchSubscriptions(user.id);
      } catch (err) {
        console.warn('Supabase offline or error, using local fallback:', err.message);
      }
    }
    const local = localStorage.getItem('spendly_guest_subscriptions');
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
    localStorage.setItem('spendly_guest_subscriptions', JSON.stringify(local));
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
      localStorage.setItem('spendly_guest_subscriptions', JSON.stringify(local));
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
    localStorage.setItem('spendly_guest_subscriptions', JSON.stringify(filtered));
    return true;
  }
`;

stor = stor.replace(/class StorageService \{/, "class StorageService {\n" + storMethods);
fs.writeFileSync('src/services/StorageService.js', stor, 'utf8');

console.log('Fixed StorageService for Subscriptions');

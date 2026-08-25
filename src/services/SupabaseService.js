import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

class SupabaseService {
  constructor() {
    if (SupabaseService.instance) {
      return SupabaseService.instance;
    }
    this._client = createClient(supabaseUrl, supabaseKey);
    SupabaseService.instance = this;
  }

  // --- AUTHENTICATION METHODS ---
  
  async signInWithGoogle() {
    const { data, error } = await this._client.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin
      }
    });
    if (error) throw new Error(error.message);
    return data;
  }

  async signUp(email, password, username) {
    const { data, error } = await this._client.auth.signUp({ 
      email, 
      password,
      options: {
        data: {
          username: username ? username.trim() : ''
        }
      }
    });
    if (error) throw new Error(error.message);
    return data.user;
  }

  async signIn(email, password) {
    const { data, error } = await this._client.auth.signInWithPassword({ email, password });
    if (error) throw new Error(error.message);
    return data.user;
  }

  async signOut() {
    const { error } = await this._client.auth.signOut();
    if (error) throw new Error(error.message);
    return true;
  }

  async getCurrentUser() {
    const { data: { user }, error } = await this._client.auth.getUser();
    if (error) return null;
    return user;
  }

  // --- TRANSACTIONS ---
  async fetchTransactions(arg) {
    let query = this._client
      .from('transactions')
      .select('*')
      .order('created_at', { ascending: false });

    if (arg) {
      // 1. UUID string (filter by user_id)
      if (typeof arg === 'string' && arg.length === 36 && arg.includes('-')) {
        query = query.eq('user_id', arg);
      } 
      // 2. Numeric / ID (filter by period_id)
      else if (typeof arg === 'number' || (!isNaN(arg) && Number.isInteger(Number(arg)))) {
        query = query.eq('period_id', Number(arg));
      } 
      // 3. Object with id
      else if (typeof arg === 'object' && arg.id) {
        const id = arg.id;
        if (typeof id === 'string' && id.length === 36 && id.includes('-')) {
          query = query.eq('user_id', id);
        } else {
          query = query.eq('period_id', Number(id));
        }
      }
    }

    const { data, error } = await query;
    if (error) throw new Error(error.message);
    return data || [];
  }

  async fetchAllTransactions(userId) {
    return this.fetchTransactions(userId);
  }

  async addTransaction(transactionData) {
    const payload = {
      ...transactionData,
      created_at: transactionData.created_at || new Date().toISOString()
    };
    const { data, error } = await this._client
      .from('transactions')
      .insert([payload])
      .select();

    if (error) throw new Error(error.message);
    return data[0];
  }

  async createTransaction(transactionData) {
    return this.addTransaction(transactionData);
  }

  async deleteTransaction(id) {
    const { data, error } = await this._client
      .from('transactions')
      .delete()
      .eq('id', id)
      .select();

    if (error) throw new Error(error.message);
    return true;
  }

  async updateTransaction(id, transactionData) {
    const { data, error } = await this._client
      .from('transactions')
      .update(transactionData)
      .eq('id', id)
      .select();

    if (error) throw new Error(error.message);
    return data[0];
  }

  // --- CATEGORIES ---

  async fetchCategories(userId) {
    let query = this._client
      .from('categories')
      .select('*')
      .order('name', { ascending: true });

    if (userId) {
      query = query.eq('user_id', userId);
    }

    const { data, error } = await query;
    if (error) throw new Error(error.message);
    return data || [];
  }

  async addCategory(categoryData) {
    const { data, error } = await this._client
      .from('categories')
      .insert([categoryData])
      .select();

    if (error) throw new Error(error.message);
    return data[0];
  }

  // --- FINANCIAL PERIODS ---

  async fetchPeriods(userId) {
    let query = this._client
      .from('periods')
      .select('*')
      .order('created_at', { ascending: false });

    if (userId) {
      query = query.eq('user_id', userId);
    }

    const { data, error } = await query;
    if (error) {
      console.error('Failed to fetch periods:', error.message);
      throw new Error(error.message);
    }
    return data || [];
  }

  async addPeriod(periodData) {
    const { data, error } = await this._client
      .from('periods')
      .insert([periodData])
      .select();

    if (error) throw new Error(error.message);
    return data[0];
  }

  async createPeriod(periodData) {
    return this.addPeriod(periodData);
  }

  async updatePeriod(id, periodData) {
    const { data, error } = await this._client
      .from('periods')
      .update(periodData)
      .eq('id', id)
      .select();

    if (error) throw new Error(error.message);
    return data[0];
  }
}

export default new SupabaseService();
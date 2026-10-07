// server/services/savedService.js
const { supabaseAdmin, createAuthClient } = require('../config/supabase');

// Fallback in-memory storage for saved comparisons if Supabase table is not yet migrated
const memorySavedComparisons = new Map();

async function getSaved(user, token) {
  try {
    const client = token ? createAuthClient(token) : supabaseAdmin;
    const { data, error } = await client
      .from('saved_comparisons')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (!error && data) {
      return data;
    }
  } catch (err) {
    console.warn('Supabase saved_comparisons query notice:', err.message);
  }

  // Fallback to in-memory store for this user
  const userList = memorySavedComparisons.get(user.id) || [];
  return [...userList].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
}

async function createSaved(user, { loanIds, amount, tenureMonths }, token) {
  if (!Array.isArray(loanIds) || loanIds.length < 2 || loanIds.length > 4) {
    const error = new Error('A saved comparison must contain between 2 and 4 loans.');
    error.status = 400;
    throw error;
  }

  const parsedAmount = Number(amount);
  const parsedTenure = Number(tenureMonths);

  if (isNaN(parsedAmount) || parsedAmount <= 0) {
    const error = new Error('Amount must be positive.');
    error.status = 400;
    throw error;
  }

  if (isNaN(parsedTenure) || parsedTenure <= 0) {
    const error = new Error('Tenure must be positive.');
    error.status = 400;
    throw error;
  }

  const payload = {
    user_id: user.id,
    loan_ids: loanIds,
    amount: parsedAmount,
    tenure_months: parsedTenure
  };

  try {
    const client = token ? createAuthClient(token) : supabaseAdmin;
    const { data, error } = await client
      .from('saved_comparisons')
      .insert([payload])
      .select()
      .single();

    if (!error && data) {
      return data;
    }
  } catch (err) {
    console.warn('Supabase saved_comparisons insert notice:', err.message);
  }

  // Fallback to in-memory record
  const savedRecord = {
    id: 'saved-' + Date.now() + '-' + Math.random().toString(36).substring(2, 9),
    user_id: user.id,
    loan_ids: loanIds,
    amount: parsedAmount,
    tenure_months: parsedTenure,
    created_at: new Date().toISOString()
  };

  const userList = memorySavedComparisons.get(user.id) || [];
  userList.push(savedRecord);
  memorySavedComparisons.set(user.id, userList);

  return savedRecord;
}

async function deleteSaved(user, id, token) {
  try {
    const client = token ? createAuthClient(token) : supabaseAdmin;
    const { error } = await client
      .from('saved_comparisons')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (!error) {
      // Also clean in-memory if present
      const list = memorySavedComparisons.get(user.id) || [];
      memorySavedComparisons.set(user.id, list.filter(item => item.id !== id));
      return { success: true };
    }
  } catch (err) {
    console.warn('Supabase delete error:', err.message);
  }

  const list = memorySavedComparisons.get(user.id) || [];
  const initialLength = list.length;
  const filtered = list.filter(item => item.id !== id);
  memorySavedComparisons.set(user.id, filtered);

  if (filtered.length === initialLength) {
    const error = new Error('Saved comparison not found or not owned by user.');
    error.status = 404;
    throw error;
  }

  return { success: true };
}

module.exports = {
  getSaved,
  createSaved,
  deleteSaved
};

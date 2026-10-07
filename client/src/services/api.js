// client/src/services/api.js

const API_BASE = '/api';

/**
 * Helper to handle fetch responses and error extraction
 */
async function request(endpoint, options = {}) {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    },
    ...options
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const errorMsg = data.error || `Request failed with status ${response.status}`;
    throw new Error(errorMsg);
  }

  return data;
}

/**
 * Fetch loans with optional filtering and sorting
 * @param {Object} params - { type, minRate, maxRate, sort, country }
 */
export async function getLoans(params = {}) {
  const query = new URLSearchParams();
  if (params.type) query.append('type', params.type);
  if (params.country) query.append('country', params.country);
  if (params.minRate !== undefined && params.minRate !== '') query.append('minRate', params.minRate);
  if (params.maxRate !== undefined && params.maxRate !== '') query.append('maxRate', params.maxRate);
  if (params.sort) query.append('sort', params.sort);

  const qs = query.toString();
  return request(`/loans${qs ? `?${qs}` : ''}`);
}

/**
 * Fetch a single loan by its ID
 */
export async function getLoanById(id) {
  return request(`/loans/${id}`);
}

/**
 * Trigger real-time bank interest rate benchmark sync
 */
export async function syncBankRates() {
  return request('/loans/sync', {
    method: 'POST'
  });
}

/**
 * Get current sync status
 */
export async function getSyncStatus() {
  return request('/loans/sync-status');
}

/**
 * Compare 2 to 4 loans given amount and tenure
 * @param {Object} payload - { loanIds: string[], amount: number, tenureMonths: number }
 */
export async function compareLoans(payload) {
  return request('/compare', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}

/**
 * Fetch user saved comparisons (Requires JWT access token)
 */
export async function getSavedComparisons(token) {
  return request('/saved', {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
}

/**
 * Save a comparison (Requires JWT access token)
 * @param {Object} payload - { loanIds: string[], amount: number, tenureMonths: number }
 */
export async function saveComparison(payload, token) {
  return request('/saved', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(payload)
  });
}

/**
 * Delete a saved comparison by ID (Requires JWT access token)
 */
export async function deleteSavedComparison(id, token) {
  return request(`/saved/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
}

/**
 * Get AI explanation for comparison results (Prompt 10)
 * @param {Object} payload - { comparisons, bestValue, amount, tenureMonths }
 */
export async function explainComparison(payload) {
  return request('/explain', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}

/**
 * Multi-turn Gemini chatbot query
 * @param {Array} history - Previous messages [{ role: 'user' | 'model', content: string }]
 * @param {string} message - Current prompt
 */
export async function sendChatMessage(history, message, language = 'en') {
  return request('/chat', {
    method: 'POST',
    body: JSON.stringify({ history, message, language })
  });
}

/**
 * Translate financial text with Gemini NLP
 * @param {string} text - Source text
 * @param {string} targetLanguage - Language code (e.g. 'hi', 'ta', 'te')
 */
export async function translateText(text, targetLanguage) {
  return request('/translate', {
    method: 'POST',
    body: JSON.stringify({ text, targetLanguage })
  });
}

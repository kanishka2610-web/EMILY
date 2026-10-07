// server/controllers/loanController.js
const loanService = require('../services/loanService');

async function listLoans(req, res) {
  try {
    const { type, minRate, maxRate, sort, country, search } = req.query;
    const loans = await loanService.getLoans({ type, minRate, maxRate, sort, country, search });
    res.json(loans);
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message || 'Failed to fetch loans' });
  }
}

async function getLoan(req, res) {
  try {
    const { id } = req.params;
    const loan = await loanService.getLoanById(id);
    if (!loan) {
      return res.status(404).json({ error: 'Loan not found' });
    }
    res.json(loan);
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message || 'Failed to fetch loan details' });
  }
}

async function compare(req, res) {
  try {
    const { loanIds, amount, tenureMonths } = req.body;
    if (!loanIds || !amount || !tenureMonths) {
      return res.status(400).json({ error: 'loanIds, amount, and tenureMonths are required in request body' });
    }

    const comparisonResult = await loanService.compareLoans(loanIds, amount, tenureMonths);
    res.json(comparisonResult);
  } catch (err) {
    res.status(err.status || 400).json({ error: err.message || 'Comparison failed' });
  }
}

async function syncRates(req, res) {
  try {
    const syncResult = loanService.syncLiveBankRates();
    res.json(syncResult);
  } catch (err) {
    res.status(500).json({ error: 'Failed to sync rates: ' + err.message });
  }
}

async function getSyncStatus(req, res) {
  try {
    res.json(loanService.getSyncInfo());
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve sync status' });
  }
}

module.exports = {
  listLoans,
  getLoan,
  compare,
  syncRates,
  getSyncStatus
};

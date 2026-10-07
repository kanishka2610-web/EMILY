// server/controllers/savedController.js
const savedService = require('../services/savedService');

async function listSaved(req, res) {
  try {
    const data = await savedService.getSaved(req.user, req.token);
    res.json(data);
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message || 'Failed to retrieve saved comparisons' });
  }
}

async function createSaved(req, res) {
  try {
    const { loanIds, amount, tenureMonths } = req.body;
    if (!loanIds || !amount || !tenureMonths) {
      return res.status(400).json({ error: 'loanIds, amount, and tenureMonths are required' });
    }

    const saved = await savedService.createSaved(req.user, { loanIds, amount, tenureMonths }, req.token);
    res.status(201).json(saved);
  } catch (err) {
    res.status(err.status || 400).json({ error: err.message || 'Failed to save comparison' });
  }
}

async function deleteSaved(req, res) {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: 'Comparison ID is required' });
    }

    await savedService.deleteSaved(req.user, id, req.token);
    res.json({ message: 'Saved comparison deleted successfully' });
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message || 'Failed to delete saved comparison' });
  }
}

module.exports = {
  listSaved,
  createSaved,
  deleteSaved
};

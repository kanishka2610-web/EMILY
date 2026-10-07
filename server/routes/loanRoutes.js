// server/routes/loanRoutes.js
const express = require('express');
const router = express.Router();
const loanController = require('../controllers/loanController');

router.get('/', loanController.listLoans);
router.post('/sync', loanController.syncRates);
router.get('/sync-status', loanController.getSyncStatus);
router.get('/:id', loanController.getLoan);

module.exports = router;

// server/routes/compareRoutes.js
const express = require('express');
const router = express.Router();
const loanController = require('../controllers/loanController');

router.post('/', loanController.compare);

module.exports = router;

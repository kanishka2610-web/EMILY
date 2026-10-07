// server/routes/explainRoutes.js
const express = require('express');
const router = express.Router();
const explainController = require('../controllers/explainController');

router.post('/', explainController.explainComparison);

module.exports = router;

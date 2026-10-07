// server/routes/translateRoutes.js
const express = require('express');
const router = express.Router();
const translateController = require('../controllers/translateController');

router.post('/', translateController.handleTranslate);

module.exports = router;

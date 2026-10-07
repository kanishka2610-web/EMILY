// server/routes/savedRoutes.js
const express = require('express');
const router = express.Router();
const savedController = require('../controllers/savedController');
const { authenticateToken } = require('../middleware/auth');

// All saved comparisons endpoints require authentication
router.use(authenticateToken);

router.get('/', savedController.listSaved);
router.post('/', savedController.createSaved);
router.delete('/:id', savedController.deleteSaved);

module.exports = router;

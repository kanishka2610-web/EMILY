// server/index.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const loanRoutes = require('./routes/loanRoutes');
const compareRoutes = require('./routes/compareRoutes');
const savedRoutes = require('./routes/savedRoutes');
const explainRoutes = require('./routes/explainRoutes');
const chatRoutes = require('./routes/chatRoutes');
const translateRoutes = require('./routes/translateRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/loans', loanRoutes);
app.use('/api/compare', compareRoutes);
app.use('/api/saved', savedRoutes);
app.use('/api/explain', explainRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/translate', translateRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'emily-loan-comparison' });
});

// Fallback for unmatched API routes
app.use('/api', (req, res) => {
  res.status(404).json({ error: 'API route not found' });
});

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  const status = err.status || 500;
  const message = err.message || 'Internal server error';
  res.status(status).json({ error: message });
});

const PORT = process.env.PORT || 5000;

if (require.main === module) {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Loan Comparison Server listening on port ${PORT}`);
  });
}

module.exports = app;

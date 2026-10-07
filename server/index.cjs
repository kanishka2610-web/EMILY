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

app.use(cors());
app.use(express.json());

app.use('/api/loans', loanRoutes);
app.use('/api/compare', compareRoutes);
app.use('/api/saved', savedRoutes);
app.use('/api/explain', explainRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/translate', translateRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'emily-loan-comparison' });
});

app.use('/api', (req, res) => {
  res.status(404).json({ error: 'API route not found' });
});

app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  const status = err.status || 500;
  const message = err.message || 'Internal server error';
  res.status(status).json({ error: message });
});

module.exports = app;

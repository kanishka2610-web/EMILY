// client/src/main.jsx
import React from 'react';
import { createRoot } from 'react-dom/client';
import './i18n.js';
import App from './App.jsx';
import './styles/global.css';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// client/src/App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CurrencyProvider } from './context/CurrencyContext';
import { LanguageProvider } from './context/LanguageContext';
import { Navbar } from './components/Navbar';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Home } from './pages/Home';
import { Compare } from './pages/Compare';
import { EmiCalculatorPage } from './pages/EmiCalculatorPage';
import { AiAdvisorPage } from './pages/AiAdvisorPage';
import { Saved } from './pages/Saved';
import { Login } from './pages/Login';
import './styles/global.css';

export function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <CurrencyProvider>
          <BrowserRouter>
            <div className="app-container">
              <Navbar />
              <main className="main-content">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/calculator" element={<EmiCalculatorPage />} />
                  <Route path="/compare" element={<Compare />} />
                  <Route path="/advisor" element={<AiAdvisorPage />} />
                  <Route
                    path="/saved"
                    element={
                      <ProtectedRoute>
                        <Saved />
                      </ProtectedRoute>
                    }
                  />
                  <Route path="/login" element={<Login />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </main>
            </div>
          </BrowserRouter>
        </CurrencyProvider>
      </LanguageProvider>
    </AuthProvider>
  );
}

export default App;

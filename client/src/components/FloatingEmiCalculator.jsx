// client/src/components/FloatingEmiCalculator.jsx
import React, { useState } from 'react';
import { calculateEmi } from '../utils/loanCalculator';
import { useCurrency } from '../context/CurrencyContext';
import './FloatingEmiCalculator.css';

export function FloatingEmiCalculator() {
  const { currency, formatMoney } = useCurrency();
  const [isOpen, setIsOpen] = useState(false);

  const isIndia = currency === 'INR';

  // State
  const [amount, setAmount] = useState(isIndia ? 2500000 : 200000);
  const [rate, setRate] = useState(8.5);
  const [tenureYears, setTenureYears] = useState(20);
  const [tenureUnit, setTenureUnit] = useState('years'); // 'years' | 'months'
  const [activePreset, setActivePreset] = useState('home');

  const tenureInMonths = tenureUnit === 'years' ? tenureYears * 12 : tenureYears;

  // Real-time calculation
  const emi = calculateEmi(amount, rate, tenureInMonths);
  const totalPayment = emi * tenureInMonths;
  const totalInterest = Math.max(0, totalPayment - amount);

  // Discrete percentage tier for visual bar without inline styles
  const principalPercent = totalPayment > 0 ? (amount / totalPayment) * 100 : 50;
  const interestPercent = 100 - principalPercent;

  const getTierClass = (percent, prefix) => {
    const rounded = Math.round(percent / 10) * 10;
    const clamped = Math.min(100, Math.max(10, rounded));
    return `${prefix}-tier-${clamped}`;
  };

  const handleApplyPreset = (type) => {
    setActivePreset(type);
    if (type === 'home') {
      setAmount(isIndia ? 3000000 : 250000);
      setRate(isIndia ? 8.5 : 6.5);
      setTenureYears(20);
      setTenureUnit('years');
    } else if (type === 'car') {
      setAmount(isIndia ? 1000000 : 35000);
      setRate(isIndia ? 8.75 : 5.75);
      setTenureYears(5);
      setTenureUnit('years');
    } else if (type === 'personal') {
      setAmount(isIndia ? 500000 : 15000);
      setRate(isIndia ? 10.5 : 9.5);
      setTenureYears(3);
      setTenureUnit('years');
    }
  };

  const handleReset = () => {
    handleApplyPreset('home');
  };

  const minAmt = isIndia ? 50000 : 2000;
  const maxAmt = isIndia ? 20000000 : 1500000;
  const stepAmt = isIndia ? 25000 : 1000;

  return (
    <>
      {/* Floating launcher trigger button */}
      {!isOpen && (
        <button
          type="button"
          className="floating-calc-launcher"
          onClick={() => setIsOpen(true)}
          aria-label="Open Standalone EMI Calculator"
        >
          <span className="launcher-icon">📐</span>
          <span>Quick EMI Calc</span>
        </button>
      )}

      {/* Floating Calculator Window */}
      {isOpen && (
        <div className="floating-calc-window">
          <div className="floating-calc-header">
            <div className="header-title-wrap">
              <h3>Standalone EMI Calculator</h3>
              <span>Instant payment estimation</span>
            </div>
            <button
              type="button"
              className="btn-calc-close"
              onClick={() => setIsOpen(false)}
              aria-label="Close EMI calculator"
            >
              ×
            </button>
          </div>

          <div className="floating-calc-body">
            {/* Quick Loan Presets */}
            <div className="calc-presets-row">
              <button
                type="button"
                className={`btn-preset-chip ${activePreset === 'home' ? 'active' : ''}`}
                onClick={() => handleApplyPreset('home')}
              >
                🏠 Home Loan
              </button>
              <button
                type="button"
                className={`btn-preset-chip ${activePreset === 'car' ? 'active' : ''}`}
                onClick={() => handleApplyPreset('car')}
              >
                🚗 Car Loan
              </button>
              <button
                type="button"
                className={`btn-preset-chip ${activePreset === 'personal' ? 'active' : ''}`}
                onClick={() => handleApplyPreset('personal')}
              >
                💼 Personal Loan
              </button>
            </div>

            {/* Controls */}
            <div className="calc-input-section">
              {/* Loan Amount */}
              <div className="calc-control-group">
                <div className="calc-label-row">
                  <span className="calc-label-text">Loan Amount</span>
                  <span className="calc-value-badge">{formatMoney(amount)}</span>
                </div>
                <input
                  type="range"
                  min={minAmt}
                  max={maxAmt}
                  step={stepAmt}
                  value={amount}
                  onChange={(e) => {
                    setAmount(Number(e.target.value));
                    setActivePreset('');
                  }}
                  className="calc-slider-input"
                  aria-label="Loan amount slider"
                />
                <input
                  type="number"
                  min={minAmt}
                  max={maxAmt}
                  step={stepAmt}
                  value={amount}
                  onChange={(e) => {
                    setAmount(Number(e.target.value));
                    setActivePreset('');
                  }}
                  className="calc-number-input"
                />
              </div>

              {/* Interest Rate */}
              <div className="calc-control-group">
                <div className="calc-label-row">
                  <span className="calc-label-text">Interest Rate (% p.a.)</span>
                  <span className="calc-value-badge">{rate}%</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={25}
                  step={0.1}
                  value={rate}
                  onChange={(e) => {
                    setRate(Number(e.target.value));
                    setActivePreset('');
                  }}
                  className="calc-slider-input"
                  aria-label="Interest rate slider"
                />
                <input
                  type="number"
                  min={1}
                  max={25}
                  step={0.1}
                  value={rate}
                  onChange={(e) => {
                    setRate(Number(e.target.value));
                    setActivePreset('');
                  }}
                  className="calc-number-input"
                />
              </div>

              {/* Tenure */}
              <div className="calc-control-group">
                <div className="calc-label-row">
                  <span className="calc-label-text">Repayment Period</span>
                  <div className="tenure-unit-toggle">
                    <button
                      type="button"
                      className={`btn-unit-opt ${tenureUnit === 'years' ? 'active' : ''}`}
                      onClick={() => setTenureUnit('years')}
                    >
                      Years
                    </button>
                    <button
                      type="button"
                      className={`btn-unit-opt ${tenureUnit === 'months' ? 'active' : ''}`}
                      onClick={() => setTenureUnit('months')}
                    >
                      Months
                    </button>
                  </div>
                </div>
                <input
                  type="range"
                  min={1}
                  max={tenureUnit === 'years' ? 30 : 360}
                  step={1}
                  value={tenureYears}
                  onChange={(e) => {
                    setTenureYears(Number(e.target.value));
                    setActivePreset('');
                  }}
                  className="calc-slider-input"
                  aria-label="Tenure slider"
                />
                <input
                  type="number"
                  min={1}
                  max={tenureUnit === 'years' ? 30 : 360}
                  step={1}
                  value={tenureYears}
                  onChange={(e) => {
                    setTenureYears(Number(e.target.value));
                    setActivePreset('');
                  }}
                  className="calc-number-input"
                />
              </div>
            </div>

            {/* Results Output */}
            <div className="calc-result-card">
              <div className="emi-main-block">
                <span className="emi-main-label">Estimated Monthly EMI</span>
                <span className="emi-main-figure">{formatMoney(emi)}</span>
              </div>

              <div className="calc-breakdown-row">
                <div className="breakdown-item">
                  <span className="breakdown-label">Principal Amount</span>
                  <span className="breakdown-val">{formatMoney(amount)}</span>
                </div>
                <div className="breakdown-item">
                  <span className="breakdown-label">Total Interest</span>
                  <span className="breakdown-val">{formatMoney(totalInterest)}</span>
                </div>
                <div className="breakdown-item">
                  <span className="breakdown-label">Total Payable</span>
                  <span className="breakdown-val">{formatMoney(totalPayment)}</span>
                </div>
              </div>

              {/* Proportion Bar */}
              <div className="calc-proportion-wrap">
                <div className="calc-proportion-labels">
                  <span>Principal: {principalPercent.toFixed(0)}%</span>
                  <span>Interest: {interestPercent.toFixed(0)}%</span>
                </div>
                <div className="calc-proportion-track">
                  <div className={`proportion-principal ${getTierClass(principalPercent, 'p')}`} />
                  <div className={`proportion-interest ${getTierClass(interestPercent, 'i')}`} />
                </div>
              </div>
            </div>

            <div className="calc-footer-row">
              <button
                type="button"
                className="btn-calc-reset"
                onClick={handleReset}
              >
                Reset to Defaults
              </button>
              <button
                type="button"
                className="btn-calc-reset"
                onClick={() => setIsOpen(false)}
              >
                Minimize Widget
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default FloatingEmiCalculator;

// client/src/pages/EmiCalculatorPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { calculateEmi } from '../utils/loanCalculator';
import { useCurrency } from '../context/CurrencyContext';
import { useTranslation } from 'react-i18next';
import './EmiCalculatorPage.css';

export function EmiCalculatorPage() {
  const { currency, formatMoney } = useCurrency();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const isIndia = currency === 'INR';

  // Calculator inputs
  const [amount, setAmount] = useState(isIndia ? 3000000 : 250000);
  const [rate, setRate] = useState(8.5);
  const [tenureYears, setTenureYears] = useState(20);
  const [tenureUnit, setTenureUnit] = useState('years'); // 'years' | 'months'
  const [activePreset, setActivePreset] = useState('home');

  const tenureInMonths = tenureUnit === 'years' ? tenureYears * 12 : tenureYears;

  // Real-time calculation
  const emi = calculateEmi(amount, rate, tenureInMonths);
  const totalPayment = emi * tenureInMonths;
  const totalInterest = Math.max(0, totalPayment - amount);

  // Proportion calculation
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
      setAmount(isIndia ? 3500000 : 300000);
      setRate(isIndia ? 8.5 : 6.5);
      setTenureYears(20);
      setTenureUnit('years');
    } else if (type === 'car') {
      setAmount(isIndia ? 1200000 : 40000);
      setRate(isIndia ? 8.75 : 5.85);
      setTenureYears(5);
      setTenureUnit('years');
    } else if (type === 'personal') {
      setAmount(isIndia ? 500000 : 20000);
      setRate(isIndia ? 10.5 : 9.75);
      setTenureYears(3);
      setTenureUnit('years');
    } else if (type === 'education') {
      setAmount(isIndia ? 1500000 : 60000);
      setRate(isIndia ? 8.25 : 5.25);
      setTenureYears(10);
      setTenureUnit('years');
    }
  };

  const handleCompareOffers = () => {
    navigate(`/?type=${activePreset || ''}&amount=${amount}`);
  };

  const minAmt = isIndia ? 50000 : 2000;
  const maxAmt = isIndia ? 25000000 : 2000000;
  const stepAmt = isIndia ? 25000 : 1000;

  return (
    <div className="emi-calc-page">
      <section className="calc-hero">
        <h1>{t('emiCalculator')}</h1>
        <p>
          Accurately calculate monthly installments, total interest costs, and repayment timelines across customizable loan amounts and tenures.
        </p>
      </section>

      <div className="calc-main-grid">
        {/* Controls Card */}
        <section className="calc-inputs-card">
          <div className="calc-presets-bar">
            <button
              type="button"
              className={`preset-btn ${activePreset === 'home' ? 'active' : ''}`}
              onClick={() => handleApplyPreset('home')}
            >
              🏠 Home Loan
            </button>
            <button
              type="button"
              className={`preset-btn ${activePreset === 'car' ? 'active' : ''}`}
              onClick={() => handleApplyPreset('car')}
            >
              🚗 Car Loan
            </button>
            <button
              type="button"
              className={`preset-btn ${activePreset === 'personal' ? 'active' : ''}`}
              onClick={() => handleApplyPreset('personal')}
            >
              💼 Personal Loan
            </button>
            <button
              type="button"
              className={`preset-btn ${activePreset === 'education' ? 'active' : ''}`}
              onClick={() => handleApplyPreset('education')}
            >
              🎓 Education Loan
            </button>
          </div>

          {/* Amount input */}
          <div className="calc-form-group">
            <div className="calc-field-header">
              <span className="calc-field-label">Loan Amount Required</span>
              <span className="calc-field-value">{formatMoney(amount)}</span>
            </div>
            <div className="calc-dual-controls">
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
                className="calc-slider"
                aria-label="Loan Amount Range"
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
                className="calc-num-input"
              />
            </div>
          </div>

          {/* Rate input */}
          <div className="calc-form-group">
            <div className="calc-field-header">
              <span className="calc-field-label">Interest Rate (% p.a.)</span>
              <span className="calc-field-value">{rate}%</span>
            </div>
            <div className="calc-dual-controls">
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
                className="calc-slider"
                aria-label="Interest Rate Range"
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
                className="calc-num-input"
              />
            </div>
          </div>

          {/* Tenure input */}
          <div className="calc-form-group">
            <div className="calc-field-header">
              <span className="calc-field-label">Repayment Tenure</span>
              <div className="tenure-unit-switch">
                <button
                  type="button"
                  className={`unit-switch-btn ${tenureUnit === 'years' ? 'active' : ''}`}
                  onClick={() => setTenureUnit('years')}
                >
                  Years
                </button>
                <button
                  type="button"
                  className={`unit-switch-btn ${tenureUnit === 'months' ? 'active' : ''}`}
                  onClick={() => setTenureUnit('months')}
                >
                  Months
                </button>
              </div>
            </div>
            <div className="calc-dual-controls">
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
                className="calc-slider"
                aria-label="Tenure Range"
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
                className="calc-num-input"
              />
            </div>
          </div>
        </section>

        {/* Results Card */}
        <section className="calc-results-card">
          <div className="hero-emi-display">
            <span className="hero-emi-label">Estimated Monthly EMI</span>
            <span className="hero-emi-amount">{formatMoney(emi)}</span>
          </div>

          <div className="results-breakdown-list">
            <div className="breakdown-row">
              <span className="breakdown-row-label">Principal Amount:</span>
              <span className="breakdown-row-val">{formatMoney(amount)}</span>
            </div>
            <div className="breakdown-row">
              <span className="breakdown-row-label">Total Interest:</span>
              <span className="breakdown-row-val">{formatMoney(totalInterest)}</span>
            </div>
            <div className="breakdown-row">
              <span className="breakdown-row-label">Total Amount Payable:</span>
              <span className="breakdown-row-val">{formatMoney(totalPayment)}</span>
            </div>
          </div>

          {/* Visual proportion */}
          <div className="proportion-meter">
            <div className="meter-labels">
              <span>Principal: {principalPercent.toFixed(0)}%</span>
              <span>Interest: {interestPercent.toFixed(0)}%</span>
            </div>
            <div className="meter-track">
              <div className={`meter-principal ${getTierClass(principalPercent, 'p')}`} />
              <div className={`meter-interest ${getTierClass(interestPercent, 'i')}`} />
            </div>
          </div>

          <div className="calc-action-block">
            <button
              type="button"
              className="btn-compare-matching"
              onClick={handleCompareOffers}
            >
              Browse Matching Bank Offers ({formatMoney(amount)})
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}

export default EmiCalculatorPage;

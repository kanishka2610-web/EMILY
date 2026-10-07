// client/src/components/PrepaymentSimulator.jsx
import React, { useState } from 'react';
import { simulatePrepayment } from '../utils/loanCalculator';
import './PrepaymentSimulator.css';

export function PrepaymentSimulator({ principal, annualRate, tenureMonths, currency = 'USD' }) {
  const [extraPayment, setExtraPayment] = useState('');

  const isIndia = currency === 'INR';
  const symbol = isIndia ? '₹' : '$';

  const extraNumber = Number(extraPayment) || 0;
  const result = simulatePrepayment(principal, annualRate, tenureMonths, extraNumber);

  const formatAmount = (val) => {
    const num = Number(val);
    if (isIndia) return symbol + num.toLocaleString('en-IN');
    return symbol + num.toLocaleString('en-US');
  };

  return (
    <div className="prepayment-simulator">
      <h4 className="simulator-title">Prepayment & Accelerated Payoff Simulator</h4>
      <p className="simulator-subtitle">
        Calculate how much interest and tenure you save by paying extra each month.
      </p>

      <div className="simulator-input-row">
        <label htmlFor="extra-payment-input">Extra Monthly Payment ({symbol}):</label>
        <input
          id="extra-payment-input"
          type="number"
          min="0"
          step="500"
          placeholder={isIndia ? 'e.g. 5000' : 'e.g. 100'}
          className="simulator-input"
          value={extraPayment}
          onChange={(e) => setExtraPayment(e.target.value)}
        />
      </div>

      <div className="simulation-results-grid">
        <div className="sim-result-card">
          <span className="sim-result-label">New Tenure</span>
          <span className="sim-result-value">
            {result.newTenureMonths} mos
          </span>
        </div>

        <div className="sim-result-card highlight">
          <span className="sim-result-label">Months Saved</span>
          <span className="sim-result-value">
            {result.monthsSaved} mos
          </span>
        </div>

        <div className="sim-result-card highlight">
          <span className="sim-result-label">Interest Saved</span>
          <span className="sim-result-value">
            {formatAmount(result.interestSaved)}
          </span>
        </div>
      </div>
    </div>
  );
}

export default PrepaymentSimulator;

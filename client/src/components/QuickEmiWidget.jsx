// client/src/components/QuickEmiWidget.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { calculateEmi } from '../utils/loanCalculator';
import { useCurrency } from '../context/CurrencyContext';
import { useLanguage } from '../context/LanguageContext';
import './QuickEmiWidget.css';

export function QuickEmiWidget({ onOpenEligibility }) {
  const { currency, formatMoney } = useCurrency();
  const { t } = useLanguage();

  const isIndia = currency === 'INR';

  // Slider defaults
  const [amount, setAmount] = useState(isIndia ? 3000000 : 250000);
  const [tenureYears, setTenureYears] = useState(20);
  const benchmarkRate = isIndia ? 8.5 : 6.5;

  const minAmt = isIndia ? 100000 : 10000;
  const maxAmt = isIndia ? 15000000 : 1000000;
  const stepAmt = isIndia ? 50000 : 5000;

  const tenureMonths = tenureYears * 12;
  const emi = calculateEmi(amount, benchmarkRate, tenureMonths);
  const totalPayment = emi * tenureMonths;
  const totalInterest = totalPayment - amount;

  return (
    <div className="quick-emi-widget">
      <div className="widget-sliders-col">
        <div className="slider-group">
          <div className="slider-header-row">
            <span className="slider-label">Loan Required</span>
            <span className="slider-value-display">{formatMoney(amount)}</span>
          </div>
          <input
            type="range"
            min={minAmt}
            max={maxAmt}
            step={stepAmt}
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="emi-slider-input"
            aria-label="Loan Amount Slider"
          />
          <div className="slider-range-hints">
            <span>{formatMoney(minAmt)}</span>
            <span>{formatMoney(maxAmt)}</span>
          </div>
        </div>

        <div className="slider-group">
          <div className="slider-header-row">
            <span className="slider-label">Repayment Tenure</span>
            <span className="slider-value-display">
              {tenureYears} Years ({tenureMonths} mos)
            </span>
          </div>
          <input
            type="range"
            min={1}
            max={30}
            step={1}
            value={tenureYears}
            onChange={(e) => setTenureYears(Number(e.target.value))}
            className="emi-slider-input"
            aria-label="Tenure Slider"
          />
          <div className="slider-range-hints">
            <span>1 Year</span>
            <span>30 Years</span>
          </div>
        </div>
      </div>

      <div className="widget-output-col">
        <div className="output-emi-section">
          <span className="output-label">Benchmark Monthly EMI ({benchmarkRate}%)</span>
          <span className="output-emi-value">{formatMoney(emi)}</span>
        </div>

        <div className="output-metrics-row">
          <div className="metric-mini-group">
            <span className="mini-label">Total Interest</span>
            <span className="mini-value">{formatMoney(totalInterest)}</span>
          </div>
          <div className="metric-mini-group">
            <span className="mini-label">Total Payable</span>
            <span className="mini-value">{formatMoney(totalPayment)}</span>
          </div>
        </div>

        <div className="widget-actions-row">
          <button
            type="button"
            className="btn-open-eligibility"
            onClick={onOpenEligibility}
          >
            Check Eligibility & FOIR
          </button>
          <Link
            to="/calculator"
            className="btn-open-eligibility"
          >
            Full EMI Calculator →
          </Link>
        </div>
      </div>
    </div>
  );
}

export default QuickEmiWidget;

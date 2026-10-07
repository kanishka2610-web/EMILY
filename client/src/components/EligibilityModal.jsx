// client/src/components/EligibilityModal.jsx
import React, { useState } from 'react';
import { calculateEligibility } from '../utils/eligibilityCalculator';
import { useCurrency } from '../context/CurrencyContext';
import { useLanguage } from '../context/LanguageContext';
import './EligibilityModal.css';

export function EligibilityModal({ onClose, onApplyAmount }) {
  const { currency, formatMoney } = useCurrency();
  const { t } = useLanguage();

  const isIndia = currency === 'INR';
  const defaultIncome = isIndia ? '80000' : '6500';
  const defaultExistingEmis = isIndia ? '12000' : '800';

  const [income, setIncome] = useState(defaultIncome);
  const [existingEmis, setExistingEmis] = useState(defaultExistingEmis);
  const [rate, setRate] = useState(isIndia ? '8.5' : '6.5');
  const [tenureYears, setTenureYears] = useState('20');

  const tenureMonths = Number(tenureYears) * 12;

  const result = calculateEligibility({
    monthlyIncome: income,
    existingEmis,
    interestRate: rate,
    tenureMonths,
    maxFoirPercent: 50
  });

  const getMeterClass = (status) => {
    switch (status) {
      case 'excellent': return 'fill-safe';
      case 'moderate': return 'fill-moderate';
      case 'stretched': return 'fill-stretched';
      default: return 'fill-safe';
    }
  };

  const handleApply = () => {
    if (result.maxEligiblePrincipal > 0 && onApplyAmount) {
      onApplyAmount(result.maxEligiblePrincipal);
    }
    onClose();
  };

  return (
    <div className="eligibility-overlay" onClick={onClose}>
      <div className="eligibility-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="eligibility-header">
          <div className="eligibility-header-title">
            <h3>Loan Eligibility & Affordability Calculator</h3>
            <p>
              Based on banking FOIR (Fixed Obligation to Income Ratio) and Debt-to-Income standards.
            </p>
          </div>
          <button
            type="button"
            className="eligibility-close-btn"
            onClick={onClose}
            aria-label="Close modal"
          >
            ×
          </button>
        </div>

        <div className="eligibility-body">
          <div className="eligibility-form-grid">
            <div className="eligibility-input-group">
              <label htmlFor="modal-income-input">Net Monthly Income ({currency === 'INR' ? '₹' : '$'})</label>
              <input
                id="modal-income-input"
                type="number"
                min="1000"
                step="1000"
                className="eligibility-input"
                value={income}
                onChange={(e) => setIncome(e.target.value)}
              />
            </div>

            <div className="eligibility-input-group">
              <label htmlFor="modal-obligations-input">Existing Monthly EMIs ({currency === 'INR' ? '₹' : '$'})</label>
              <input
                id="modal-obligations-input"
                type="number"
                min="0"
                step="500"
                className="eligibility-input"
                value={existingEmis}
                onChange={(e) => setExistingEmis(e.target.value)}
              />
            </div>

            <div className="eligibility-input-group">
              <label htmlFor="modal-rate-input">Expected Rate (%)</label>
              <input
                id="modal-rate-input"
                type="number"
                step="0.1"
                min="1"
                className="eligibility-input"
                value={rate}
                onChange={(e) => setRate(e.target.value)}
              />
            </div>

            <div className="eligibility-input-group">
              <label htmlFor="modal-tenure-input">Tenure (Years)</label>
              <input
                id="modal-tenure-input"
                type="number"
                min="1"
                max="30"
                step="1"
                className="eligibility-input"
                value={tenureYears}
                onChange={(e) => setTenureYears(e.target.value)}
              />
            </div>
          </div>

          <div className="eligibility-results-card">
            <div className="results-stats-grid">
              <div className="stat-box highlight">
                <span className="stat-box-label">Max Eligible Loan</span>
                <span className="stat-box-value">
                  {formatMoney(result.maxEligiblePrincipal)}
                </span>
              </div>

              <div className="stat-box">
                <span className="stat-box-label">Max Available EMI</span>
                <span className="stat-box-value">
                  {formatMoney(result.maxNewLoanEmi)}/mo
                </span>
              </div>

              <div className="stat-box">
                <span className="stat-box-label">Current FOIR / DTI</span>
                <span className="stat-box-value">
                  {result.currentFoirPercent}%
                </span>
              </div>
            </div>

            <div className="foir-meter-container">
              <div className="foir-meter-labels">
                <span>Debt Capacity Health</span>
                <span>
                  {result.healthStatus === 'excellent' && '🟢 Safe (<30%)'}
                  {result.healthStatus === 'moderate' && '🟡 Moderate (30%-45%)'}
                  {result.healthStatus === 'stretched' && '🔴 Stretched (>45%)'}
                </span>
              </div>
              <div className="foir-meter-bar-track">
                <div className={`foir-meter-fill ${getMeterClass(result.healthStatus)}`} />
              </div>
            </div>
          </div>

          <div className="eligibility-actions">
            <button
              type="button"
              className="btn-secondary"
              onClick={onClose}
            >
              Close
            </button>
            <button
              type="button"
              className="btn-primary"
              onClick={handleApply}
              disabled={result.maxEligiblePrincipal <= 0}
            >
              Filter Catalog for {formatMoney(result.maxEligiblePrincipal)}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EligibilityModal;

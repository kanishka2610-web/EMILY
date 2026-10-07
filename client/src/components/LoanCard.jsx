// client/src/components/LoanCard.jsx
import React from 'react';
import './LoanCard.css';

export function LoanCard({ loan, isSelected, onToggleSelect }) {
  const isIndia = loan.country === 'IN' || loan.currency === 'INR';
  const currencySymbol = isIndia ? '₹' : '$';

  const formatCurrency = (val) => {
    if (val == null) return 'N/A';
    const num = Number(val);
    if (isIndia) {
      if (num >= 10000000) return `${currencySymbol}${(num / 10000000).toFixed(2)} Cr`;
      if (num >= 100000) return `${currencySymbol}${(num / 100000).toFixed(1)} Lakh`;
      return `${currencySymbol}${num.toLocaleString('en-IN')}`;
    }
    return `${currencySymbol}${num.toLocaleString('en-US')}`;
  };

  const formatFee = () => {
    const pct = Number(loan.processing_fee_percent || 0);
    const flat = Number(loan.flat_fee || 0);

    if (pct === 0 && flat === 0) return 'Free (0%)';
    if (pct > 0 && flat > 0) return `${pct}% + ${currencySymbol}${flat.toLocaleString()}`;
    if (pct > 0) return `${pct}%`;
    return `${currencySymbol}${flat.toLocaleString()}`;
  };

  const getBadgeClass = (type) => {
    switch (type) {
      case 'home': return 'badge-home';
      case 'personal': return 'badge-personal';
      case 'car': return 'badge-car';
      case 'education': return 'badge-education';
      default: return '';
    }
  };

  return (
    <div
      className={`loan-card ${isSelected ? 'selected' : ''}`}
      onClick={() => onToggleSelect(loan.id)}
    >
      <div className="card-top">
        <div className="card-bank-info">
          <h3 className="card-bank-name">{loan.bank_name}</h3>
          <div>
            <span className={`card-type-badge ${getBadgeClass(loan.loan_type)}`}>
              {loan.loan_type} loan
            </span>
            <span className={`country-flag-badge ${isIndia ? 'badge-country-in' : 'badge-country-us'}`}>
              {isIndia ? '🇮🇳 India' : '🇺🇸 Global'}
            </span>
          </div>
        </div>

        <label
          className="card-checkbox-label"
          onClick={(e) => e.stopPropagation()}
        >
          <input
            type="checkbox"
            className="card-checkbox"
            checked={isSelected}
            onChange={() => onToggleSelect(loan.id)}
            aria-label={`Select ${loan.bank_name} for comparison`}
          />
        </label>
      </div>

      <div className="card-rate-section">
        <span className="rate-label">Benchmark Rate</span>
        <div>
          <span className="rate-value">{loan.interest_rate}%</span>
          <span className="rate-unit">p.a.</span>
        </div>
      </div>

      <div className="card-details-grid">
        <div className="detail-item">
          <span className="detail-label">Tenure Range</span>
          <span className="detail-value">
            {loan.min_tenure_months} - {loan.max_tenure_months} mos
          </span>
        </div>

        <div className="detail-item">
          <span className="detail-label">Amount Range</span>
          <span className="detail-value">
            {formatCurrency(loan.min_amount)} - {formatCurrency(loan.max_amount)}
          </span>
        </div>

        <div className="detail-item">
          <span className="detail-label">Processing Fee</span>
          <span className="detail-value">{formatFee()}</span>
        </div>

        <div className="detail-item">
          <span className="detail-label">Prepayment Penalty</span>
          <span className="detail-value">
            {loan.prepayment_penalty_percent > 0 ? `${loan.prepayment_penalty_percent}%` : '0% (Nil)'}
          </span>
        </div>
      </div>
    </div>
  );
}

export default LoanCard;

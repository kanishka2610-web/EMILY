// client/src/components/ComparisonTable.jsx
import React from 'react';
import './ComparisonTable.css';

export function ComparisonTable({ comparisons, onSelectSchedule }) {
  if (!comparisons || comparisons.length === 0) return null;

  // Determine best values for each row (minimum is best for all cost metrics)
  const minRate = Math.min(...comparisons.map((c) => Number(c.loan.interest_rate)));
  const minEmi = Math.min(...comparisons.map((c) => c.monthlyEmi));
  const minInterest = Math.min(...comparisons.map((c) => c.totalInterest));
  const minFee = Math.min(...comparisons.map((c) => c.totalFees));
  const minCost = Math.min(...comparisons.map((c) => c.totalCost));
  const minEffectivePct = Math.min(...comparisons.map((c) => c.effectiveCostPercent));

  const formatCurrency = (val, loan) => {
    const isIndia = loan?.country === 'IN' || loan?.currency === 'INR';
    const symbol = isIndia ? '₹' : '$';
    const num = Number(val);
    if (isIndia) {
      return symbol + num.toLocaleString('en-IN');
    }
    return symbol + num.toLocaleString('en-US');
  };

  return (
    <div className="comparison-table-wrapper">
      <table className="comparison-table">
        <thead>
          <tr>
            <th className="metric-label-cell">Feature / Metric</th>
            {comparisons.map((item) => {
              const isIndia = item.loan.country === 'IN' || item.loan.currency === 'INR';
              return (
                <th key={item.loan.id} className="metric-col-cell table-header-bank">
                  <div className="bank-header-content">
                    <span>{item.loan.bank_name}</span>
                    <span className="bank-header-type">
                      {isIndia ? '🇮🇳 ' : '🇺🇸 '}
                      {item.loan.loan_type} loan
                    </span>
                  </div>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {/* Row: Interest Rate */}
          <tr>
            <td className="metric-label-cell">Interest Rate</td>
            {comparisons.map((item) => {
              const isBest = Number(item.loan.interest_rate) === minRate;
              return (
                <td
                  key={item.loan.id}
                  className={`metric-col-cell ${isBest ? 'best-value' : ''}`}
                >
                  {item.loan.interest_rate}% p.a.
                  {isBest && <span className="best-badge">Lowest</span>}
                </td>
              );
            })}
          </tr>

          {/* Row: Monthly EMI */}
          <tr>
            <td className="metric-label-cell">Monthly EMI</td>
            {comparisons.map((item) => {
              const isBest = item.monthlyEmi === minEmi;
              return (
                <td
                  key={item.loan.id}
                  className={`metric-col-cell ${isBest ? 'best-value' : ''}`}
                >
                  {formatCurrency(item.monthlyEmi, item.loan)}
                  {isBest && <span className="best-badge">Lowest</span>}
                </td>
              );
            })}
          </tr>

          {/* Row: Total Interest */}
          <tr>
            <td className="metric-label-cell">Total Interest</td>
            {comparisons.map((item) => {
              const isBest = item.totalInterest === minInterest;
              return (
                <td
                  key={item.loan.id}
                  className={`metric-col-cell ${isBest ? 'best-value' : ''}`}
                >
                  {formatCurrency(item.totalInterest, item.loan)}
                  {isBest && <span className="best-badge">Lowest</span>}
                </td>
              );
            })}
          </tr>

          {/* Row: Processing Fee */}
          <tr>
            <td className="metric-label-cell">Processing Fee</td>
            {comparisons.map((item) => {
              const isBest = item.totalFees === minFee;
              return (
                <td
                  key={item.loan.id}
                  className={`metric-col-cell ${isBest ? 'best-value' : ''}`}
                >
                  {formatCurrency(item.totalFees, item.loan)}
                  {isBest && <span className="best-badge">Lowest</span>}
                </td>
              );
            })}
          </tr>

          {/* Row: Total Cost */}
          <tr>
            <td className="metric-label-cell">Total Cost (Payments + Fees)</td>
            {comparisons.map((item) => {
              const isBest = item.totalCost === minCost;
              return (
                <td
                  key={item.loan.id}
                  className={`metric-col-cell ${isBest ? 'best-value' : ''}`}
                >
                  {formatCurrency(item.totalCost, item.loan)}
                  {isBest && <span className="best-badge">Lowest</span>}
                </td>
              );
            })}
          </tr>

          {/* Row: Effective Cost % */}
          <tr>
            <td className="metric-label-cell">Effective Cost %</td>
            {comparisons.map((item) => {
              const isBest = item.effectiveCostPercent === minEffectivePct;
              return (
                <td
                  key={item.loan.id}
                  className={`metric-col-cell ${isBest ? 'best-value' : ''}`}
                >
                  {item.effectiveCostPercent}%
                  {isBest && <span className="best-badge">Lowest</span>}
                </td>
              );
            })}
          </tr>

          {/* Action Row: View Schedule button per loan column */}
          <tr>
            <td className="metric-label-cell">Amortization Schedule</td>
            {comparisons.map((item) => (
              <td key={item.loan.id} className="metric-col-cell">
                <button
                  type="button"
                  className="btn-schedule"
                  onClick={() => onSelectSchedule(item.loan)}
                >
                  View schedule
                </button>
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default ComparisonTable;

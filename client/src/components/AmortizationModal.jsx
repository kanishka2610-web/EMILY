// client/src/components/AmortizationModal.jsx
import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { generateSchedule } from '../utils/loanCalculator';
import { PrepaymentSimulator } from './PrepaymentSimulator';
import './AmortizationModal.css';

const PIE_COLORS = ['#3b82f6', '#f59e0b'];

export function AmortizationModal({ loan, amount, tenureMonths, onClose }) {
  if (!loan) return null;

  const isIndia = loan.country === 'IN' || loan.currency === 'INR';
  const symbol = isIndia ? '₹' : '$';

  const schedule = generateSchedule(amount, loan.interest_rate, tenureMonths);
  const totalPrincipal = Number(amount);
  const totalInterest = schedule.reduce((sum, item) => sum + item.interestPaid, 0);

  const pieData = [
    { name: 'Principal', value: totalPrincipal },
    { name: 'Total Interest', value: Number(totalInterest.toFixed(2)) }
  ];

  const formatAmount = (val) => {
    const num = Number(val);
    if (isIndia) return symbol + num.toLocaleString('en-IN');
    return symbol + num.toLocaleString('en-US');
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h3>{loan.bank_name} - Amortization Schedule</h3>
            <p>
              {formatAmount(amount)} @ {loan.interest_rate}% for {tenureMonths} months ({isIndia ? '🇮🇳 Indian Banking' : '🇺🇸 Global'})
            </p>
          </div>
          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close modal"
          >
            ×
          </button>
        </div>

        <div className="modal-body">
          {/* Pie Chart of Principal vs Interest */}
          <div className="chart-section">
            <div className="pie-chart-wrapper">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={75}
                    paddingAngle={3}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [formatAmount(value), '']} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="pie-legend-details">
              <div className="legend-stat">
                <span className="legend-dot dot-principal"></span>
                <span className="stat-label">Principal Borrowed:</span>
                <span className="stat-val">{formatAmount(totalPrincipal)}</span>
              </div>
              <div className="legend-stat">
                <span className="legend-dot dot-interest"></span>
                <span className="stat-label">Total Interest:</span>
                <span className="stat-val">{formatAmount(totalInterest.toFixed(2))}</span>
              </div>
            </div>
          </div>

          {/* Prepayment Simulator */}
          <PrepaymentSimulator
            principal={totalPrincipal}
            annualRate={loan.interest_rate}
            tenureMonths={tenureMonths}
            currency={loan.currency}
          />

          {/* Amortization Table */}
          <div className="table-section">
            <h4 className="table-section-title">Month-by-Month Payment Breakdown</h4>
            <div className="schedule-table-wrapper">
              <table className="schedule-table">
                <thead>
                  <tr>
                    <th>Month</th>
                    <th>Payment (EMI)</th>
                    <th>Principal Paid</th>
                    <th>Interest Paid</th>
                    <th>Remaining Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {schedule.map((row) => (
                    <tr key={row.month}>
                      <td>{row.month}</td>
                      <td>{formatAmount(row.emi)}</td>
                      <td>{formatAmount(row.principalPaid)}</td>
                      <td>{formatAmount(row.interestPaid)}</td>
                      <td>{formatAmount(row.balance)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AmortizationModal;

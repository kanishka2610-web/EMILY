// client/src/components/CostChart.jsx
import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import './CostChart.css';

export function CostChart({ comparisons }) {
  if (!comparisons || comparisons.length === 0) return null;

  const data = comparisons.map((item) => ({
    name: item.loan.bank_name,
    'Principal ($)': Number(item.totalPayment - item.totalInterest),
    'Total Interest ($)': Number(item.totalInterest),
    'Fees ($)': Number(item.totalFees),
    'Total Cost ($)': Number(item.totalCost)
  }));

  const formatCurrencyAxis = (value) => {
    if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `$${(value / 1000).toFixed(0)}k`;
    return `$${value}`;
  };

  return (
    <div className="cost-chart-container">
      <div className="chart-header">
        <h3 className="chart-title">Total Cost Breakdown by Loan</h3>
        <p className="chart-subtitle">
          Comparing principal, cumulative interest, and upfront processing fees
        </p>
      </div>

      <div className="chart-wrapper">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="name" tick={{ fill: '#475569', fontSize: 12 }} />
            <YAxis tickFormatter={formatCurrencyAxis} tick={{ fill: '#475569', fontSize: 12 }} />
            <Tooltip
              formatter={(value) => [`$${Number(value).toLocaleString()}`, '']}
              contentStyle={{
                backgroundColor: '#ffffff',
                border: '1px solid #cbd5e1',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
            />
            <Legend wrapperStyle={{ paddingTop: '10px' }} />
            <Bar dataKey="Principal ($)" stackId="a" fill="#3b82f6" />
            <Bar dataKey="Total Interest ($)" stackId="a" fill="#f59e0b" />
            <Bar dataKey="Fees ($)" stackId="a" fill="#ef4444" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default CostChart;

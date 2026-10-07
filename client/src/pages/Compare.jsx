// client/src/pages/Compare.jsx
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCurrency } from '../context/CurrencyContext';
import { useLanguage } from '../context/LanguageContext';
import { compareLoans, saveComparison, explainComparison } from '../services/api';
import { calculateTaxSavings } from '../utils/eligibilityCalculator';
import { ComparisonTable } from '../components/ComparisonTable';
import { CostChart } from '../components/CostChart';
import { AmortizationModal } from '../components/AmortizationModal';
import './Compare.css';

export function Compare() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const { currency, formatMoney } = useCurrency();
  const { language, t } = useLanguage();

  // Extract query params and location state
  const queryParams = new URLSearchParams(location.search);
  const loansQuery = queryParams.get('loans');
  const initialLoanIds = location.state?.selectedIds || (loansQuery ? loansQuery.split(',').filter(Boolean) : []);

  // Determine initial sensible amount depending on currency
  const isIndianDefault = currency === 'INR';
  const defaultAmt = isIndianDefault ? '1000000' : '50000';

  const initialAmount = location.state?.amount || queryParams.get('amount') || defaultAmt;
  const initialTenure = location.state?.tenureMonths || queryParams.get('tenure') || '60';

  const [loanIds, setLoanIds] = useState(initialLoanIds);
  const [amount, setAmount] = useState(initialAmount);
  const [tenureMonths, setTenureMonths] = useState(initialTenure);

  const [comparisonData, setComparisonData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [saveSuccess, setSaveSuccess] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Gemini AI Explainer state
  const [explanation, setExplanation] = useState('');
  const [isExplaining, setIsExplaining] = useState(false);
  const [explainError, setExplainError] = useState('');

  // Amortization modal state
  const [selectedLoanForSchedule, setSelectedLoanForSchedule] = useState(null);

  const handleRunComparison = async (currentLoanIds, currentAmount, currentTenure) => {
    if (!currentLoanIds || currentLoanIds.length < 2) {
      setError('Please select at least 2 loans to compare.');
      return;
    }

    setLoading(true);
    setError('');
    setSaveSuccess('');
    setExplanation('');
    setExplainError('');

    try {
      const result = await compareLoans({
        loanIds: currentLoanIds,
        amount: Number(currentAmount),
        tenureMonths: Number(currentTenure)
      });
      setComparisonData(result);
    } catch (err) {
      setError(err.message || 'Comparison failed. Please verify amounts and limits.');
      setComparisonData(null);
    } finally {
      setLoading(false);
    }
  };

  // Run automatically on first mount if loans are present
  useEffect(() => {
    if (loanIds.length >= 2) {
      handleRunComparison(loanIds, amount, tenureMonths);
    }
  }, []);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    handleRunComparison(loanIds, amount, tenureMonths);
  };

  const handleSaveComparison = async () => {
    if (!user || !token) {
      navigate('/login');
      return;
    }

    setIsSaving(true);
    setSaveSuccess('');
    setError('');

    try {
      await saveComparison(
        {
          loanIds,
          amount: Number(amount),
          tenureMonths: Number(tenureMonths)
        },
        token
      );
      setSaveSuccess('Comparison saved successfully to your account!');
    } catch (err) {
      setError(err.message || 'Failed to save comparison.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleExplainComparison = async () => {
    if (!comparisonData || !comparisonData.summaries) return;

    setIsExplaining(true);
    setExplainError('');

    try {
      const res = await explainComparison({
        comparisons: comparisonData.summaries,
        bestValue: comparisonData.bestValue,
        amount: Number(amount),
        tenureMonths: Number(tenureMonths),
        language
      });
      setExplanation(res.explanation);
    } catch (err) {
      setExplainError(err.message || 'Failed to generate loan explanation.');
    } finally {
      setIsExplaining(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loanIds.length < 2) {
    return (
      <div className="compare-page">
        <div className="empty-state">
          <h3>No loans selected for comparison</h3>
          <p>Please browse loans on the home page and select 2 to 4 loans to compare.</p>
          <Link to="/" className="btn-primary">
            Browse Loans
          </Link>
        </div>
      </div>
    );
  }

  const activeCurrencySymbol = comparisonData?.currency === 'INR' || currency === 'INR' ? '₹' : '$';

  // Compute average annual interest and principal for home loan tax savings
  const isHomeLoanComparison = comparisonData?.summaries?.some(
    (s) => s.loan.loan_type === 'home'
  );

  let taxSavings = null;
  if (isHomeLoanComparison && comparisonData?.summaries?.[0]) {
    const firstLoan = comparisonData.summaries[0];
    const annualEmi = firstLoan.monthlyEmi * 12;
    const estAnnualInterest = (firstLoan.totalInterest / Number(tenureMonths)) * 12;
    const estAnnualPrincipal = Math.max(0, annualEmi - estAnnualInterest);

    taxSavings = calculateTaxSavings({
      annualPrincipalPaid: estAnnualPrincipal,
      annualInterestPaid: estAnnualInterest,
      taxSlabPercent: 30
    });
  }

  return (
    <div className="compare-page">
      <div className="compare-header-row">
        <div>
          <h1>Side-by-Side Loan Comparison</h1>
          <p>
            Comparing {loanIds.length} loans for {formatMoney(amount, comparisonData?.currency)} over {tenureMonths} months
          </p>
        </div>
        <div className="selection-actions">
          <button
            type="button"
            className="btn-print-report"
            onClick={handlePrint}
            title="Print or export clean report for bank visits"
          >
            🖨️ Export / Print Report
          </button>
          <Link to="/" className="btn-secondary">
            Change Selection
          </Link>
        </div>
      </div>

      {/* Input controls */}
      <section className="compare-controls-card">
        <form onSubmit={handleFormSubmit} className="compare-form">
          <div className="form-item">
            <label htmlFor="compare-amount-input">
              Loan Amount ({activeCurrencySymbol})
            </label>
            <input
              id="compare-amount-input"
              type="number"
              min="500"
              step="1000"
              className="form-item-input"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>

          <div className="form-item">
            <label htmlFor="compare-tenure-input">Tenure (Months)</label>
            <input
              id="compare-tenure-input"
              type="number"
              min="6"
              max="480"
              step="1"
              className="form-item-input"
              value={tenureMonths}
              onChange={(e) => setTenureMonths(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Recalculating...' : 'Recalculate Comparison'}
          </button>
        </form>

        <div className="action-buttons-group">
          {user ? (
            <button
              type="button"
              className="btn-save-comparison"
              onClick={handleSaveComparison}
              disabled={isSaving || !comparisonData}
            >
              {isSaving ? 'Saving...' : 'Save Comparison'}
            </button>
          ) : (
            <span className="save-login-hint">
              Want to save this comparison?
              <Link to="/login" className="login-link-inline">
                Sign in
              </Link>
            </span>
          )}

          {comparisonData && (
            <button
              type="button"
              className="btn-explain"
              onClick={handleExplainComparison}
              disabled={isExplaining}
            >
              {isExplaining ? 'Analyzing with AI...' : 'Explain This Comparison'}
            </button>
          )}
        </div>
      </section>

      {error && <div className="status-error">{error}</div>}
      {saveSuccess && <div className="status-success">{saveSuccess}</div>}

      {/* AI Explainer Panel (Prompt 10) */}
      {explainError && <div className="status-error">{explainError}</div>}
      {explanation && (
        <section className="explainer-container">
          <div className="explainer-header">
            <div className="explainer-title">
              <span>Financial Comparison Summary</span>
              <span className="explainer-badge">AI Recommendation</span>
            </div>
          </div>
          <p className="explainer-text">{explanation}</p>
        </section>
      )}

      {/* Indian Income Tax Benefit Analysis for Home Loans */}
      {taxSavings && comparisonData?.currency === 'INR' && (
        <section className="tax-savings-panel">
          <div className="tax-panel-header">
            <div className="tax-panel-title">
              <span>Home Loan Tax Savings (Sec 80C & Sec 24b)</span>
            </div>
            <span className="explainer-badge">30% Tax Slab</span>
          </div>
          <p>
            Home loan borrowers in India can lower their effective borrowing cost by claiming principal and interest deductions under the Old Tax Regime.
          </p>
          <div className="tax-panel-grid">
            <div className="tax-stat-card">
              <span className="tax-stat-label">Principal Deduction (80C)</span>
              <span className="tax-stat-val">Up to ₹1.5 Lakhs/yr</span>
            </div>
            <div className="tax-stat-card">
              <span className="tax-stat-label">Interest Deduction (24b)</span>
              <span className="tax-stat-val">Up to ₹2.0 Lakhs/yr</span>
            </div>
            <div className="tax-stat-card">
              <span className="tax-stat-label">Estimated Tax Saved</span>
              <span className="tax-stat-val">₹{taxSavings.estimatedTaxSaved.toLocaleString('en-IN')}/yr</span>
            </div>
          </div>
        </section>
      )}

      {/* Comparison Results */}
      {loading ? (
        <div className="status-loading">Calculating loan summaries and amortizations...</div>
      ) : (
        comparisonData && (
          <>
            <ComparisonTable
              comparisons={comparisonData.summaries}
              onSelectSchedule={(loan) => setSelectedLoanForSchedule(loan)}
            />

            <CostChart comparisons={comparisonData.summaries} />
          </>
        )
      )}

      {/* Amortization Schedule & Prepayment Modal */}
      {selectedLoanForSchedule && (
        <AmortizationModal
          loan={selectedLoanForSchedule}
          amount={Number(amount)}
          tenureMonths={Number(tenureMonths)}
          onClose={() => setSelectedLoanForSchedule(null)}
        />
      )}
    </div>
  );
}

export default Compare;

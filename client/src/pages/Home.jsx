// client/src/pages/Home.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getLoans, syncBankRates, getSyncStatus } from '../services/api';
import { LoanCard } from '../components/LoanCard';
import { LoanTips } from '../components/LoanTips';
import { QuickEmiWidget } from '../components/QuickEmiWidget';
import { EligibilityModal } from '../components/EligibilityModal';
import { useLanguage } from '../context/LanguageContext';
import './Home.css';

export function Home() {
  const { t } = useLanguage();
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [limitNotice, setLimitNotice] = useState('');

  // Search & Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [loanType, setLoanType] = useState('');
  const [countryRegion, setCountryRegion] = useState(''); // '', 'IN', 'US'
  const [minRate, setMinRate] = useState('');
  const [maxRate, setMaxRate] = useState('');
  const [sortOption, setSortOption] = useState('');

  // Sync state
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncTime, setSyncTime] = useState('');

  // Selection state
  const [selectedIds, setSelectedIds] = useState([]);

  // Eligibility modal state
  const [showEligibility, setShowEligibility] = useState(false);

  const navigate = useNavigate();

  const fetchLoans = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getLoans({
        type: loanType,
        country: countryRegion,
        minRate,
        maxRate,
        sort: sortOption,
        search: searchTerm
      });
      setLoans(data || []);
    } catch (err) {
      setError(err.message || 'Failed to load loan options.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchLoans();
    }, 200);
    return () => clearTimeout(timer);
  }, [searchTerm, loanType, countryRegion, minRate, maxRate, sortOption]);

  useEffect(() => {
    getSyncStatus()
      .then((status) => {
        if (status?.lastSyncTimestamp) {
          const date = new Date(status.lastSyncTimestamp);
          setSyncTime(date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
        }
      })
      .catch(() => {});
  }, []);

  const handleSyncRates = async () => {
    setIsSyncing(true);
    try {
      const result = await syncBankRates();
      if (result.lastUpdated) {
        const date = new Date(result.lastUpdated);
        setSyncTime(date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      }
      await fetchLoans();
    } catch (err) {
      console.warn('Sync notice:', err.message);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleToggleSelect = (loanId) => {
    setLimitNotice('');
    if (selectedIds.includes(loanId)) {
      setSelectedIds(selectedIds.filter((id) => id !== loanId));
    } else {
      if (selectedIds.length >= 4) {
        setLimitNotice(t('selectedOfMax'));
        return;
      }
      setSelectedIds([...selectedIds, loanId]);
    }
  };

  const handleClearSelection = () => {
    setSelectedIds([]);
    setLimitNotice('');
  };

  const handleCompareClick = () => {
    if (selectedIds.length < 2 || selectedIds.length > 4) return;
    const query = selectedIds.join(',');
    navigate(`/compare?loans=${query}`, { state: { selectedIds } });
  };

  const handleApplyEligibleAmount = (eligibleAmount) => {
    // Filter loans whose amount range covers the eligible amount
    if (eligibleAmount > 0) {
      setSearchTerm('');
      setLoans((prev) =>
        prev.filter((l) => l.min_amount <= eligibleAmount && l.max_amount >= eligibleAmount)
      );
    }
  };

  return (
    <div className="home-page">
      <section className="home-hero">
        <h1>EMILY: Smart Loan Comparison Platform</h1>
        <p>
          Compare interest rates, tenure options, processing fees, and monthly EMI payments across leading Indian & Global financial institutions with transparent, live cost breakdowns.
        </p>

        <div className="hero-meta-strip">
          <span className="hero-meta-badge">
            {t('realBankBenchmarks')}
          </span>
          {syncTime && (
            <span className="hero-meta-badge">
              {t('syncedToday')} {syncTime}
            </span>
          )}
          <button
            type="button"
            className="btn-sync-rates"
            onClick={handleSyncRates}
            disabled={isSyncing}
          >
            {isSyncing ? '...' : t('refreshRates')}
          </button>
          <button
            type="button"
            className="btn-sync-rates"
            onClick={() => setShowEligibility(true)}
          >
            🎯 Check My Loan Eligibility (FOIR)
          </button>
        </div>
      </section>

      {/* Quick Interactive EMI Slider Widget */}
      <QuickEmiWidget onOpenEligibility={() => setShowEligibility(true)} />

      {/* Swipeable Loan Tips Carousel */}
      <LoanTips />

      {/* Filters & Search */}
      <section className="filters-bar">
        <div className="search-control">
          <input
            type="text"
            className="search-input"
            placeholder={t('searchBank')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label="Search bank"
          />
        </div>

        <div className="filter-control">
          <label htmlFor="country-filter">{t('marketRegion')}</label>
          <select
            id="country-filter"
            className="filter-select"
            value={countryRegion}
            onChange={(e) => setCountryRegion(e.target.value)}
          >
            <option value="">{t('allMarkets')}</option>
            <option value="IN">{t('indiaMarket')}</option>
            <option value="US">{t('globalMarket')}</option>
          </select>
        </div>

        <div className="filter-control">
          <label htmlFor="loan-type-filter">{t('loanCategory')}</label>
          <select
            id="loan-type-filter"
            className="filter-select"
            value={loanType}
            onChange={(e) => setLoanType(e.target.value)}
          >
            <option value="">{t('allLoanTypes')}</option>
            <option value="home">{t('homeLoan')}</option>
            <option value="personal">{t('personalLoan')}</option>
            <option value="car">{t('carLoan')}</option>
            <option value="education">{t('educationLoan')}</option>
          </select>
        </div>

        <div className="filter-control">
          <label htmlFor="min-rate-filter">{t('minRate')}</label>
          <input
            id="min-rate-filter"
            type="number"
            step="0.1"
            min="0"
            className="filter-input"
            placeholder="e.g. 5.0"
            value={minRate}
            onChange={(e) => setMinRate(e.target.value)}
          />
        </div>

        <div className="filter-control">
          <label htmlFor="max-rate-filter">{t('maxRate')}</label>
          <input
            id="max-rate-filter"
            type="number"
            step="0.1"
            min="0"
            className="filter-input"
            placeholder="e.g. 12.0"
            value={maxRate}
            onChange={(e) => setMaxRate(e.target.value)}
          />
        </div>

        <div className="filter-control">
          <label htmlFor="sort-filter">{t('sortBy')}</label>
          <select
            id="sort-filter"
            className="filter-select"
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
          >
            <option value="">{t('defaultOrder')}</option>
            <option value="rate_asc">{t('lowestRate')}</option>
            <option value="fee_asc">{t('lowestFees')}</option>
          </select>
        </div>
      </section>

      {limitNotice && <div className="status-error">{limitNotice}</div>}
      {error && <div className="status-error">{error}</div>}

      {/* Loans Grid or Status */}
      {loading ? (
        <div className="status-loading">Loading real banking benchmarks...</div>
      ) : loans.length === 0 ? (
        <div className="empty-state">
          <h3>No loans match your search criteria</h3>
          <p>Try clearing your search term or adjusting filters to discover other available banks.</p>
        </div>
      ) : (
        <div className="loans-grid">
          {loans.map((loan) => (
            <LoanCard
              key={loan.id}
              loan={loan}
              isSelected={selectedIds.includes(loan.id)}
              onToggleSelect={handleToggleSelect}
            />
          ))}
        </div>
      )}

      {/* Floating Selection & Compare Bar */}
      {selectedIds.length > 0 && (
        <div className="selection-bar">
          <div className="selection-info">
            <span className="selection-count">
              {selectedIds.length} {t('selectedOfMax')}
            </span>
            <span className="selection-hint">
              {selectedIds.length < 2
                ? t('selectAtLeast2')
                : t('readyToCompare')}
            </span>
          </div>

          <div className="selection-actions">
            <button
              type="button"
              className="btn-clear-selection"
              onClick={handleClearSelection}
            >
              {t('clear')}
            </button>
            <button
              type="button"
              className="btn-primary"
              disabled={selectedIds.length < 2 || selectedIds.length > 4}
              onClick={handleCompareClick}
            >
              {t('compareSelected')} ({selectedIds.length})
            </button>
          </div>
        </div>
      )}

      {/* Borrower Eligibility & FOIR Modal */}
      {showEligibility && (
        <EligibilityModal
          onClose={() => setShowEligibility(false)}
          onApplyAmount={handleApplyEligibleAmount}
        />
      )}
    </div>
  );
}

export default Home;

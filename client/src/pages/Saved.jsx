// client/src/pages/Saved.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getSavedComparisons, deleteSavedComparison } from '../services/api';
import './Saved.css';

export function Saved() {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [savedList, setSavedList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  const fetchSaved = async () => {
    if (!token) return;
    setLoading(true);
    setError('');
    try {
      const data = await getSavedComparisons(token);
      setSavedList(data || []);
    } catch (err) {
      setError(err.message || 'Failed to load saved comparisons.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSaved();
  }, [token]);

  const handleOpen = (item) => {
    const loansParam = item.loan_ids.join(',');
    navigate(
      `/compare?loans=${loansParam}&amount=${item.amount}&tenure=${item.tenure_months}`,
      {
        state: {
          selectedIds: item.loan_ids,
          amount: item.amount,
          tenureMonths: item.tenure_months
        }
      }
    );
  };

  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      await deleteSavedComparison(id, token);
      setSavedList((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      setError(err.message || 'Failed to delete saved comparison.');
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (isoString) => {
    if (!isoString) return '';
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return isoString;
    }
  };

  return (
    <div className="saved-page">
      <div className="saved-header">
        <h1>Your Saved Comparisons</h1>
        <p>Review and reload previously configured loan comparisons.</p>
      </div>

      {error && <div className="status-error">{error}</div>}

      {loading ? (
        <div className="status-loading">Loading saved comparisons...</div>
      ) : savedList.length === 0 ? (
        <div className="empty-state">
          <h3>No saved comparisons yet</h3>
          <p>
            When you run a comparison between loans, click "Save Comparison" to access it here anytime.
          </p>
          <Link to="/" className="btn-primary">
            Browse Loans
          </Link>
        </div>
      ) : (
        <div className="saved-list">
          {savedList.map((item) => (
            <div key={item.id} className="saved-card">
              <div className="saved-meta">
                <span className="saved-date">
                  Saved on {formatDate(item.created_at)}
                </span>
                <div className="saved-title">
                  ${Number(item.amount).toLocaleString()} for {item.tenure_months} months
                </div>
                <div className="saved-details">
                  <span className="saved-pill">
                    {item.loan_ids.length} Loans Compared
                  </span>
                </div>
              </div>

              <div className="saved-actions">
                <button
                  type="button"
                  className="btn-open"
                  onClick={() => handleOpen(item)}
                >
                  Open Comparison
                </button>
                <button
                  type="button"
                  className="btn-delete"
                  disabled={deletingId === item.id}
                  onClick={() => handleDelete(item.id)}
                >
                  {deletingId === item.id ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Saved;

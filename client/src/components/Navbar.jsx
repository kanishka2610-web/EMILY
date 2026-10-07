// client/src/components/Navbar.jsx
import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { useCurrency } from '../context/CurrencyContext';
import './Navbar.css';

export function Navbar() {
  const { user, signOut } = useAuth();
  const { currency, toggleCurrency } = useCurrency();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const currentLang = i18n.language && i18n.language.startsWith('hi') ? 'hi' : 'en';

  const handleLanguageChange = (e) => {
    i18n.changeLanguage(e.target.value);
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (err) {
      console.error('Sign out error:', err);
    }
  };

  return (
    <header className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          <div className="brand-icon">E</div>
          <span>EMILY</span>
        </Link>

        <nav className="navbar-links">
          <NavLink to="/" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')} end>
            {t('browseLoans')}
          </NavLink>
          <NavLink to="/calculator" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
            {t('emiCalculator')}
          </NavLink>
          <NavLink to="/compare" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
            {t('compare')}
          </NavLink>
          <NavLink to="/advisor" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
            {t('aiAdvisor')}
          </NavLink>
          {user && (
            <NavLink to="/saved" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
              {t('savedComparisons')}
            </NavLink>
          )}
        </nav>

        <div className="navbar-auth">
          {/* i18next Multi-Language Selector Dropdown (Hindi and English) */}
          <select
            className="language-select"
            value={currentLang}
            onChange={handleLanguageChange}
            aria-label="Toggle language (Hindi and English)"
          >
            <option value="en">🌐 English</option>
            <option value="hi">🇮🇳 हिंदी (Hindi)</option>
          </select>

          {/* Currency Switcher */}
          <button
            type="button"
            className="currency-toggle-btn"
            onClick={toggleCurrency}
            title="Toggle display currency (INR / USD)"
          >
            <span>{currency === 'INR' ? '₹ INR' : '$ USD'}</span>
          </button>

          {user ? (
            <>
              <span className="user-email" title={user.email}>
                {user.email}
              </span>
              <button onClick={handleSignOut} className="btn-signout" type="button">
                {t('signOut')}
              </button>
            </>
          ) : (
            <Link to="/login" className="btn-signin">
              {t('signIn')}
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;

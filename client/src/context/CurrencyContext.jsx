// client/src/context/CurrencyContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';

const CurrencyContext = createContext({
  currency: 'INR',
  symbol: '₹',
  region: 'ALL',
  setCurrency: () => {},
  setRegion: () => {},
  formatMoney: () => '',
  toggleCurrency: () => {}
});

export function CurrencyProvider({ children }) {
  const [currency, setCurrency] = useState(() => {
    return localStorage.getItem('emily_currency') || 'INR';
  });

  const [region, setRegion] = useState(() => {
    return localStorage.getItem('emily_region') || 'ALL'; // 'ALL', 'IN', 'US'
  });

  useEffect(() => {
    localStorage.setItem('emily_currency', currency);
  }, [currency]);

  useEffect(() => {
    localStorage.setItem('emily_region', region);
  }, [region]);

  const symbol = currency === 'INR' ? '₹' : '$';

  const toggleCurrency = () => {
    setCurrency((prev) => (prev === 'INR' ? 'USD' : 'INR'));
  };

  const formatMoney = (val, customCurrency) => {
    if (val == null || isNaN(val)) return 'N/A';
    const activeCurr = customCurrency || currency;
    const num = Number(val);

    if (activeCurr === 'INR') {
      return '₹' + num.toLocaleString('en-IN');
    }
    return '$' + num.toLocaleString('en-US');
  };

  const value = {
    currency,
    symbol,
    region,
    setCurrency,
    setRegion,
    toggleCurrency,
    formatMoney
  };

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
}

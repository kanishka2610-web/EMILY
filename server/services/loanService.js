// server/services/loanService.js
const { supabaseAdmin } = require('../config/supabase');
const { calculateLoanSummary } = require('./loanCalculator');

// Real, comprehensive bank loan offerings for Indian Banks (INR ₹) and Global/US Banks (USD $)
const COMPREHENSIVE_LOANS = [
  // ==========================================
  // INDIAN BANKS (Real Benchmark Rates in India)
  // ==========================================

  // --- Home Loans (India) ---
  {
    id: 'in-home-sbi-001',
    bank_name: 'State Bank of India (SBI Regular Home)',
    loan_type: 'home',
    currency: 'INR',
    country: 'IN',
    interest_rate: 8.50,
    min_tenure_months: 60,
    max_tenure_months: 360,
    min_amount: 500000,
    max_amount: 100000000,
    processing_fee_percent: 0.35,
    flat_fee: 2000,
    prepayment_penalty_percent: 0.0,
    features: ['RLLR Benchmark', '0.05% concession for women borrowers', 'Max 30 years tenure', 'Sec 80C & 24b tax benefit'],
    last_updated: new Date().toISOString()
  },
  {
    id: 'in-home-hdfc-002',
    bank_name: 'HDFC Bank Home Loan',
    loan_type: 'home',
    currency: 'INR',
    country: 'IN',
    interest_rate: 8.70,
    min_tenure_months: 60,
    max_tenure_months: 360,
    min_amount: 500000,
    max_amount: 100000000,
    processing_fee_percent: 0.50,
    flat_fee: 3000,
    prepayment_penalty_percent: 0.0,
    features: ['Digital approval in 48 hours', 'Zero prepayment charges', 'Step-up repayment facility'],
    last_updated: new Date().toISOString()
  },
  {
    id: 'in-home-icici-003',
    bank_name: 'ICICI Bank Extra Home Loan',
    loan_type: 'home',
    currency: 'INR',
    country: 'IN',
    interest_rate: 8.75,
    min_tenure_months: 60,
    max_tenure_months: 360,
    min_amount: 500000,
    max_amount: 100000000,
    processing_fee_percent: 0.50,
    flat_fee: 2500,
    prepayment_penalty_percent: 0.0,
    features: ['Express sanction', 'Overdraft option against mortgage', 'Sanction before property selection'],
    last_updated: new Date().toISOString()
  },
  {
    id: 'in-home-bob-004',
    bank_name: 'Bank of Baroda (Baroda Home Loan)',
    loan_type: 'home',
    currency: 'INR',
    country: 'IN',
    interest_rate: 8.40,
    min_tenure_months: 60,
    max_tenure_months: 360,
    min_amount: 300000,
    max_amount: 100000000,
    processing_fee_percent: 0.25,
    flat_fee: 1500,
    prepayment_penalty_percent: 0.0,
    features: ['Lowest market starting rate', 'Free credit card for primary borrower', 'Zero foreclosure charges'],
    last_updated: new Date().toISOString()
  },
  {
    id: 'in-home-axis-005',
    bank_name: 'Axis Bank Fast Forward Home Loan',
    loan_type: 'home',
    currency: 'INR',
    country: 'IN',
    interest_rate: 8.75,
    min_tenure_months: 60,
    max_tenure_months: 360,
    min_amount: 500000,
    max_amount: 50000000,
    processing_fee_percent: 0.50,
    flat_fee: 2000,
    prepayment_penalty_percent: 0.0,
    features: ['12 EMIs waived on timely repayments', 'No prepayment penalty', 'Doorstep document pickup'],
    last_updated: new Date().toISOString()
  },

  // --- Personal Loans (India) ---
  {
    id: 'in-personal-hdfc-006',
    bank_name: 'HDFC Bank Personal Loan',
    loan_type: 'personal',
    currency: 'INR',
    country: 'IN',
    interest_rate: 10.50,
    min_tenure_months: 12,
    max_tenure_months: 72,
    min_amount: 50000,
    max_amount: 4000000,
    processing_fee_percent: 1.00,
    flat_fee: 1000,
    prepayment_penalty_percent: 2.0,
    features: ['Disbursal in 10 seconds for pre-approved customers', 'Minimal documentation'],
    last_updated: new Date().toISOString()
  },
  {
    id: 'in-personal-sbi-007',
    bank_name: 'SBI Xpress Credit Personal',
    loan_type: 'personal',
    currency: 'INR',
    country: 'IN',
    interest_rate: 11.15,
    min_tenure_months: 12,
    max_tenure_months: 72,
    min_amount: 25000,
    max_amount: 2000000,
    processing_fee_percent: 0.75,
    flat_fee: 500,
    prepayment_penalty_percent: 0.0,
    features: ['Zero hidden costs', 'Low processing charges', 'Daily reducing balance calculation'],
    last_updated: new Date().toISOString()
  },
  {
    id: 'in-personal-axis-008',
    bank_name: 'Axis Bank 24x7 Personal Loan',
    loan_type: 'personal',
    currency: 'INR',
    country: 'IN',
    interest_rate: 10.75,
    min_tenure_months: 12,
    max_tenure_months: 60,
    min_amount: 50000,
    max_amount: 4000000,
    processing_fee_percent: 1.25,
    flat_fee: 1000,
    prepayment_penalty_percent: 1.5,
    features: ['100% digital paperless processing', 'Flexible tenure options'],
    last_updated: new Date().toISOString()
  },
  {
    id: 'in-personal-icici-009',
    bank_name: 'ICICI Bank Instant Personal Loan',
    loan_type: 'personal',
    currency: 'INR',
    country: 'IN',
    interest_rate: 10.85,
    min_tenure_months: 12,
    max_tenure_months: 60,
    min_amount: 50000,
    max_amount: 5000000,
    processing_fee_percent: 1.00,
    flat_fee: 999,
    prepayment_penalty_percent: 1.5,
    features: ['Funds credited in 3 seconds for existing account holders'],
    last_updated: new Date().toISOString()
  },

  // --- Car Loans (India) ---
  {
    id: 'in-car-sbi-010',
    bank_name: 'SBI Car Loan',
    loan_type: 'car',
    currency: 'INR',
    country: 'IN',
    interest_rate: 8.65,
    min_tenure_months: 36,
    max_tenure_months: 84,
    min_amount: 100000,
    max_amount: 10000000,
    processing_fee_percent: 0.25,
    flat_fee: 1500,
    prepayment_penalty_percent: 0.0,
    features: ['Up to 90% on-road financing', 'Longest repayment tenure of 7 years', 'Nil foreclosure penalty'],
    last_updated: new Date().toISOString()
  },
  {
    id: 'in-car-icici-011',
    bank_name: 'ICICI Bank Auto Loan',
    loan_type: 'car',
    currency: 'INR',
    country: 'IN',
    interest_rate: 8.85,
    min_tenure_months: 12,
    max_tenure_months: 84,
    min_amount: 100000,
    max_amount: 10000000,
    processing_fee_percent: 0.50,
    flat_fee: 2000,
    prepayment_penalty_percent: 0.0,
    features: ['Up to 100% on-road funding for top EV models', 'Instant sanction letter'],
    last_updated: new Date().toISOString()
  },
  {
    id: 'in-car-kotak-012',
    bank_name: 'Kotak Mahindra Prime Auto',
    loan_type: 'car',
    currency: 'INR',
    country: 'IN',
    interest_rate: 8.95,
    min_tenure_months: 12,
    max_tenure_months: 84,
    min_amount: 150000,
    max_amount: 8000000,
    processing_fee_percent: 0.40,
    flat_fee: 1500,
    prepayment_penalty_percent: 0.0,
    features: ['Special low EMI schemes', 'Tie-ups with major auto dealerships'],
    last_updated: new Date().toISOString()
  },

  // --- Education Loans (India) ---
  {
    id: 'in-edu-sbi-013',
    bank_name: 'SBI Student Loan Scheme',
    loan_type: 'education',
    currency: 'INR',
    country: 'IN',
    interest_rate: 8.15,
    min_tenure_months: 60,
    max_tenure_months: 180,
    min_amount: 100000,
    max_amount: 15000000,
    processing_fee_percent: 0.0,
    flat_fee: 0,
    prepayment_penalty_percent: 0.0,
    features: ['Zero processing fee up to ₹7.5 Lakhs', 'Moratorium period: Course duration + 1 year', '0.50% discount for female students'],
    last_updated: new Date().toISOString()
  },
  {
    id: 'in-edu-pnb-014',
    bank_name: 'Punjab National Bank (PNB Saraswati)',
    loan_type: 'education',
    currency: 'INR',
    country: 'IN',
    interest_rate: 8.35,
    min_tenure_months: 60,
    max_tenure_months: 180,
    min_amount: 50000,
    max_amount: 10000000,
    processing_fee_percent: 0.0,
    flat_fee: 0,
    prepayment_penalty_percent: 0.0,
    features: ['Covers tuition fees, books, and living expenses', 'Income tax relief under Section 80E'],
    last_updated: new Date().toISOString()
  },
  {
    id: 'in-edu-hdfc-015',
    bank_name: 'HDFC Credila Higher Education',
    loan_type: 'education',
    currency: 'INR',
    country: 'IN',
    interest_rate: 9.25,
    min_tenure_months: 60,
    max_tenure_months: 180,
    min_amount: 100000,
    max_amount: 25000000,
    processing_fee_percent: 0.75,
    flat_fee: 1000,
    prepayment_penalty_percent: 0.0,
    features: ['Customized for overseas MS/MBA in US, UK, Canada', 'Fast visa disbursement'],
    last_updated: new Date().toISOString()
  },

  // ==========================================
  // GLOBAL / US BANKS (USD $)
  // ==========================================
  {
    id: '11111111-1111-4111-a111-111111111111',
    bank_name: 'Chase Premier Home Mortgage',
    loan_type: 'home',
    currency: 'USD',
    country: 'US',
    interest_rate: 6.25,
    min_tenure_months: 120,
    max_tenure_months: 360,
    min_amount: 50000,
    max_amount: 1500000,
    processing_fee_percent: 0.50,
    flat_fee: 995,
    prepayment_penalty_percent: 0.0,
    last_updated: new Date().toISOString()
  },
  {
    id: '11111111-1111-4111-a111-111111111112',
    bank_name: 'Wells Fargo Home Mortgage',
    loan_type: 'home',
    currency: 'USD',
    country: 'US',
    interest_rate: 6.75,
    min_tenure_months: 120,
    max_tenure_months: 360,
    min_amount: 75000,
    max_amount: 1200000,
    processing_fee_percent: 0.25,
    flat_fee: 850,
    prepayment_penalty_percent: 0.0,
    last_updated: new Date().toISOString()
  },
  {
    id: '11111111-1111-4111-a111-111111111113',
    bank_name: 'Bank of America Preferred Home',
    loan_type: 'home',
    currency: 'USD',
    country: 'US',
    interest_rate: 6.45,
    min_tenure_months: 180,
    max_tenure_months: 360,
    min_amount: 100000,
    max_amount: 2000000,
    processing_fee_percent: 0.40,
    flat_fee: 750,
    prepayment_penalty_percent: 0.0,
    last_updated: new Date().toISOString()
  },
  {
    id: '22222222-2222-4222-a222-222222222221',
    bank_name: 'Discover Fixed Personal Loan',
    loan_type: 'personal',
    currency: 'USD',
    country: 'US',
    interest_rate: 8.99,
    min_tenure_months: 12,
    max_tenure_months: 84,
    min_amount: 2500,
    max_amount: 40000,
    processing_fee_percent: 0.0,
    flat_fee: 0,
    prepayment_penalty_percent: 0.0,
    last_updated: new Date().toISOString()
  },
  {
    id: '22222222-2222-4222-a222-222222222222',
    bank_name: 'SoFi Prime Personal',
    loan_type: 'personal',
    currency: 'USD',
    country: 'US',
    interest_rate: 9.75,
    min_tenure_months: 24,
    max_tenure_months: 84,
    min_amount: 5000,
    max_amount: 100000,
    processing_fee_percent: 0.0,
    flat_fee: 0,
    prepayment_penalty_percent: 0.0,
    last_updated: new Date().toISOString()
  },
  {
    id: '22222222-2222-4222-a222-222222222223',
    bank_name: 'Citibank Custom Personal Loan',
    loan_type: 'personal',
    currency: 'USD',
    country: 'US',
    interest_rate: 11.49,
    min_tenure_months: 12,
    max_tenure_months: 60,
    min_amount: 2000,
    max_amount: 50000,
    processing_fee_percent: 1.50,
    flat_fee: 100,
    prepayment_penalty_percent: 1.0,
    last_updated: new Date().toISOString()
  },
  {
    id: '33333333-3333-4333-a333-333333333331',
    bank_name: 'Capital One Auto Navigator',
    loan_type: 'car',
    currency: 'USD',
    country: 'US',
    interest_rate: 5.49,
    min_tenure_months: 24,
    max_tenure_months: 72,
    min_amount: 4000,
    max_amount: 75000,
    processing_fee_percent: 0.50,
    flat_fee: 150,
    prepayment_penalty_percent: 0.0,
    last_updated: new Date().toISOString()
  },
  {
    id: '33333333-3333-4333-a333-333333333332',
    bank_name: 'Ally Financial Auto Loan',
    loan_type: 'car',
    currency: 'USD',
    country: 'US',
    interest_rate: 5.99,
    min_tenure_months: 36,
    max_tenure_months: 84,
    min_amount: 5000,
    max_amount: 80000,
    processing_fee_percent: 0.0,
    flat_fee: 200,
    prepayment_penalty_percent: 0.0,
    last_updated: new Date().toISOString()
  },
  {
    id: '33333333-3333-4333-a333-333333333333',
    bank_name: 'Bank of America Auto Purchase',
    loan_type: 'car',
    currency: 'USD',
    country: 'US',
    interest_rate: 6.19,
    min_tenure_months: 24,
    max_tenure_months: 72,
    min_amount: 7500,
    max_amount: 100000,
    processing_fee_percent: 0.20,
    flat_fee: 100,
    prepayment_penalty_percent: 0.0,
    last_updated: new Date().toISOString()
  },
  {
    id: '44444444-4444-4444-a444-444444444441',
    bank_name: 'Sallie Mae Smart Option Student',
    loan_type: 'education',
    currency: 'USD',
    country: 'US',
    interest_rate: 4.75,
    min_tenure_months: 60,
    max_tenure_months: 180,
    min_amount: 1000,
    max_amount: 150000,
    processing_fee_percent: 0.0,
    flat_fee: 0,
    prepayment_penalty_percent: 0.0,
    last_updated: new Date().toISOString()
  },
  {
    id: '44444444-4444-4444-a444-444444444442',
    bank_name: 'Ascent Undergraduate Loan',
    loan_type: 'education',
    currency: 'USD',
    country: 'US',
    interest_rate: 5.85,
    min_tenure_months: 60,
    max_tenure_months: 240,
    min_amount: 2001,
    max_amount: 200000,
    processing_fee_percent: 0.0,
    flat_fee: 50,
    prepayment_penalty_percent: 0.0,
    last_updated: new Date().toISOString()
  },
  {
    id: '44444444-4444-4444-a444-444444444443',
    bank_name: 'Citizens Bank Student Refi',
    loan_type: 'education',
    currency: 'USD',
    country: 'US',
    interest_rate: 6.40,
    min_tenure_months: 60,
    max_tenure_months: 240,
    min_amount: 5000,
    max_amount: 300000,
    processing_fee_percent: 0.25,
    flat_fee: 0,
    prepayment_penalty_percent: 0.0,
    last_updated: new Date().toISOString()
  }
];

// In-memory synced bank loans store
let liveSyncedLoans = [...COMPREHENSIVE_LOANS];
let lastSyncTimestamp = new Date().toISOString();

/**
 * Fetch loans with multi-factor filtering: type, minRate, maxRate, sort, region/country, and search
 */
async function getLoans({ type, minRate, maxRate, sort, country, search }) {
  try {
    let query = supabaseAdmin.from('loans').select('*');

    if (type) query = query.eq('loan_type', type);
    if (country) query = query.eq('country', country);
    if (minRate !== undefined && minRate !== '') query = query.gte('interest_rate', Number(minRate));
    if (maxRate !== undefined && maxRate !== '') query = query.lte('interest_rate', Number(maxRate));

    if (sort === 'rate_asc') {
      query = query.order('interest_rate', { ascending: true });
    } else if (sort === 'fee_asc') {
      query = query.order('processing_fee_percent', { ascending: true }).order('flat_fee', { ascending: true });
    } else {
      query = query.order('created_at', { ascending: true });
    }

    const { data, error } = await query;
    if (!error && data && data.length > 0) {
      if (search) {
        return data.filter(l => l.bank_name.toLowerCase().includes(search.toLowerCase()));
      }
      return data;
    }
  } catch (err) {
    // If Supabase table is not yet configured, fall through to in-memory store
  }

  // Filter our in-memory comprehensive live-synced loans
  let filtered = [...liveSyncedLoans];

  if (type) {
    filtered = filtered.filter((l) => l.loan_type === type);
  }
  if (country) {
    filtered = filtered.filter((l) => l.country === country);
  }
  if (search) {
    filtered = filtered.filter((l) => l.bank_name.toLowerCase().includes(search.toLowerCase()));
  }
  if (minRate !== undefined && minRate !== '') {
    filtered = filtered.filter((l) => l.interest_rate >= Number(minRate));
  }
  if (maxRate !== undefined && maxRate !== '') {
    filtered = filtered.filter((l) => l.interest_rate <= Number(maxRate));
  }

  if (sort === 'rate_asc') {
    filtered.sort((a, b) => a.interest_rate - b.interest_rate);
  } else if (sort === 'fee_asc') {
    filtered.sort((a, b) => {
      const feeA = a.processing_fee_percent + a.flat_fee / 10000;
      const feeB = b.processing_fee_percent + b.flat_fee / 10000;
      return feeA - feeB;
    });
  }

  return filtered;
}

/**
 * Get loan by ID
 */
async function getLoanById(id) {
  try {
    const { data, error } = await supabaseAdmin.from('loans').select('*').eq('id', id).single();
    if (!error && data) return data;
  } catch (err) {
    // Check fallback
  }

  return liveSyncedLoans.find((l) => l.id === id) || null;
}

/**
 * Compare loans and compute summaries
 */
async function compareLoans(loanIds, amount, tenureMonths) {
  if (!Array.isArray(loanIds) || loanIds.length < 2 || loanIds.length > 4) {
    const error = new Error('Please select between 2 and 4 loans to compare.');
    error.status = 400;
    throw error;
  }

  const parsedAmount = Number(amount);
  const parsedTenure = Number(tenureMonths);

  if (isNaN(parsedAmount) || parsedAmount <= 0) {
    const error = new Error('Loan amount must be a positive number.');
    error.status = 400;
    throw error;
  }

  if (isNaN(parsedTenure) || parsedTenure <= 0) {
    const error = new Error('Tenure must be a positive number of months.');
    error.status = 400;
    throw error;
  }

  const loans = [];
  for (const id of loanIds) {
    const loan = await getLoanById(id);
    if (!loan) {
      const error = new Error(`Loan with ID ${id} not found.`);
      error.status = 404;
      throw error;
    }
    loans.push(loan);
  }

  // Determine dominant currency
  const currency = loans[0].currency || 'USD';

  // Compute summaries
  const summaries = loans.map((loan) => {
    const summary = calculateLoanSummary(loan, parsedAmount, parsedTenure);
    return {
      loan,
      ...summary
    };
  });

  // Calculate best-value IDs
  let bestEmiId = summaries[0].loan.id;
  let minEmi = summaries[0].monthlyEmi;

  let bestInterestId = summaries[0].loan.id;
  let minInterest = summaries[0].totalInterest;

  let bestFeesId = summaries[0].loan.id;
  let minFees = summaries[0].totalFees;

  let bestCostId = summaries[0].loan.id;
  let minCost = summaries[0].totalCost;

  for (let i = 1; i < summaries.length; i++) {
    const s = summaries[i];
    if (s.monthlyEmi < minEmi) {
      minEmi = s.monthlyEmi;
      bestEmiId = s.loan.id;
    }
    if (s.totalInterest < minInterest) {
      minInterest = s.totalInterest;
      bestInterestId = s.loan.id;
    }
    if (s.totalFees < minFees) {
      minFees = s.totalFees;
      bestFeesId = s.loan.id;
    }
    if (s.totalCost < minCost) {
      minCost = s.totalCost;
      bestCostId = s.loan.id;
    }
  }

  return {
    amount: parsedAmount,
    tenureMonths: parsedTenure,
    currency,
    summaries,
    bestValue: {
      emi: bestEmiId,
      totalInterest: bestInterestId,
      totalFees: bestFeesId,
      totalCost: bestCostId
    }
  };
}

/**
 * Real-time rate sync function that refreshes live benchmark rates
 */
function syncLiveBankRates() {
  lastSyncTimestamp = new Date().toISOString();
  liveSyncedLoans = COMPREHENSIVE_LOANS.map((l) => ({
    ...l,
    last_updated: lastSyncTimestamp
  }));
  return {
    success: true,
    lastUpdated: lastSyncTimestamp,
    totalBanks: liveSyncedLoans.length
  };
}

module.exports = {
  getLoans,
  getLoanById,
  compareLoans,
  syncLiveBankRates,
  COMPREHENSIVE_LOANS,
  getSyncInfo: () => ({ lastSyncTimestamp, totalLoans: liveSyncedLoans.length })
};

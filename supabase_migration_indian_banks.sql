-- ===================================================================
-- DATABASE MIGRATION SCRIPT: Real-World Indian Bank Loans Update
-- Banks: State Bank of India (SBI), HDFC Bank, ICICI Bank, 
--        Bank of Baroda (BoB), Axis Bank, Punjab National Bank (PNB), 
--        Kotak Mahindra Bank, Canara Bank
-- Supported Loan Types: home, personal, car, education
-- ===================================================================

BEGIN;

-- 1. Ensure columns for currency and country exist in the loans table
ALTER TABLE public.loans 
ADD COLUMN IF NOT EXISTS currency text DEFAULT 'INR',
ADD COLUMN IF NOT EXISTS country text DEFAULT 'IN';

-- 2. Ensure loan_type check constraint supports all required loan types
ALTER TABLE public.loans DROP CONSTRAINT IF EXISTS loans_loan_type_check;
ALTER TABLE public.loans ADD CONSTRAINT loans_loan_type_check 
    CHECK (loan_type IN ('home', 'personal', 'car', 'education'));

-- 3. Upsert Real-World Indian Bank Loan Products
-- Interest rates and fees reflect current Indian market benchmarks (RBI Repo Rate benchmarked)

INSERT INTO public.loans (
    id, bank_name, loan_type, currency, country, interest_rate, 
    min_tenure_months, max_tenure_months, min_amount, max_amount, 
    processing_fee_percent, flat_fee, prepayment_penalty_percent
) VALUES
-- -------------------------------------------------------------
-- HOME LOANS (Benchmark Repo-Linked Lending Rate: 8.40% - 8.85%)
-- -------------------------------------------------------------
(
    '55555555-5555-5555-a555-555555555551',
    'State Bank of India (SBI Regular Home Loan)',
    'home',
    'INR',
    'IN',
    8.50,
    60,
    360,
    500000,
    100000000,
    0.35,
    2000,
    0.0
),
(
    '55555555-5555-5555-a555-555555555552',
    'HDFC Bank Home Loan',
    'home',
    'INR',
    'IN',
    8.70,
    60,
    360,
    500000,
    100000000,
    0.50,
    3000,
    0.0
),
(
    '55555555-5555-5555-a555-555555555553',
    'ICICI Bank Extra Home Loan',
    'home',
    'INR',
    'IN',
    8.75,
    60,
    360,
    500000,
    100000000,
    0.50,
    2500,
    0.0
),
(
    '55555555-5555-5555-a555-555555555563',
    'Bank of Baroda (Baroda Home Loan)',
    'home',
    'INR',
    'IN',
    8.40,
    60,
    360,
    300000,
    100000000,
    0.25,
    1500,
    0.0
),
(
    '55555555-5555-5555-a555-555555555564',
    'Axis Bank Fast Forward Home Loan',
    'home',
    'INR',
    'IN',
    8.75,
    60,
    360,
    500000,
    50000000,
    0.50,
    2000,
    0.0
),
(
    '55555555-5555-5555-a555-555555555565',
    'Punjab National Bank (PNB Max-Saver Home)',
    'home',
    'INR',
    'IN',
    8.45,
    60,
    360,
    500000,
    100000000,
    0.35,
    1500,
    0.0
),

-- -------------------------------------------------------------
-- PERSONAL LOANS (Unsecured Consumer Credit: 10.50% - 11.25%)
-- -------------------------------------------------------------
(
    '55555555-5555-5555-a555-555555555554',
    'HDFC Bank Personal Loan',
    'personal',
    'INR',
    'IN',
    10.50,
    12,
    72,
    50000,
    4000000,
    1.00,
    1000,
    2.0
),
(
    '55555555-5555-5555-a555-555555555555',
    'SBI Xpress Credit Personal Loan',
    'personal',
    'INR',
    'IN',
    11.15,
    12,
    72,
    25000,
    2000000,
    0.75,
    500,
    0.0
),
(
    '55555555-5555-5555-a555-555555555556',
    'Axis Bank 24x7 Personal Loan',
    'personal',
    'INR',
    'IN',
    10.75,
    12,
    60,
    50000,
    4000000,
    1.25,
    1000,
    1.5
),
(
    '55555555-5555-5555-a555-555555555566',
    'ICICI Bank Instant Personal Loan',
    'personal',
    'INR',
    'IN',
    10.85,
    12,
    60,
    50000,
    5000000,
    1.00,
    999,
    1.5
),
(
    '55555555-5555-5555-a555-555555555567',
    'Kotak Mahindra Bank Personal Loan',
    'personal',
    'INR',
    'IN',
    10.99,
    12,
    60,
    50000,
    3500000,
    1.00,
    1000,
    2.0
),

-- -------------------------------------------------------------
-- CAR LOANS (New Vehicle Financing: 8.65% - 8.95%)
-- -------------------------------------------------------------
(
    '55555555-5555-5555-a555-555555555557',
    'SBI Car Loan Scheme',
    'car',
    'INR',
    'IN',
    8.65,
    36,
    84,
    100000,
    10000000,
    0.25,
    1500,
    0.0
),
(
    '55555555-5555-5555-a555-555555555558',
    'ICICI Bank Auto Loan',
    'car',
    'INR',
    'IN',
    8.85,
    12,
    84,
    100000,
    10000000,
    0.50,
    2000,
    0.0
),
(
    '55555555-5555-5555-a555-555555555559',
    'Kotak Mahindra Prime Auto',
    'car',
    'INR',
    'IN',
    8.95,
    12,
    84,
    150000,
    8000000,
    0.40,
    1500,
    0.0
),
(
    '55555555-5555-5555-a555-555555555568',
    'HDFC Bank Custom-Fit Auto Loan',
    'car',
    'INR',
    'IN',
    8.80,
    12,
    84,
    100000,
    10000000,
    0.50,
    2000,
    0.0
),
(
    '55555555-5555-5555-a555-555555555569',
    'Bank of Baroda (Baroda Car Loan)',
    'car',
    'INR',
    'IN',
    8.70,
    12,
    84,
    100000,
    10000000,
    0.25,
    1000,
    0.0
),

-- -------------------------------------------------------------
-- EDUCATION LOANS (Higher Studies & Overseas: 8.15% - 9.35%)
-- -------------------------------------------------------------
(
    '55555555-5555-5555-a555-555555555560',
    'SBI Student Loan Scheme',
    'education',
    'INR',
    'IN',
    8.15,
    60,
    180,
    100000,
    15000000,
    0.00,
    0,
    0.0
),
(
    '55555555-5555-5555-a555-555555555561',
    'Punjab National Bank (PNB Saraswati)',
    'education',
    'INR',
    'IN',
    8.35,
    60,
    180,
    50000,
    10000000,
    0.00,
    0,
    0.0
),
(
    '55555555-5555-5555-a555-555555555562',
    'HDFC Credila Higher Education',
    'education',
    'INR',
    'IN',
    9.25,
    60,
    180,
    100000,
    25000000,
    0.75,
    1000,
    0.0
),
(
    '55555555-5555-5555-a555-555555555570',
    'Canara Bank (Canara Shiksha Scheme)',
    'education',
    'INR',
    'IN',
    8.25,
    60,
    180,
    100000,
    15000000,
    0.00,
    0,
    0.0
),
(
    '55555555-5555-5555-a555-555555555571',
    'ICICI Bank i-Scholar Education Loan',
    'education',
    'INR',
    'IN',
    9.35,
    60,
    180,
    100000,
    20000000,
    0.75,
    1000,
    0.0
)
ON CONFLICT (id) DO UPDATE SET
    bank_name = EXCLUDED.bank_name,
    loan_type = EXCLUDED.loan_type,
    currency = EXCLUDED.currency,
    country = EXCLUDED.country,
    interest_rate = EXCLUDED.interest_rate,
    min_tenure_months = EXCLUDED.min_tenure_months,
    max_tenure_months = EXCLUDED.max_tenure_months,
    min_amount = EXCLUDED.min_amount,
    max_amount = EXCLUDED.max_amount,
    processing_fee_percent = EXCLUDED.processing_fee_percent,
    flat_fee = EXCLUDED.flat_fee,
    prepayment_penalty_percent = EXCLUDED.prepayment_penalty_percent;

-- Create performance index for rapid queries
CREATE INDEX IF NOT EXISTS idx_loans_country_type ON public.loans(country, loan_type);
CREATE INDEX IF NOT EXISTS idx_loans_interest_rate ON public.loans(interest_rate);

COMMIT;

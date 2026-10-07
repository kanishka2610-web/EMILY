-- ===================================================================
-- EMILY Loan Comparison Platform - Supabase Database Schema & Seed Data
-- ===================================================================

-- 1. Create table: loans
CREATE TABLE IF NOT EXISTS public.loans (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    bank_name text NOT NULL,
    loan_type text CHECK (loan_type IN ('home', 'personal', 'car', 'education')),
    currency text DEFAULT 'INR',
    country text DEFAULT 'IN',
    interest_rate numeric NOT NULL, -- percent per year
    min_tenure_months int,
    max_tenure_months int,
    min_amount numeric,
    max_amount numeric,
    processing_fee_percent numeric DEFAULT 0,
    flat_fee numeric DEFAULT 0,
    prepayment_penalty_percent numeric DEFAULT 0,
    created_at timestamptz DEFAULT now()
);

-- 2. Create table: saved_comparisons
CREATE TABLE IF NOT EXISTS public.saved_comparisons (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    loan_ids uuid[] NOT NULL,
    amount numeric NOT NULL,
    tenure_months int NOT NULL,
    created_at timestamptz DEFAULT now()
);

-- 3. Row Level Security (RLS) Setup
ALTER TABLE public.loans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_comparisons ENABLE ROW LEVEL SECURITY;

-- Loans: Everyone can read loans
DROP POLICY IF EXISTS "Public can view loans" ON public.loans;
CREATE POLICY "Public can view loans"
    ON public.loans
    FOR SELECT
    USING (true);

-- Saved Comparisons: Authenticated users can select, insert, delete only their own records
DROP POLICY IF EXISTS "Users can view their own saved comparisons" ON public.saved_comparisons;
CREATE POLICY "Users can view their own saved comparisons"
    ON public.saved_comparisons
    FOR SELECT
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own saved comparisons" ON public.saved_comparisons;
CREATE POLICY "Users can insert their own saved comparisons"
    ON public.saved_comparisons
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own saved comparisons" ON public.saved_comparisons;
CREATE POLICY "Users can delete their own saved comparisons"
    ON public.saved_comparisons
    FOR DELETE
    USING (auth.uid() = user_id);

-- 4. Seed Data: Comprehensive Real-World Indian Banks (INR) & Global Banks (USD)
DELETE FROM public.loans;

INSERT INTO public.loans (
    id, bank_name, loan_type, currency, country, interest_rate, min_tenure_months, max_tenure_months, min_amount, max_amount, processing_fee_percent, flat_fee, prepayment_penalty_percent
) VALUES
-- Indian Banks (Home Loans)
('55555555-5555-5555-a555-555555555551', 'State Bank of India (SBI Regular Home Loan)', 'home', 'INR', 'IN', 8.50, 60, 360, 500000, 100000000, 0.35, 2000, 0.0),
('55555555-5555-5555-a555-555555555552', 'HDFC Bank Home Loan', 'home', 'INR', 'IN', 8.70, 60, 360, 500000, 100000000, 0.50, 3000, 0.0),
('55555555-5555-5555-a555-555555555553', 'ICICI Bank Extra Home Loan', 'home', 'INR', 'IN', 8.75, 60, 360, 500000, 100000000, 0.50, 2500, 0.0),
('55555555-5555-5555-a555-555555555563', 'Bank of Baroda (Baroda Home Loan)', 'home', 'INR', 'IN', 8.40, 60, 360, 300000, 100000000, 0.25, 1500, 0.0),
('55555555-5555-5555-a555-555555555564', 'Axis Bank Fast Forward Home Loan', 'home', 'INR', 'IN', 8.75, 60, 360, 500000, 50000000, 0.50, 2000, 0.0),
('55555555-5555-5555-a555-555555555565', 'Punjab National Bank (PNB Max-Saver Home)', 'home', 'INR', 'IN', 8.45, 60, 360, 500000, 100000000, 0.35, 1500, 0.0),

-- Indian Banks (Personal Loans)
('55555555-5555-5555-a555-555555555554', 'HDFC Bank Personal Loan', 'personal', 'INR', 'IN', 10.50, 12, 72, 50000, 4000000, 1.00, 1000, 2.0),
('55555555-5555-5555-a555-555555555555', 'SBI Xpress Credit Personal Loan', 'personal', 'INR', 'IN', 11.15, 12, 72, 25000, 2000000, 0.75, 500, 0.0),
('55555555-5555-5555-a555-555555555556', 'Axis Bank 24x7 Personal Loan', 'personal', 'INR', 'IN', 10.75, 12, 60, 50000, 4000000, 1.25, 1000, 1.5),
('55555555-5555-5555-a555-555555555566', 'ICICI Bank Instant Personal Loan', 'personal', 'INR', 'IN', 10.85, 12, 60, 50000, 5000000, 1.00, 999, 1.5),
('55555555-5555-5555-a555-555555555567', 'Kotak Mahindra Bank Personal Loan', 'personal', 'INR', 'IN', 10.99, 12, 60, 50000, 3500000, 1.00, 1000, 2.0),

-- Indian Banks (Car Loans)
('55555555-5555-5555-a555-555555555557', 'SBI Car Loan Scheme', 'car', 'INR', 'IN', 8.65, 36, 84, 100000, 10000000, 0.25, 1500, 0.0),
('55555555-5555-5555-a555-555555555558', 'ICICI Bank Auto Loan', 'car', 'INR', 'IN', 8.85, 12, 84, 100000, 10000000, 0.50, 2000, 0.0),
('55555555-5555-5555-a555-555555555559', 'Kotak Mahindra Prime Auto', 'car', 'INR', 'IN', 8.95, 12, 84, 150000, 8000000, 0.40, 1500, 0.0),
('55555555-5555-5555-a555-555555555568', 'HDFC Bank Custom-Fit Auto Loan', 'car', 'INR', 'IN', 8.80, 12, 84, 100000, 10000000, 0.50, 2000, 0.0),
('55555555-5555-5555-a555-555555555569', 'Bank of Baroda (Baroda Car Loan)', 'car', 'INR', 'IN', 8.70, 12, 84, 100000, 10000000, 0.25, 1000, 0.0),

-- Indian Banks (Education Loans)
('55555555-5555-5555-a555-555555555560', 'SBI Student Loan Scheme', 'education', 'INR', 'IN', 8.15, 60, 180, 100000, 15000000, 0.0, 0, 0.0),
('55555555-5555-5555-a555-555555555561', 'Punjab National Bank (PNB Saraswati)', 'education', 'INR', 'IN', 8.35, 60, 180, 50000, 10000000, 0.0, 0, 0.0),
('55555555-5555-5555-a555-555555555562', 'HDFC Credila Higher Education', 'education', 'INR', 'IN', 9.25, 60, 180, 100000, 25000000, 0.75, 1000, 0.0),
('55555555-5555-5555-a555-555555555570', 'Canara Bank (Canara Shiksha Scheme)', 'education', 'INR', 'IN', 8.25, 60, 180, 100000, 15000000, 0.0, 0, 0.0),
('55555555-5555-5555-a555-555555555571', 'ICICI Bank i-Scholar Education Loan', 'education', 'INR', 'IN', 9.35, 60, 180, 100000, 20000000, 0.75, 1000, 0.0),

-- US / Global Banks (Home Loans)
('11111111-1111-4111-a111-111111111111', 'Chase Premier Home Mortgage', 'home', 'USD', 'US', 6.25, 120, 360, 50000, 1500000, 0.50, 995, 0.0),
('11111111-1111-4111-a111-111111111112', 'Wells Fargo Home Mortgage', 'home', 'USD', 'US', 6.75, 120, 360, 75000, 1200000, 0.25, 850, 0.0),
('11111111-1111-4111-a111-111111111113', 'Bank of America Preferred Home', 'home', 'USD', 'US', 6.45, 180, 360, 100000, 2000000, 0.40, 750, 0.0),

-- US / Global Banks (Personal Loans)
('22222222-2222-4222-a222-222222222221', 'Discover Fixed Personal Loan', 'personal', 'USD', 'US', 8.99, 12, 84, 2500, 40000, 0.00, 0, 0.0),
('22222222-2222-4222-a222-222222222222', 'SoFi Prime Personal', 'personal', 'USD', 'US', 9.75, 24, 84, 5000, 100000, 0.00, 0, 0.0),
('22222222-2222-4222-a222-222222222223', 'Citibank Custom Personal Loan', 'personal', 'USD', 'US', 11.49, 12, 60, 2000, 50000, 1.50, 100, 1.0),

-- US / Global Banks (Car Loans)
('33333333-3333-4333-a333-333333333331', 'Capital One Auto Navigator', 'car', 'USD', 'US', 5.49, 24, 72, 4000, 75000, 0.50, 150, 0.0),
('33333333-3333-4333-a333-333333333332', 'Ally Financial Auto Loan', 'car', 'USD', 'US', 5.99, 36, 84, 5000, 80000, 0.00, 200, 0.0),
('33333333-3333-4333-a333-333333333333', 'Bank of America Auto Purchase', 'car', 'USD', 'US', 6.19, 24, 72, 7500, 100000, 0.20, 100, 0.0),

-- US / Global Banks (Education Loans)
('44444444-4444-4444-a444-444444444441', 'Sallie Mae Smart Option Student', 'education', 'USD', 'US', 4.75, 60, 180, 1000, 150000, 0.00, 0, 0.0),
('44444444-4444-4444-a444-444444444442', 'Ascent Undergraduate Loan', 'education', 'USD', 'US', 5.85, 60, 240, 2001, 200000, 0.00, 50, 0.0),
('44444444-4444-4444-a444-444444444443', 'Citizens Bank Student Refi', 'education', 'USD', 'US', 6.40, 60, 240, 5000, 300000, 0.25, 0, 0.0);

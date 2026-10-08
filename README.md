# EMILY - Loan Comparison Platform

A full-stack, logic-focused Loan Comparison Platform named **EMILY** built with React (Vite), Node.js (Express), Supabase (PostgreSQL & Authentication), and Google Gemini AI.

The platform empowers users to compare loans across interest rates, tenures, processing fees, and monthly Equated Monthly Installment (EMI), inspect month-by-month amortization schedules, simulate early payoffs via prepayment, and receive AI-generated financial comparison summaries.

---

## Folder Structure

```
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── AmortizationModal.jsx
│   │   │   ├── AmortizationModal.css
│   │   │   ├── ComparisonTable.jsx
│   │   │   ├── ComparisonTable.css
│   │   │   ├── CostChart.jsx
│   │   │   ├── CostChart.css
│   │   │   ├── LoanCard.jsx
│   │   │   ├── LoanCard.css
│   │   │   ├── Navbar.jsx
│   │   │   ├── Navbar.css
│   │   │   ├── PrepaymentSimulator.jsx
│   │   │   ├── PrepaymentSimulator.css
│   │   │   └── ProtectedRoute.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── pages/
│   │   │   ├── Compare.jsx
│   │   │   ├── Compare.css
│   │   │   ├── Home.jsx
│   │   │   ├── Home.css
│   │   │   ├── Login.jsx
│   │   │   ├── Login.css
│   │   │   ├── Saved.jsx
│   │   │   └── Saved.css
│   │   ├── services/
│   │   │   ├── api.js
│   │   │   └── supabaseClient.js
│   │   ├── styles/
│   │   │   └── global.css
│   │   ├── utils/
│   │   │   └── loanCalculator.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── .env.example
├── server/
│   ├── config/
│   │   └── supabase.js
│   ├── controllers/
│   │   ├── explainController.js
│   │   ├── loanController.js
│   │   └── savedController.js
│   ├── middleware/
│   │   └── auth.js
│   ├── routes/
│   │   ├── compareRoutes.js
│   │   ├── explainRoutes.js
│   │   ├── loanRoutes.js
│   │   └── savedRoutes.js
│   ├── services/
│   │   ├── loanCalculator.js
│   │   ├── loanService.js
│   │   └── savedService.js
│   ├── index.js
│   └── .env.example
├── supabase_schema.sql
├── server.ts
├── package.json
└── README.md
```

---

## Supabase Setup Steps

1. **Open Supabase Project**:
   Log into your Supabase Dashboard at [https://supabase.com/dashboard](https://supabase.com/dashboard) and navigate to your project (`gdfczcbpzfuitarfrevr`).

2. **Run SQL Schema**:
   - Open the **SQL Editor** tab from the left sidebar.
   - Copy the entire contents of `supabase_schema.sql` from this repository.
   - Paste into the SQL editor and click **Run**.
   - This creates:
     - `loans` table with constraints for types (`home`, `personal`, `car`, `education`).
     - `saved_comparisons` table referencing `auth.users(id)`.
     - Row Level Security (RLS) policies allowing public read access for `loans`, and user-scoped CRUD access for `saved_comparisons`.
     - 12 realistic seeded loans (3 per category) with diverse interest rates and fee structures.

3. **Run Indian Banks Database Migration**:
   - Option A (SQL Editor): Copy the contents of `supabase_migration_indian_banks.sql` and run it in the Supabase SQL editor.
   - Option B (Automated CLI): Run `npm run migrate:loans` to execute the Node.js migration script (`server/scripts/migrateLoans.js`).
   - This seeds and updates real-world Indian bank products (SBI, HDFC, ICICI, Bank of Baroda, Axis Bank, PNB, Kotak, Canara Bank) with benchmark interest rates and fees.


---

## Environment Variables

### Client (`client/.env.example`)
```env
VITE_SUPABASE_URL=https://gdfczcbpzfuitarfrevr.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Server (`server/.env.example`)
```env
PORT=5000
SUPABASE_URL=https://gdfczcbpzfuitarfrevr.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
SUPABASE_ANON_KEY=your_supabase_anon_key
GEMINI_API_KEY=your_gemini_api_key
```

### Root Project (`.env`)
Configured to seamlessly power both the Express backend and the Vite client simultaneously.

---

## Running the Application

### 1. Unified Development Server (Full-Stack on Port 3000)
Runs the unified Express backend with Vite middleware in development:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 2. Standalone Server (Optional)
To test the Express API standalone:
```bash
node server/index.js
```
The API is available at `http://localhost:5000/api`.

### 3. Build & Production
```bash
npm run build
npm start
```

---

## Core Features & Testing

1. **Borrowing Intelligence & Horizontal Swipeable 'Loan Tips' Carousel**:
   - Touch- and mouse-drag swipeable carousel on the Home page with scroll-snap alignment and animated progress dot indicators.
   - In-depth credit improvement advice: CIBIL 750+ benchmark, 30% credit card utilization rule, avoiding clustered hard inquiries.
   - Comprehensive financial literacy: 40% EMI-to-income safety ratio, reducing balance vs. flat rate analysis, Section 80C and 24(b) Indian tax deductions, women borrower interest concessions (0.05% discount at SBI/PNB).
   - Filter chips: `All Tips`, `Credit Score`, `Financial Literacy`, and `Tax & Concessions`.

2. **Real Indian Banking Benchmark Data & Search**:
   - Comprehensive offerings from top Indian banks: **State Bank of India (SBI)**, **HDFC Bank**, **ICICI Bank**, **Bank of Baroda (BoB)**, **Axis Bank**, **Punjab National Bank (PNB)**, and **Kotak Mahindra Bank**.
   - Instant live search bar to filter banks by name.
   - Dynamic currency switcher for **₹ INR** and **$ USD**.

3. **Multi-Language Switching via i18next & react-i18next**:
   - Initialized with `i18next` and `react-i18next` (`client/src/i18n.js`).
   - Starting support for **English (`en`)** and **Hindi (`hi`)** with complete key coverage across headers, categories, filters, metric tables, and loan tips.
   - Interactive dropdown in the Navbar allowing instant, seamless language toggling.
   - Persists user language preference to `localStorage`.
   - Gemini AI Financial Advisor (`Chatbot.jsx`) and Comparison Explainer dynamically adapt to the user's active language.

3. **Multi-Turn Gemini AI Financial Advisor (`/advisor`)**:
   - Dedicated full-page AI Financial Advisory feature powered by `@google/genai` (`gemini-3.8-flash`).
   - Clean scrollable chat thread preserving conversation history with prompt shortcuts for CIBIL 750+ score improvement, Reducing vs Flat Rate, bank comparisons, and tax planning.
   - Accessible via the top navigation bar with zero floating toggles obstructing the view.

4. **Standalone EMI Calculator Feature (`/calculator`)**:
   - Dedicated full-page EMI Calculator accessible directly from the Navbar and from the Home page.
   - Real-time sliders and number inputs for Loan Amount, Interest Rate, and Tenure (with Years/Months switcher).
   - Real-time calculations of Monthly EMI, Total Interest, and Total Payable with a visual Principal vs. Interest proportion bar.
   - Quick one-tap presets for Home Loans, Car Loans, Personal Loans, and Education Loans with support for ₹ INR and $ USD.

5. **Browse Loans (`/`)**:
   - Filter by loan type (`home`, `personal`, `car`, `education`).
   - Filter by minimum and maximum interest rate.
   - Sort by lowest interest rate or lowest processing fees.
   - Select 2 to 4 loans with interactive checkboxes (safeguards against selecting >4 loans).

2. **Side-by-Side Comparison (`/compare`)**:
   - Enter customized loan principal amounts and repayment tenures in months.
   - Comprehensive side-by-side table comparing EMI, total interest, fees, total cost, and effective cost percentage.
   - Auto-highlighted best values with `.best-value` styling.
   - Interactive bar chart breakdown powered by Recharts.
   - Save comparison (authenticated users).

3. **Amortization Schedule & Prepayment Simulator**:
   - Click "View schedule" on any loan column to open the modal.
   - Month-by-month principal, interest, and remaining balance breakdown.
   - Principal vs. Interest pie chart.
   - Prepayment simulator computing revised loan tenures, months saved, and interest saved.

4. **Saved Comparisons (`/saved`)**:
   - Protected route for authenticated users.
   - Displays all saved comparisons with date and metrics.
   - Re-open comparison with one click or delete records.

5. **AI Loan Recommendation (Prompt 10)**:
   - "Explain This Comparison" button invokes Gemini (`gemini-3.8-flash`) server-side via `@google/genai` to generate an objective plain-language recommendation under 120 words.

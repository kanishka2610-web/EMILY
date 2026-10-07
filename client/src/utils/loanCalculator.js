// client/src/utils/loanCalculator.js
// ES module implementation of pure loan calculation functions

/**
 * Calculates monthly Equated Monthly Installment (EMI).
 * Formula: EMI = P * r * (1+r)^n / ((1+r)^n - 1)
 * If r = 0, EMI = P / n
 * @param {number} principal - Loan principal amount
 * @param {number} annualRate - Annual interest rate in percent (e.g. 7.5 for 7.5%)
 * @param {number} tenureMonths - Total duration in months
 * @returns {number} Monthly EMI rounded to 2 decimal places
 */
export function calculateEmi(principal, annualRate, tenureMonths) {
  const P = Number(principal);
  const n = Number(tenureMonths);
  const rate = Number(annualRate);

  if (n <= 0 || P <= 0) return 0;
  const r = rate / 12 / 100;

  if (r === 0) {
    return Number((P / n).toFixed(2));
  }

  const factor = Math.pow(1 + r, n);
  const emi = (P * r * factor) / (factor - 1);
  return Number(emi.toFixed(2));
}

/**
 * Calculates comprehensive loan cost summary including fees and effective percentage.
 * @param {Object} loan - Loan metadata containing fees
 * @param {number} amount - Principal borrowed
 * @param {number} tenureMonths - Loan tenure in months
 * @returns {Object} Loan summary metrics
 */
export function calculateLoanSummary(loan, amount, tenureMonths) {
  const principal = Number(amount);
  const tenure = Number(tenureMonths);
  const annualRate = Number(loan.interest_rate || 0);

  const monthlyEmi = calculateEmi(principal, annualRate, tenure);
  const totalPayment = Number((monthlyEmi * tenure).toFixed(2));
  const totalInterest = Number(Math.max(0, totalPayment - principal).toFixed(2));

  const processingFeePercent = Number(loan.processing_fee_percent || 0);
  const flatFee = Number(loan.flat_fee || 0);
  const processingFee = Number(((principal * processingFeePercent) / 100 + flatFee).toFixed(2));
  const totalFees = processingFee;
  const totalCost = Number((totalPayment + processingFee).toFixed(2));

  const effectiveCostPercent = principal > 0
    ? Number((((totalCost - principal) / principal) * 100).toFixed(2))
    : 0;

  return {
    monthlyEmi,
    totalPayment,
    totalInterest,
    processingFee,
    totalFees,
    totalCost,
    effectiveCostPercent
  };
}

/**
 * Generates month-by-month amortization schedule.
 * @param {number} principal - Loan principal
 * @param {number} annualRate - Annual interest rate in percent
 * @param {number} tenureMonths - Total duration in months
 * @returns {Array<Object>} List of monthly breakdowns
 */
export function generateSchedule(principal, annualRate, tenureMonths) {
  const P = Number(principal);
  const n = Number(tenureMonths);
  const rate = Number(annualRate);

  if (n <= 0 || P <= 0) return [];

  const emi = calculateEmi(P, rate, n);
  const r = rate / 12 / 100;
  let balance = P;
  const schedule = [];

  for (let month = 1; month <= n; month++) {
    const interestPaid = r === 0 ? 0 : Number((balance * r).toFixed(2));
    let principalPaid = Number((emi - interestPaid).toFixed(2));

    if (month === n || balance <= principalPaid) {
      principalPaid = Number(balance.toFixed(2));
      const finalEmi = Number((principalPaid + interestPaid).toFixed(2));
      balance = 0;
      schedule.push({
        month,
        emi: finalEmi,
        principalPaid,
        interestPaid,
        balance: 0
      });
      break;
    }

    balance = Number(Math.max(0, balance - principalPaid).toFixed(2));
    schedule.push({
      month,
      emi,
      principalPaid,
      interestPaid,
      balance
    });
  }

  return schedule;
}

/**
 * Simulates prepayment by paying an additional fixed amount each month.
 * @param {number} principal - Loan principal
 * @param {number} annualRate - Annual interest rate in percent
 * @param {number} tenureMonths - Original tenure in months
 * @param {number} extraMonthly - Extra amount paid monthly
 * @returns {Object} Simulation metrics: newTenureMonths, interestSaved, monthsSaved
 */
export function simulatePrepayment(principal, annualRate, tenureMonths, extraMonthly) {
  const P = Number(principal);
  const n = Number(tenureMonths);
  const rate = Number(annualRate);
  const extra = Number(extraMonthly) || 0;

  const baseEmi = calculateEmi(P, rate, n);
  const r = rate / 12 / 100;
  const originalTotalInterest = Number(Math.max(0, (baseEmi * n) - P).toFixed(2));

  if (extra <= 0) {
    return {
      newTenureMonths: n,
      interestSaved: 0,
      monthsSaved: 0
    };
  }

  const targetPayment = baseEmi + extra;
  let balance = P;
  let newTotalInterest = 0;
  let currentMonth = 0;

  while (balance > 0 && currentMonth < n) {
    currentMonth++;
    const interestPaid = r === 0 ? 0 : Number((balance * r).toFixed(2));
    newTotalInterest += interestPaid;

    const availablePrincipalPayment = targetPayment - interestPaid;
    const principalPaid = Math.min(balance, availablePrincipalPayment);
    balance = Number(Math.max(0, balance - principalPaid).toFixed(2));

    if (balance <= 0.05) {
      balance = 0;
      break;
    }
  }

  const newTenureMonths = currentMonth;
  const interestSaved = Number(Math.max(0, originalTotalInterest - newTotalInterest).toFixed(2));
  const monthsSaved = Math.max(0, n - newTenureMonths);

  return {
    newTenureMonths,
    interestSaved,
    monthsSaved
  };
}

/*
======================================================================
TEST CASES & EXPECTED OUTPUTS
======================================================================

Test 1: Zero interest rate (0% financing)
Inputs: principal = 12000, annualRate = 0, tenureMonths = 12
calculateEmi(12000, 0, 12)
Expected Output: 1000.00

Test 2: Standard personal loan
Inputs: principal = 10000, annualRate = 10, tenureMonths = 24
calculateEmi(10000, 10, 24)
Expected Output: 461.45

Test 3: Standard home mortgage
Inputs: principal = 300000, annualRate = 6.5, tenureMonths = 360
calculateEmi(300000, 6.5, 360)
Expected Output: 1896.20

Test 4: Prepayment simulation
Inputs: principal = 10000, annualRate = 10, tenureMonths = 24, extraMonthly = 100
simulatePrepayment(10000, 10, 24, 100)
Expected Output:
{
  newTenureMonths: 20,
  interestSaved: 191.07,
  monthsSaved: 4
}

Test 5: Loan Summary with fees
Inputs: loan = { interest_rate: 6, processing_fee_percent: 1, flat_fee: 200 }, amount = 50000, tenureMonths = 60
calculateLoanSummary(loan, 50000, 60)
Expected Output:
{
  monthlyEmi: 966.64,
  totalPayment: 57998.40,
  totalInterest: 7998.40,
  processingFee: 700.00,
  totalFees: 700.00,
  totalCost: 58698.40,
  effectiveCostPercent: 17.40
}
======================================================================
*/

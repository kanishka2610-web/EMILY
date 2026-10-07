// client/src/utils/eligibilityCalculator.js

/**
 * Calculate Max Eligible Loan Amount and FOIR (Fixed Obligation to Income Ratio)
 * 
 * In Indian banking (RBI norms) and global banking, lenders cap total monthly obligations
 * (existing EMIs + new loan EMI) at 40% to 50% of net monthly income (FOIR).
 * 
 * @param {number} monthlyIncome - Net monthly income after taxes
 * @param {number} existingEmis - Current monthly debt / EMI obligations
 * @param {number} interestRate - Annual interest rate (%)
 * @param {number} tenureMonths - Tenure in months
 * @param {number} maxFoirPercent - Max FOIR allowed (default 50%)
 */
export function calculateEligibility({
  monthlyIncome,
  existingEmis = 0,
  interestRate = 8.5,
  tenureMonths = 240,
  maxFoirPercent = 50
}) {
  const income = Math.max(0, Number(monthlyIncome) || 0);
  const obligations = Math.max(0, Number(existingEmis) || 0);
  const rate = Math.max(0.1, Number(interestRate) || 8.5);
  const tenure = Math.max(1, Number(tenureMonths) || 240);
  const foirLimit = Math.min(70, Math.max(30, Number(maxFoirPercent) || 50)) / 100;

  // Max total monthly EMI capacity
  const maxTotalAllowedEmi = income * foirLimit;

  // Disposable EMI capacity available for the new loan
  const maxNewLoanEmi = Math.max(0, maxTotalAllowedEmi - obligations);

  // Current FOIR with existing obligations
  const currentFoir = income > 0 ? (obligations / income) * 100 : 0;

  // Reverse calculate maximum principal that corresponds to maxNewLoanEmi
  // EMI = P * r * (1+r)^n / ((1+r)^n - 1)
  // P = EMI * ((1+r)^n - 1) / (r * (1+r)^n)
  const monthlyRate = rate / 12 / 100;
  const factor = Math.pow(1 + monthlyRate, tenure);
  const maxPrincipal = maxNewLoanEmi > 0
    ? (maxNewLoanEmi * (factor - 1)) / (monthlyRate * factor)
    : 0;

  // Determine borrowing health status
  let healthStatus = 'excellent'; // 'excellent', 'moderate', 'stretched'
  if (currentFoir > 45) {
    healthStatus = 'stretched';
  } else if (currentFoir > 30) {
    healthStatus = 'moderate';
  }

  return {
    monthlyIncome: income,
    existingEmis: obligations,
    maxTotalAllowedEmi: Math.round(maxTotalAllowedEmi),
    maxNewLoanEmi: Math.round(maxNewLoanEmi),
    maxEligiblePrincipal: Math.round(maxPrincipal),
    currentFoirPercent: Number(currentFoir.toFixed(1)),
    maxFoirPercent: foirLimit * 100,
    healthStatus
  };
}

/**
 * Calculate Indian Home Loan Tax Savings under Section 80C & Section 24(b)
 * 
 * - Section 80C: Principal repayment deduction up to ₹1,50,000/year
 * - Section 24(b): Interest deduction up to ₹2,00,000/year (for self-occupied)
 * 
 * @param {number} annualPrincipalPaid - Annual principal repaid
 * @param {number} annualInterestPaid - Annual interest paid
 * @param {number} taxSlabPercent - Borrower's tax slab (e.g. 20% or 30%)
 */
export function calculateTaxSavings({
  annualPrincipalPaid,
  annualInterestPaid,
  taxSlabPercent = 30
}) {
  const principal = Math.max(0, Number(annualPrincipalPaid) || 0);
  const interest = Math.max(0, Number(annualInterestPaid) || 0);
  const slab = Math.min(40, Math.max(0, Number(taxSlabPercent) || 30)) / 100;

  const eligible80c = Math.min(150000, principal);
  const eligible24b = Math.min(200000, interest);

  const totalDeductions = eligible80c + eligible24b;
  const estimatedTaxSaved = Math.round(totalDeductions * slab);

  return {
    eligiblePrincipal80C: eligible80c,
    eligibleInterest24B: eligible24b,
    totalDeductions,
    estimatedTaxSaved,
    taxSlabPercent: slab * 100
  };
}

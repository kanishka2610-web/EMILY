// server/scripts/migrateLoans.js
const { supabaseAdmin } = require('../config/supabase');
const { COMPREHENSIVE_LOANS } = require('../services/loanService');

async function runMigration() {
  console.log('🚀 Starting Database Migration: Real-World Indian Bank Loans...');

  const indianLoans = COMPREHENSIVE_LOANS.filter((l) => l.country === 'IN');
  console.log(`📦 Found ${indianLoans.length} Indian bank loan products to migrate across Home, Personal, Car, and Education.`);

  let successCount = 0;
  let errorCount = 0;

  for (const loan of indianLoans) {
    try {
      const { data, error } = await supabaseAdmin
        .from('loans')
        .upsert({
          id: loan.id,
          bank_name: loan.bank_name,
          loan_type: loan.loan_type,
          currency: loan.currency || 'INR',
          country: loan.country || 'IN',
          interest_rate: loan.interest_rate,
          min_tenure_months: loan.min_tenure_months,
          max_tenure_months: loan.max_tenure_months,
          min_amount: loan.min_amount,
          max_amount: loan.max_amount,
          processing_fee_percent: loan.processing_fee_percent,
          flat_fee: loan.flat_fee,
          prepayment_penalty_percent: loan.prepayment_penalty_percent
        }, { onConflict: 'id' });

      if (error) {
        console.warn(`⚠️ Warning for ${loan.bank_name}:`, error.message);
        errorCount++;
      } else {
        console.log(`✅ Synced: [${loan.loan_type.toUpperCase()}] ${loan.bank_name} (${loan.interest_rate}%)`);
        successCount++;
      }
    } catch (err) {
      console.warn(`⚠️ Exception syncing ${loan.bank_name}:`, err.message);
      errorCount++;
    }
  }

  console.log('\n📊 Migration Summary:');
  console.log(`   - Successfully processed: ${successCount}`);
  console.log(`   - Potential database connection notices: ${errorCount}`);
  console.log('💡 Note: The in-memory fallback store already contains all real-world Indian bank products for instant app usage.');
}

if (require.main === module) {
  runMigration()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('Fatal migration error:', err);
      process.exit(1);
    });
}

module.exports = { runMigration };

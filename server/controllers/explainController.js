// server/controllers/explainController.js
const { GoogleGenAI } = require('@google/genai');

const geminiApiKey = process.env.GEMINI_API_KEY;

let ai = null;
if (geminiApiKey) {
  ai = new GoogleGenAI({
    apiKey: geminiApiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build'
      }
    }
  });
}

function getFallbackExplanation(comparisons, amount, tenureMonths) {
  const lowestCostLoan = comparisons.reduce((min, cur) => cur.totalCost < min.totalCost ? cur : min, comparisons[0]);
  const lowestEmiLoan = comparisons.reduce((min, cur) => cur.monthlyEmi < min.monthlyEmi ? cur : min, comparisons[0]);

  let fallbackText = `For a principal of ${Number(amount).toLocaleString()} over ${tenureMonths} months: ${lowestCostLoan.loan.bank_name} offers the lowest overall cost at ${lowestCostLoan.totalCost.toLocaleString()} (${lowestCostLoan.loan.interest_rate}% APR). `;
  if (lowestEmiLoan.loan.id !== lowestCostLoan.loan.id) {
    fallbackText += `If minimizing monthly outflow is your top priority, ${lowestEmiLoan.loan.bank_name} provides the lowest monthly payment at ${lowestEmiLoan.monthlyEmi.toLocaleString()}/mo.`;
  } else {
    fallbackText += `It also delivers the lowest monthly payment at ${lowestCostLoan.monthlyEmi.toLocaleString()}/mo, making it the most cost-effective option overall.`;
  }
  return fallbackText;
}

async function explainComparison(req, res) {
  try {
    const { comparisons, bestValue, amount, tenureMonths, language = 'en' } = req.body;

    if (!comparisons || !Array.isArray(comparisons) || comparisons.length < 2) {
      return res.status(400).json({ error: 'Valid comparison dataset with at least 2 loans is required' });
    }

    if (!ai) {
      return res.json({ explanation: getFallbackExplanation(comparisons, amount, tenureMonths) });
    }

    const loanDetails = comparisons.map(c => {
      return `- ${c.loan.bank_name}: Interest Rate ${c.loan.interest_rate}%, Monthly EMI ${c.monthlyEmi}, Total Interest ${c.totalInterest}, Processing Fees ${c.totalFees}, Total Cost ${c.totalCost}, Effective Cost ${c.effectiveCostPercent}%`;
    }).join('\n');

    const langInstruction = language && language !== 'en'
      ? ` Deliver your recommendation directly in language code "${language}" (or its native script).`
      : '';

    const prompt = `Here is a loan comparison for principal ${amount} over ${tenureMonths} months:\n${loanDetails}\n\nPlease provide a clear, plain-language recommendation comparing these loans. Focus on which loan is the cheapest overall, whether there's a trade-off between upfront fees and monthly payments, and an actionable tip for the borrower.${langInstruction} Keep the total explanation strictly under 120 words.`;

    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('AI request timeout')), 4000)
    );

    const generatePromise = ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: `You are an objective financial advisor helping consumers understand loan comparisons. Keep your language simple, direct, helpful, and strictly under 120 words.${langInstruction}`
      }
    });

    try {
      const response = await Promise.race([generatePromise, timeoutPromise]);
      const explanation = response.text ? response.text.trim() : getFallbackExplanation(comparisons, amount, tenureMonths);
      return res.json({ explanation });
    } catch (modelErr) {
      console.warn('Gemini explain notice (using fallback):', modelErr.message);
      return res.json({ explanation: getFallbackExplanation(comparisons, amount, tenureMonths) });
    }
  } catch (err) {
    console.error('Gemini explanation error:', err);
    res.status(500).json({ error: 'Failed to generate AI loan explanation: ' + (err.message || 'Service error') });
  }
}

module.exports = {
  explainComparison
};

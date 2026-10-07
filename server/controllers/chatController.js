// server/controllers/chatController.js
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

const SYSTEM_INSTRUCTION = `You are EMILY, an expert AI Financial Advisor and Loan Comparison Specialist.
Your capabilities:
1. Explain loan terms clearly: Reducing Balance vs Flat Interest Rate, Processing Fees, Foreclosure Charges, Prepayment Penalties, Loan-to-Value (LTV), and Debt-to-Income (DTI).
2. Deep knowledge of Indian Banking & Global Markets:
   - Indian banks (SBI, HDFC, ICICI, Axis, PNB, Kotak, Bank of Baroda).
   - Reserve Bank of India (RBI) guidelines, MCLR, Repo Linked Lending Rate (RLLR), CIBIL scores (750+ benchmark).
   - Global banks (Chase, Wells Fargo, Bank of America, FICO scores, APR disclosures).
3. Practical advice on how to improve credit scores (timely payments, keeping utilization under 30%, credit mix, avoiding multiple hard inquiries).
4. Strategies for loan prepayment and saving interest.

Keep your tone professional, friendly, empathetic, and direct. Break complex financial formulas down into plain language with bullet points where appropriate.`;

function getIntelligentFallback(message) {
  const lower = message.toLowerCase();
  if (lower.includes('cibil') || lower.includes('credit score') || lower.includes('fico')) {
    return "For Indian banks like SBI, HDFC, and ICICI, a CIBIL score of 750 or higher is considered optimal. Having 750+ unlocks the lowest benchmark interest rates (often 0.25% to 0.50% lower). To boost your score:\n1. Keep revolving credit utilization under 30%.\n2. Ensure zero delayed payments.\n3. Avoid applying to multiple banks within a short window.\n4. Maintain a balanced credit mix.";
  }
  if (lower.includes('reducing') || lower.includes('flat')) {
    return "In a Flat Rate loan, interest is calculated on the original principal throughout the entire duration. In a Reducing Balance loan, interest is only calculated on the remaining outstanding principal. Therefore, a 10% flat rate actually equals an effective interest rate of roughly 18% on a reducing balance basis. Always choose Reducing Balance loans!";
  }
  if (lower.includes('sbi') || lower.includes('hdfc')) {
    return "SBI and HDFC are both market leaders for Indian loans. SBI typically offers the lowest benchmark Repo-Linked Lending Rate (RLLR) and minimal processing fees. HDFC provides faster turnaround times and flexible customized eligibility. For floating-rate home loans, both are bound by RBI rules to have zero prepayment penalties.";
  }
  if (lower.includes('prepay') || lower.includes('foreclos')) {
    return "Prepaying your loan accelerates principal reduction. Because interest is charged on the outstanding balance, every extra dollar or rupee you pay goes 100% towards the principal. For floating-rate loans to individual borrowers, RBI mandates 0% prepayment charges. Paying just 1 extra EMI every year can shave 3 to 4 years off a 20-year loan!";
  }
  return "I am EMILY, your financial advisor. When comparing loans, always look beyond advertised rates: inspect processing fees, prepayment rules, and total cost over the entire tenure. Feel free to ask about credit scores (CIBIL/FICO), loan terms, or specific banks!";
}

async function handleChat(req, res) {
  try {
    const { message, history = [], language = 'en' } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'A message string is required.' });
    }

    if (!ai) {
      return res.json({ reply: getIntelligentFallback(message) });
    }

    // Build multi-turn contents array
    const contents = [];
    if (Array.isArray(history)) {
      for (const item of history) {
        if (item.text || item.content) {
          contents.push({
            role: item.role === 'model' || item.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: item.text || item.content }]
          });
        }
      }
    }

    contents.push({
      role: 'user',
      parts: [{ text: message }]
    });

    const langInstruction = language && language !== 'en'
      ? ` Please respond in language code "${language}" (or its native script) fluently and conversationally, while keeping financial terms and numbers accurate.`
      : '';

    // 4-second timeout promise
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('AI request timeout')), 4000)
    );

    const generatePromise = ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: contents,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION + langInstruction
      }
    });

    try {
      const response = await Promise.race([generatePromise, timeoutPromise]);
      const reply = response.text ? response.text.trim() : getIntelligentFallback(message);
      return res.json({ reply });
    } catch (modelErr) {
      console.warn('Gemini model call notice (using fallback):', modelErr.message);
      return res.json({ reply: getIntelligentFallback(message) });
    }
  } catch (err) {
    console.error('Chatbot error:', err);
    res.status(500).json({ error: 'AI Assistant temporarily unavailable: ' + err.message });
  }
}

module.exports = {
  handleChat
};

// server/controllers/translateController.js
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

const LANGUAGE_NAMES = {
  hi: 'Hindi',
  ta: 'Tamil',
  te: 'Telugu',
  bn: 'Bengali',
  mr: 'Marathi',
  es: 'Spanish',
  en: 'English'
};

async function handleTranslate(req, res) {
  try {
    const { text, targetLanguage = 'hi' } = req.body;

    if (!text || typeof text !== 'string') {
      return res.status(400).json({ error: 'Text string is required for translation.' });
    }

    if (targetLanguage === 'en') {
      return res.json({ translatedText: text });
    }

    const langName = LANGUAGE_NAMES[targetLanguage] || targetLanguage;

    if (!ai) {
      return res.json({ translatedText: text });
    }

    const prompt = `Translate the following financial loan text into ${langName} accurately, naturally, and conversationally. Maintain financial terms, currency amounts, and numbers precisely:\n\n"${text}"\n\nOutput only the translated text.`;

    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Translation timeout')), 3500)
    );

    const generatePromise = ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: `You are an expert financial translator specialized in banking, loans, and credit advisory across Indian and global languages. Deliver clean, accurate translations in ${langName}.`
      }
    });

    try {
      const response = await Promise.race([generatePromise, timeoutPromise]);
      const translated = response.text ? response.text.trim() : text;
      return res.json({ translatedText: translated });
    } catch (e) {
      return res.json({ translatedText: text });
    }
  } catch (err) {
    console.error('Translation error:', err);
    res.status(500).json({ error: 'Failed to translate: ' + err.message });
  }
}

module.exports = {
  handleTranslate
};

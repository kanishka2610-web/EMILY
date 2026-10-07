// client/src/i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      appName: 'EMILY',
      appSubtitle: 'Smart Loan Comparison Platform',
      browseLoans: 'Browse Loans',
      emiCalculator: 'EMI Calculator',
      compare: 'Compare',
      aiAdvisor: 'AI Advisor',
      savedComparisons: 'Saved Comparisons',
      signIn: 'Sign In',
      signOut: 'Sign Out',
      loanCategory: 'Loan Category',
      allLoanTypes: 'All Loan Types',
      homeLoan: 'Home Loan',
      personalLoan: 'Personal Loan',
      carLoan: 'Car Loan',
      educationLoan: 'Education Loan',
      marketRegion: 'Region / Market',
      allMarkets: 'All Markets (Global & India)',
      indiaMarket: '🇮🇳 India (SBI, HDFC, ICICI, etc.)',
      globalMarket: '🇺🇸 Global (Chase, BoA, Wells Fargo)',
      minRate: 'Min Rate (%)',
      maxRate: 'Max Rate (%)',
      sortBy: 'Sort By',
      defaultOrder: 'Default Order',
      lowestRate: 'Lowest Interest Rate',
      lowestFees: 'Lowest Processing Fees',
      searchBank: 'Search Bank Name...',
      interestRate: 'Interest Rate',
      benchmarkRate: 'Benchmark Rate',
      tenureRange: 'Tenure Range',
      amountRange: 'Amount Range',
      processingFee: 'Processing Fee',
      prepaymentPenalty: 'Prepayment Penalty',
      compareSelected: 'Compare Selected',
      clear: 'Clear',
      selectedOfMax: 'of 4 loans selected',
      selectAtLeast2: 'Select at least 2 loans to compare',
      readyToCompare: 'Ready for side-by-side comparison',
      monthlyEmi: 'Monthly EMI',
      totalInterest: 'Total Interest',
      totalCost: 'Total Cost (Payments + Fees)',
      effectiveCostPct: 'Effective Cost %',
      viewSchedule: 'View schedule',
      amortizationSchedule: 'Amortization Schedule',
      recalculate: 'Recalculate Comparison',
      saveComparison: 'Save Comparison',
      explainWithAi: 'Explain This Comparison',
      askEmilyAi: 'Ask EMILY AI',
      send: 'Send',
      loanTipsHeading: 'Borrowing Intelligence & Credit Mastery',
      loanTipsSubheading: 'Swipe to explore credit improvement tips, financial literacy insights, and interest-saving strategies.',
      allTips: 'All Tips',
      creditScoreTab: 'Credit Score (CIBIL)',
      financialLiteracyTab: 'Financial Literacy',
      prepaymentTab: 'Prepayment Tactics',
      tipKeyTakeaway: 'Key Takeaway',
      refreshRates: '↻ Refresh Live Rates',
      syncedToday: 'Synced Today at',
      realBankBenchmarks: '● Real Banking Benchmarks (SBI, HDFC, ICICI, Axis, BoB, Chase)',
      checkEligibility: '🎯 Check My Loan Eligibility (FOIR)',
      exportReport: '🖨️ Export / Print Report'
    }
  },
  hi: {
    translation: {
      appName: 'EMILY',
      appSubtitle: 'स्मार्ट लोन तुलना मंच',
      browseLoans: 'ऋण देखें',
      emiCalculator: 'ईएमआई कैलकुलेटर',
      compare: 'तुलना करें',
      aiAdvisor: 'एआई सलाहकार',
      savedComparisons: 'सहेजी गई तुलनाएँ',
      signIn: 'साइन इन करें',
      signOut: 'साइन आउट',
      loanCategory: 'ऋण की श्रेणी',
      allLoanTypes: 'सभी प्रकार के ऋण',
      homeLoan: 'होम लोन (गृह ऋण)',
      personalLoan: 'पर्सनल लोन (व्यक्तिगत ऋण)',
      carLoan: 'कार लोन (वाहन ऋण)',
      educationLoan: 'शिक्षा ऋण',
      marketRegion: 'बाज़ार / क्षेत्र',
      allMarkets: 'सभी बाज़ार (भारत और वैश्विक)',
      indiaMarket: '🇮🇳 भारत (SBI, HDFC, ICICI, आदि)',
      globalMarket: '🇺🇸 वैश्विक (Chase, BoA, Wells Fargo)',
      minRate: 'न्यूनतम ब्याज दर (%)',
      maxRate: 'अधिकतम ब्याज दर (%)',
      sortBy: 'क्रमबद्ध करें',
      defaultOrder: 'डिफ़ॉल्ट क्रम',
      lowestRate: 'सबसे कम ब्याज दर',
      lowestFees: 'सबसे कम प्रोसेसिंग शुल्क',
      searchBank: 'बैंक का नाम खोजें...',
      interestRate: 'ब्याज दर',
      benchmarkRate: 'बेंचमार्क दर',
      tenureRange: 'अवधि सीमा',
      amountRange: 'ऋण राशि सीमा',
      processingFee: 'प्रोसेसिंग शुल्क',
      prepaymentPenalty: 'पूर्वभुगतान जुर्माना',
      compareSelected: 'चयनित की तुलना करें',
      clear: 'साफ़ करें',
      selectedOfMax: 'में से 4 ऋण चुने गए',
      selectAtLeast2: 'तुलना के लिए कम से कम 2 ऋण चुनें',
      readyToCompare: 'तुलना के लिए तैयार',
      monthlyEmi: 'मासिक किस्त (EMI)',
      totalInterest: 'कुल ब्याज',
      totalCost: 'कुल लागत (भुगतान + शुल्क)',
      effectiveCostPct: 'प्रभावी लागत %',
      viewSchedule: 'भुगतान अनुसूची देखें',
      amortizationSchedule: 'ऋण परिशोधन अनुसूची',
      recalculate: 'पुनः गणना करें',
      saveComparison: 'तुलना सहेजें',
      explainWithAi: 'AI से समझें',
      askEmilyAi: 'EMILY AI से पूछें',
      send: 'भेजें',
      loanTipsHeading: 'उधार बुद्धिमत्ता और क्रेडिट स्कोर मार्गदर्शन',
      loanTipsSubheading: 'क्रेडिट स्कोर (CIBIL) सुधारने और वित्तीय समझ बढ़ाने के लिए कार्ड स्वाइप करें।',
      allTips: 'सभी टिप्स',
      creditScoreTab: 'क्रेडिट स्कोर (CIBIL)',
      financialLiteracyTab: 'वित्तीय साक्षरता',
      prepaymentTab: 'पूर्वभुगतान रणनीतियाँ',
      tipKeyTakeaway: 'मुख्य सीख',
      refreshRates: '↻ लाइव दरें ताज़ा करें',
      syncedToday: 'आज अपडेट हुआ:',
      realBankBenchmarks: '● वास्तविक बैंक बेंचमार्क (SBI, HDFC, ICICI, Axis)',
      checkEligibility: '🎯 मेरी ऋण पात्रता जांचें (FOIR)',
      exportReport: '🖨️ रिपोर्ट प्रिंट / निर्यात करें'
    }
  }
};

const savedLang = localStorage.getItem('i18nextLng') || localStorage.getItem('emily_lang') || 'en';
const initialLang = savedLang.startsWith('hi') ? 'hi' : 'en';

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: initialLang,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

i18n.on('languageChanged', (lng) => {
  localStorage.setItem('i18nextLng', lng);
  localStorage.setItem('emily_lang', lng);
});

export default i18n;

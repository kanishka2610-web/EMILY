// client/src/components/LoanTips.jsx
import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import './LoanTips.css';

const FINANCIAL_TIPS_DATA = [
  {
    id: 1,
    category: 'credit',
    tag: 'Credit Score',
    title: 'CIBIL 750+ Unlocks 0.5% Lower Rates',
    desc: 'Indian banks (SBI, HDFC, ICICI) tier their interest rates directly by your CIBIL score. A score of 750 or above unlocks prime interest concessions, saving ₹3 Lakh to ₹6 Lakhs over a 20-year home loan.',
    takeaway: 'Check your CIBIL score quarterly and correct discrepancies before loan shopping.'
  },
  {
    id: 2,
    category: 'credit',
    tag: 'Credit Score',
    title: 'The 30% Credit Utilization Golden Rule',
    desc: 'Using more than 30% of your total credit card limit triggers an automated risk alert to credit bureaus. Paying card balances before the billing cycle date instantly boosts your score within 30-45 days.',
    takeaway: 'Pay down balances mid-month to keep reported utilization strictly below 30%.'
  },
  {
    id: 3,
    category: 'literacy',
    tag: 'Financial Literacy',
    title: 'Reducing Balance vs. Flat Rate Trap',
    desc: 'Unregulated NBFCs often market personal loans with flat rates (e.g. 9.5%). On a flat rate, interest never reduces even as you pay down the loan. In reality, a 9.5% flat rate equals ~17.5% reducing rate.',
    takeaway: 'Never sign a loan without confirming it operates on a Monthly Reducing Balance basis.'
  },
  {
    id: 4,
    category: 'tax',
    tag: 'Tax Strategy',
    title: 'Maximize Section 80C & 24(b) Tax Deductions',
    desc: 'In India, home loan borrowers can claim up to ₹1.5 Lakhs on principal repayment under Section 80C and up to ₹2 Lakhs on interest under Section 24(b) annually, significantly reducing tax liability.',
    takeaway: 'Joint home loans allow both co-borrowers to claim individual tax deductions, doubling benefits!'
  },
  {
    id: 5,
    category: 'literacy',
    tag: 'Financial Literacy',
    title: 'The 40% EMI-to-Income Safety Limit',
    desc: 'Prudent financial planning dictates that your total Equated Monthly Installments across all personal, car, and home loans should never exceed 40% to 50% of your net monthly take-home salary.',
    takeaway: 'Maintain an emergency fund covering 6 months of EMIs in liquid funds before taking fresh debt.'
  },
  {
    id: 6,
    category: 'credit',
    tag: 'Credit Score',
    title: 'Avoid Multiple "Hard Inquiries" in 30 Days',
    desc: 'Applying to 4 different banks in the same week creates 4 separate hard inquiries on your CIBIL report, dropping your score by 15-25 points. Use platforms like EMILY for preliminary comparison first.',
    takeaway: 'Shortlist 1 or 2 ideal lenders on EMILY before submitting formal loan documentation.'
  },
  {
    id: 7,
    category: 'tax',
    tag: 'Indian Banking',
    title: 'Special Concessions for Women Borrowers',
    desc: 'Premier Indian public and private sector banks (SBI, PNB, Canara Bank) provide a 0.05% interest rate discount when a woman is the sole or primary applicant on a residential mortgage.',
    takeaway: 'List a female family member as primary applicant to save on both interest and property stamp duty.'
  },
  {
    id: 8,
    category: 'literacy',
    tag: 'Financial Literacy',
    title: 'Zero Prepayment Penalty on Floating Rates',
    desc: 'Under official Reserve Bank of India (RBI) mandates, banks cannot levy foreclosure or part-prepayment charges on floating-rate individual home or car loans. You can prepay whenever you receive a bonus.',
    takeaway: 'Paying just 1 extra EMI every year cuts a 20-year loan tenure down to approximately 16 years!'
  }
];

export function LoanTips() {
  const { t } = useLanguage();
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeIndex, setActiveIndex] = useState(0);
  const trackRef = useRef(null);

  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeftStart = useRef(0);

  const filteredTips = activeCategory === 'all'
    ? FINANCIAL_TIPS_DATA
    : FINANCIAL_TIPS_DATA.filter((item) => item.category === activeCategory);

  const handleScroll = () => {
    if (trackRef.current) {
      const scrollPos = trackRef.current.scrollLeft;
      const cardWidth = 355; // card width + gap
      const index = Math.round(scrollPos / cardWidth);
      setActiveIndex(Math.min(Math.max(index, 0), filteredTips.length - 1));
    }
  };

  useEffect(() => {
    const track = trackRef.current;
    if (track) {
      track.addEventListener('scroll', handleScroll, { passive: true });
      return () => track.removeEventListener('scroll', handleScroll);
    }
  }, [filteredTips.length]);

  // Touch and mouse drag functionality for swipeable carousel
  const handleMouseDown = (e) => {
    isDragging.current = true;
    startX.current = e.pageX - trackRef.current.offsetLeft;
    scrollLeftStart.current = trackRef.current.scrollLeft;
  };

  const handleMouseLeave = () => {
    isDragging.current = false;
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  const handleMouseMove = (e) => {
    if (!isDragging.current) return;
    e.preventDefault();
    const x = e.pageX - trackRef.current.offsetLeft;
    const walk = (x - startX.current) * 1.5;
    trackRef.current.scrollLeft = scrollLeftStart.current - walk;
  };

  const scrollLeft = () => {
    if (trackRef.current) {
      trackRef.current.scrollBy({ left: -355, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (trackRef.current) {
      trackRef.current.scrollBy({ left: 355, behavior: 'smooth' });
    }
  };

  const scrollToCard = (index) => {
    if (trackRef.current) {
      trackRef.current.scrollTo({ left: index * 355, behavior: 'smooth' });
    }
  };

  const getTagClass = (category) => {
    switch (category) {
      case 'credit': return 'tag-credit';
      case 'literacy': return 'tag-literacy';
      case 'tax': return 'tag-tax';
      default: return 'tag-literacy';
    }
  };

  return (
    <section className="loan-tips-section">
      <div className="tips-header">
        <div className="tips-title-group">
          <h2 className="tips-heading">
            {t('loanTipsHeading')}
          </h2>
          <p className="tips-subheading">
            {t('loanTipsSubheading')}
          </p>
        </div>

        <div className="tips-controls">
          <div className="category-filter-pills">
            <button
              type="button"
              className={`pill-btn ${activeCategory === 'all' ? 'active' : ''}`}
              onClick={() => {
                setActiveCategory('all');
                scrollToCard(0);
              }}
            >
              {t('allTips')}
            </button>
            <button
              type="button"
              className={`pill-btn ${activeCategory === 'credit' ? 'active' : ''}`}
              onClick={() => {
                setActiveCategory('credit');
                scrollToCard(0);
              }}
            >
              {t('creditScoreTab')}
            </button>
            <button
              type="button"
              className={`pill-btn ${activeCategory === 'literacy' ? 'active' : ''}`}
              onClick={() => {
                setActiveCategory('literacy');
                scrollToCard(0);
              }}
            >
              {t('financialLiteracyTab')}
            </button>
            <button
              type="button"
              className={`pill-btn ${activeCategory === 'tax' ? 'active' : ''}`}
              onClick={() => {
                setActiveCategory('tax');
                scrollToCard(0);
              }}
            >
              Tax & Concessions
            </button>
          </div>

          <div className="nav-buttons">
            <button
              type="button"
              className="btn-carousel-nav"
              onClick={scrollLeft}
              aria-label="Previous tip card"
            >
              ‹
            </button>
            <button
              type="button"
              className="btn-carousel-nav"
              onClick={scrollRight}
              aria-label="Next tip card"
            >
              ›
            </button>
          </div>
        </div>
      </div>

      {/* Swipeable Carousel Track */}
      <div
        className="carousel-track-wrapper"
        ref={trackRef}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
      >
        <div className="carousel-track">
          {filteredTips.map((tip, idx) => (
            <article key={tip.id} className="tip-card">
              <div className="tip-card-top">
                <span className={`tip-tag ${getTagClass(tip.category)}`}>
                  {tip.tag}
                </span>
                <span className="tip-number">0{idx + 1}</span>
              </div>

              <h3 className="tip-card-title">{tip.title}</h3>

              <p className="tip-card-desc">{tip.desc}</p>

              <div className="tip-takeaway">
                {t('tipKeyTakeaway')}: {tip.takeaway}
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Interactive Dot indicators */}
      <div className="carousel-dots">
        {filteredTips.map((_, dotIdx) => (
          <button
            key={dotIdx}
            type="button"
            className={`dot-indicator ${activeIndex === dotIdx ? 'active' : ''}`}
            onClick={() => scrollToCard(dotIdx)}
            aria-label={`Go to tip slide ${dotIdx + 1}`}
          />
        ))}
      </div>
    </section>
  );
}

export default LoanTips;

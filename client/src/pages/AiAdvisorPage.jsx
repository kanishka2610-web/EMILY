// client/src/pages/AiAdvisorPage.jsx
import React, { useState, useRef, useEffect } from 'react';
import { sendChatMessage } from '../services/api';
import { useTranslation } from 'react-i18next';
import './AiAdvisorPage.css';

const INITIAL_MESSAGES = [
  {
    role: 'model',
    content: "Hello! I am EMILY, your AI Financial Advisor. How can I assist your borrowing strategy today? You can ask me to compare Indian banks (SBI vs HDFC), explain prepayment mathematics, share tactics to elevate your CIBIL score above 750, or calculate your safe debt-to-income limits."
  }
];

const ADVICE_TOPICS = [
  {
    title: 'Boost CIBIL Score (750+)',
    prompt: 'What are the most effective steps to improve my CIBIL credit score above 750 in 60-90 days?'
  },
  {
    title: 'Reducing Balance vs Flat Rate',
    prompt: 'Explain the real difference between Reducing Balance EMI and Flat Interest Rate with a numerical example.'
  },
  {
    title: 'SBI vs HDFC Home Loan',
    prompt: 'Compare State Bank of India (SBI) and HDFC Bank Home Loans on rates, processing fees, and prepayment rules.'
  },
  {
    title: 'Tax Deductions (80C & 24b)',
    prompt: 'How do tax deductions on home loan principal (Section 80C) and interest (Section 24b) work in India?'
  },
  {
    title: 'Prepayment Savings Strategy',
    prompt: 'How much interest and loan tenure can I save by paying one extra EMI every year on a 20-year loan?'
  }
];

export function AiAdvisorPage() {
  const { t, i18n } = useTranslation();
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const threadEndRef = useRef(null);

  const activeLang = i18n.language && i18n.language.startsWith('hi') ? 'hi' : 'en';

  const scrollToBottom = () => {
    if (threadEndRef.current) {
      threadEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSendMessage = async (textToSend) => {
    const text = (textToSend || inputText).trim();
    if (!text || loading) return;

    const userMessage = { role: 'user', content: text };
    const newHistory = [...messages, userMessage];

    setMessages(newHistory);
    setInputText('');
    setLoading(true);

    try {
      const response = await sendChatMessage(
        messages.map((m) => ({ role: m.role, text: m.content })),
        text,
        activeLang
      );

      const aiReply = response.reply || 'I could not generate an answer right now.';
      setMessages([...newHistory, { role: 'model', content: aiReply }]);
    } catch (err) {
      setMessages([
        ...newHistory,
        {
          role: 'model',
          content: 'Sorry, I encountered an issue retrieving financial advice: ' + (err.message || 'Service error')
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSendMessage();
  };

  return (
    <div className="ai-advisor-page">
      <section className="advisor-hero">
        <div className="advisor-hero-text">
          <h1>{t('aiAdvisor')}</h1>
          <p>
            Objective, AI-powered financial advisory for loan selection, credit score mastery, and borrowing strategies.
          </p>
        </div>
        <div className="advisor-badge-pill">
          <span>● Powered by Gemini Financial Intelligence</span>
        </div>
      </section>

      <div className="advisor-layout-grid">
        {/* Sidebar Topics */}
        <aside className="advisor-topics-sidebar">
          <span className="topics-sidebar-title">Advisory Topics</span>
          <div className="topics-list">
            {ADVICE_TOPICS.map((topic, idx) => (
              <button
                key={idx}
                type="button"
                className="topic-item-btn"
                onClick={() => handleSendMessage(topic.prompt)}
                disabled={loading}
              >
                {topic.title}
              </button>
            ))}
          </div>
        </aside>

        {/* Main Conversation Container */}
        <section className="advisor-chat-card">
          <div className="chat-messages-scroll">
            {messages.map((msg, index) => (
              <div key={index} className={`advisor-bubble ${msg.role}`}>
                {msg.content}
              </div>
            ))}
            {loading && (
              <div className="advisor-typing-notice">
                EMILY is analyzing loan terms and calculating recommendations...
              </div>
            )}
            <div ref={threadEndRef} />
          </div>

          {/* Quick starter chips */}
          <div className="advisor-starters-bar">
            {ADVICE_TOPICS.slice(0, 3).map((item, idx) => (
              <button
                key={idx}
                type="button"
                className="advisor-chip-btn"
                onClick={() => handleSendMessage(item.prompt)}
                disabled={loading}
              >
                {item.title}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="advisor-input-bar">
            <input
              type="text"
              className="advisor-text-input"
              placeholder="Ask about loans, CIBIL, EMIs, or banks..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              disabled={loading}
            />
            <button
              type="submit"
              className="advisor-send-btn"
              disabled={loading || !inputText.trim()}
            >
              {t('send')}
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}

export default AiAdvisorPage;

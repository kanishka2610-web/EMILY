// client/src/components/Chatbot.jsx
import React, { useState, useRef, useEffect } from 'react';
import { sendChatMessage } from '../services/api';
import { useLanguage } from '../context/LanguageContext';
import './Chatbot.css';

const INITIAL_MESSAGES = [
  {
    role: 'model',
    content: "Hi there! I am EMILY, your AI Financial Advisor. Ask me anything about Indian or Global loans, CIBIL credit score improvement, reducing balance EMI, or prepayment strategies!"
  }
];

const STARTER_PROMPTS = [
  "How to get CIBIL score above 750?",
  "Reducing Balance vs Flat Rate",
  "Compare SBI vs HDFC Home Loan",
  "How does prepayment save money?"
];

export function Chatbot() {
  const { language, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const threadEndRef = useRef(null);

  const scrollToBottom = () => {
    if (threadEndRef.current) {
      threadEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, loading]);

  const handleSendMessage = async (textToSend) => {
    const text = (textToSend || inputText).trim();
    if (!text || loading) return;

    const userMessage = { role: 'user', content: text };
    const newHistory = [...messages, userMessage];

    setMessages(newHistory);
    setInputText('');
    setLoading(true);

    try {
      // Send conversation history and active language to server Gemini endpoint
      const response = await sendChatMessage(
        messages.map((m) => ({ role: m.role, text: m.content })),
        text,
        language
      );

      const aiReply = response.reply || 'I could not generate an answer right now.';
      setMessages([...newHistory, { role: 'model', content: aiReply }]);
    } catch (err) {
      setMessages([
        ...newHistory,
        {
          role: 'model',
          content: 'Sorry, I encountered an issue retrieving financial data: ' + (err.message || 'Network error')
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
    <>
      {/* Floating launcher button */}
      {!isOpen && (
        <button
          type="button"
          className="chatbot-launcher"
          onClick={() => setIsOpen(true)}
          aria-label="Open EMILY AI Financial Advisor"
        >
          <span className="launcher-badge"></span>
          <span>{t('askEmilyAi')}</span>
        </button>
      )}

      {/* Floating Chat Modal */}
      {isOpen && (
        <div className="chatbot-window">
          <div className="chat-header">
            <div className="chat-header-title">
              <div className="chat-avatar">E</div>
              <div>
                <div className="chat-name">EMILY AI Advisor</div>
                <div className="chat-status">Multilingual NLP Active</div>
              </div>
            </div>
            <button
              type="button"
              className="chat-close-btn"
              onClick={() => setIsOpen(false)}
              aria-label="Close Chat"
            >
              ×
            </button>
          </div>

          <div className="chat-thread">
            {messages.map((msg, index) => (
              <div key={index} className={`chat-bubble ${msg.role}`}>
                {msg.content}
              </div>
            ))}
            {loading && (
              <div className="chat-typing">
                EMILY is analyzing loan terms in {language.toUpperCase()}...
              </div>
            )}
            <div ref={threadEndRef} />
          </div>

          {/* Quick starter chips */}
          <div className="starter-chips-container">
            {STARTER_PROMPTS.map((prompt, idx) => (
              <button
                key={idx}
                type="button"
                className="starter-chip"
                onClick={() => handleSendMessage(prompt)}
                disabled={loading}
              >
                {prompt}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="chat-input-form">
            <input
              type="text"
              className="chat-input"
              placeholder="Ask about loans, CIBIL, EMIs..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              disabled={loading}
            />
            <button
              type="submit"
              className="chat-send-btn"
              disabled={loading || !inputText.trim()}
            >
              {t('send')}
            </button>
          </form>
        </div>
      )}
    </>
  );
}

export default Chatbot;

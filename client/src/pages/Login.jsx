// client/src/pages/Login.jsx
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Login.css';

export function Login() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [message, setMessage] = useState('');

  const { user, signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  useEffect(() => {
    if (user) {
      navigate(from, { replace: true });
    }
  }, [user, navigate, from]);

  useEffect(() => {
    if (cooldown <= 0) return undefined;
    const timer = window.setInterval(() => {
      setCooldown((current) => Math.max(0, current - 1));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [cooldown]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (isSignUp && cooldown > 0) {
      setError(`Please wait ${cooldown} seconds before requesting another confirmation email.`);
      return;
    }

    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    setLoading(true);
    try {
      if (isSignUp) {
        await signUp(email, password);
        setCooldown(60);
        setMessage('Confirmation email sent. Check your inbox and use the latest link. You can request another email after 60 seconds.');
      } else {
        await signIn(email, password);
        navigate(from, { replace: true });
      }
    } catch (err) {
      const errorMessage = err?.message?.toLowerCase() || '';
      if (errorMessage.includes('rate limit') || errorMessage.includes('too many requests')) {
        setCooldown(60);
        setError('Supabase has temporarily limited confirmation emails. Please wait a minute, then try again with the same email.');
      } else {
        setError(err.message || 'Authentication failed. Please verify credentials.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-header">
          <h1>{isSignUp ? 'Create an Account' : 'Welcome Back'}</h1>
          <p>
            {isSignUp
              ? 'Sign up to save and track your loan comparisons'
              : 'Sign in to access your saved comparisons'}
          </p>
        </div>

        {error && <div className="status-error">{error}</div>}
        {message && <div className="status-success">{message}</div>}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@example.com"
              required
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              autoComplete={isSignUp ? 'new-password' : 'current-password'}
            />
          </div>

          <button type="submit" className="login-btn" disabled={loading || (isSignUp && cooldown > 0)}>
            {loading ? 'Processing...' : isSignUp && cooldown > 0 ? `Try again in ${cooldown}s` : isSignUp ? 'Sign Up' : 'Sign In'}
          </button>
        </form>

        <div className="login-toggle">
          <span>
            {isSignUp ? 'Already have an account?' : "Don't have an account yet?"}
          </span>
          <button
            type="button"
            className="toggle-link"
            onClick={() => {
              setIsSignUp(!isSignUp);
              setError('');
              setMessage('');
            }}
          >
            {isSignUp ? 'Sign In' : 'Sign Up'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;

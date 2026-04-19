import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { registerCustomer, loginCustomer, getCustomer, logoutCustomer } from '../lib/customerAuth';
import './AuthModal.css';

const AuthModal = ({ isOpen, onClose, onAuthChange }) => {
  const [tab, setTab] = useState('login'); // 'login' | 'register'
  const [form, setForm] = useState({ email: '', password: '', firstName: '', lastName: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (isOpen) {
      setError('');
      setSuccess('');
      setForm({ email: '', password: '', firstName: '', lastName: '' });
    }
  }, [isOpen, tab]);

  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      if (tab === 'register') {
        await registerCustomer(form);
        // Auto-login after register
        await loginCustomer({ email: form.email, password: form.password });
        setSuccess('Account created! Welcome to Da Bird.');
      } else {
        await loginCustomer({ email: form.email, password: form.password });
        setSuccess('Welcome back!');
      }
      const customer = await getCustomer();
      onAuthChange(customer);
      setTimeout(onClose, 1200);
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="auth-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <div className="auth-modal-wrapper">
          <motion.div
            className="auth-modal"
            initial={{ opacity: 0, y: 30, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
          >
            {/* Header */}
            <div className="auth-modal-header">
              <div className="auth-logo">DA BIRD</div>
              <button className="auth-close" onClick={onClose}>✕</button>
            </div>

            {/* Tabs */}
            <div className="auth-tabs">
              <button
                className={`auth-tab ${tab === 'login' ? 'active' : ''}`}
                onClick={() => setTab('login')}
              >
                SIGN IN
              </button>
              <button
                className={`auth-tab ${tab === 'register' ? 'active' : ''}`}
                onClick={() => setTab('register')}
              >
                CREATE ACCOUNT
              </button>
            </div>

            {/* Form */}
            <form className="auth-form" onSubmit={handleSubmit}>
              <AnimatePresence mode="wait">
                {tab === 'register' && (
                  <motion.div
                    key="names"
                    className="auth-name-row"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="auth-field">
                      <label>FIRST NAME</label>
                      <input
                        type="text"
                        name="firstName"
                        value={form.firstName}
                        onChange={handleChange}
                        placeholder="Flip"
                        required={tab === 'register'}
                        autoComplete="given-name"
                      />
                    </div>
                    <div className="auth-field">
                      <label>LAST NAME</label>
                      <input
                        type="text"
                        name="lastName"
                        value={form.lastName}
                        onChange={handleChange}
                        placeholder="Bird"
                        required={tab === 'register'}
                        autoComplete="family-name"
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="auth-field">
                <label>EMAIL</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="flip@dabird.net"
                  required
                  autoComplete="email"
                />
              </div>

              <div className="auth-field">
                <label>PASSWORD</label>
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  minLength={5}
                  autoComplete={tab === 'register' ? 'new-password' : 'current-password'}
                />
              </div>

              {error && (
                <motion.p
                  className="auth-error"
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {error}
                </motion.p>
              )}

              {success && (
                <motion.p
                  className="auth-success"
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {success}
                </motion.p>
              )}

              <button className="auth-submit" type="submit" disabled={loading}>
                {loading ? (
                  <span className="auth-spinner" />
                ) : tab === 'login' ? 'SIGN IN' : 'CREATE ACCOUNT'}
              </button>
            </form>

            {/* Footer */}
            <p className="auth-footer-note">
              {tab === 'login' ? (
                <>Don't have an account?{' '}
                  <span onClick={() => setTab('register')}>Create one</span>
                </>
              ) : (
                <>Already have an account?{' '}
                  <span onClick={() => setTab('login')}>Sign in</span>
                </>
              )}
            </p>
          </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AuthModal;

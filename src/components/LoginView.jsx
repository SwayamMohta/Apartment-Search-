// src/components/LoginView.jsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './LoginView.css';

const LoginView = ({ isOpen, onClose }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '', full_name: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login, register } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isRegister) {
        await register(formData);
      } else {
        await login({ email: formData.email, password: formData.password });
      }
      onClose();
    } catch (err) {
      if (err.response?.data?.error?.code === 'VALIDATION_ERROR' && err.response.data.error.details) {
        const details = err.response.data.error.details;
        setError(details.map(d => d.message).join('. '));
      } else {
        setError(err.response?.data?.error?.message || 'Authentication failed');
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="login-overlay" onClick={onClose}>
      <motion.div 
        className="editorial-login-modal" 
        onClick={e => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.98 }}
        transition={{ duration: 0.3 }}
      >
        <button className="close-x" onClick={onClose} aria-label="Close">
          <X size={20} strokeWidth={1} />
        </button>
        
        <div className="login-header">
          <span className="login-category">Access</span>
          <h2>{isRegister ? 'Join the Collection' : 'Member Access'}</h2>
          <p className="login-subtitle">
            {isRegister 
              ? 'Create an account to curate your private collection of homes.' 
              : 'Sign in to access your saved homes and preferences.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {isRegister ? (
            <div className="login-form-grid">
              <div className="input-group">
                <label>Legal Name</label>
                <input 
                  type="text" 
                  placeholder="Sofia Rossi" 
                  value={formData.full_name}
                  onChange={e => setFormData({...formData, full_name: e.target.value})}
                  required
                />
              </div>
              <div className="input-group">
                <label>Email Address</label>
                <input 
                  type="email" 
                  placeholder="sofia@example.com" 
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                  required
                />
              </div>
            </div>
          ) : (
            <div className="input-group">
              <label>Email Address</label>
              <input 
                type="email" 
                placeholder="sofia@example.com" 
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
                required
              />
            </div>
          )}

          <div className="input-group">
            <label>Secure Password</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              value={formData.password}
              onChange={e => setFormData({...formData, password: e.target.value})}
              required
            />
            {isRegister && (
              <p className="field-hint">8+ chars, with an uppercase letter and a number.</p>
            )}
          </div>

          {error && (
            <div className="login-error">
              {error}
            </div>
          )}

          <button type="submit" className="btn-primary w-full" disabled={loading}>
            {loading ? 'Authenticating...' : (isRegister ? 'Register' : 'Authenticate')}
          </button>
        </form>

        <div className="login-footer">
          <p>
            {isRegister ? 'Already a member?' : 'New here?'} 
            <button className="toggle-btn" onClick={() => setIsRegister(!isRegister)}>
              {isRegister ? 'Sign In' : 'Create Account'}
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginView;

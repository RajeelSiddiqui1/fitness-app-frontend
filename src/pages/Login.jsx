import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react';
import GlassCard from '../components/GlassCard';
import ThemeToggle from '../components/ThemeToggle';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
   const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await login(formData.email, formData.password);
      
      if (result.success) {
        navigate('/dashboard');
      } else {
        setError(result.error);
        
        if (result.error.includes('not verified') || result.error.includes('verify')) {
          setTimeout(() => {
            navigate('/verify-otp', { state: { email: formData.email } });
          }, 2000);
        }
      }
    } catch (err) {
      const message = err.response?.data?.message || 'Login failed. Please try again.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{ background: 'var(--theme-bg)' }}
    >
      <div className="bg-orb bg-orb-1" />
      <div className="bg-orb bg-orb-2" />
      <div className="bg-orb bg-orb-3" />

      <div className="absolute top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      <GlassCard className="w-full max-w-md p-8 relative z-10">
        {error && (
          <div 
            className="mb-4 p-3 rounded-xl text-sm"
            style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--theme-error)', border: '1px solid rgba(239, 68, 68, 0.3)' }}
          >
            {error}
          </div>
        )}

        <div className="text-center mb-8">
          <div 
            className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
            style={{ background: theme.gradient }}
          >
            <span className="text-3xl">💪</span>
          </div>
          <h1 className="text-3xl font-bold gradient-text mb-2">Welcome Back</h1>
          <p style={{ color: 'var(--theme-textSecondary)' }}>
            Sign in to continue your fitness journey
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label 
              className="block text-sm font-medium mb-2"
              style={{ color: 'var(--theme-textSecondary)' }}
            >
              email
            </label>
            <div className="relative">
              <User 
                className="absolute left-3 top-1/2 transform -translate-y-1/2" 
                size={18} 
                style={{ color: 'var(--theme-textMuted)' }} 
              />
              <input
                type="text"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className="theme-input w-full pl-10 pr-4 py-3"
              />
            </div>
          </div>

          <div>
            <label 
              className="block text-sm font-medium mb-2"
              style={{ color: 'var(--theme-textSecondary)' }}
            >
              Password
            </label>
            <div className="relative">
              <Lock 
                className="absolute left-3 top-1/2 transform -translate-y-1/2" 
                size={18} 
                style={{ color: 'var(--theme-textMuted)' }} 
              />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className="theme-input w-full pl-10 pr-12 py-3"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
                style={{ color: 'var(--theme-textMuted)' }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-center">

            <button 
              type="button"
              onClick={() => navigate('/forgot-password')}
              className="text-sm font-medium hover:underline"
              style={{ color: 'var(--theme-primary)' }}
            >
              Forgot password?
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-3.5 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span>Signing in...</span>
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

       

        

        <p className="text-center mt-6" style={{ color: 'var(--theme-textSecondary)' }}>
          Don't have an account?{' '}
          <button 
            onClick={() => navigate('/register')}
            className="font-medium hover:underline"
            style={{ color: 'var(--theme-primary)' }}
          >
            Sign up
          </button>
        </p>
      </GlassCard>
    </div>
  );
};

export default Login;
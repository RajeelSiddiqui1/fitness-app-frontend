import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User, ArrowRight } from 'lucide-react';
import { toast } from 'react-hot-toast';
import GlassCard from '../components/GlassCard';
import ThemeToggle from '../components/ThemeToggle';
import { useTheme } from '../contexts/ThemeContext';
import { axiosInstance } from '../lib/axios';

const Register = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    userName: '',
    email: '',
    password: '',
    confirmPassword: '',
    age: '',
    gender: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (!formData.userName || !formData.email || !formData.password || !formData.confirmPassword) {
      toast.error('Please fill in all required fields');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return false;
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error('Please enter a valid email address');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      const response = await axiosInstance.post('/auth/register', {
        userName: formData.userName,
        email: formData.email,
        password: formData.password,
        age: formData.age || undefined,
        gender: formData.gender || undefined
      });

      // Show success toast
      toast.success(response.data.message || 'Registration successful! OTP sent to your email.');

      // Navigate to OTP verification
      setTimeout(() => {
        navigate('/verify-otp', { state: { email: formData.email } });
      }, 1500);

    } catch (err) {
      const status = err.response?.status;
      const message = err.response?.data?.message || 'Registration failed. Please try again.';

      // Handle different error cases with specific toast messages
      if (status === 409) {
        toast.error('This username is already taken. Please choose another one.');
      } else if (status === 400 && message.includes('already exists')) {
        toast.error('An account with this email already exists. Please login instead.');
      } else if (status === 200 && message.includes('not verified')) {
        // Special case for unverified users - treat as success
        toast.success('Account found but not verified. New OTP has been sent to your email.');
        setTimeout(() => {
          navigate('/verify-otp', { state: { email: formData.email } });
        }, 1500);
        return;
      } else {
        toast.error(message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 py-12 relative overflow-hidden"
      style={{ background: 'var(--theme-bg)' }}
    >
      <div className="bg-orb bg-orb-1" />
      <div className="bg-orb bg-orb-2" />
      <div className="bg-orb bg-orb-3" />

      <div className="absolute top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      <GlassCard className="w-full max-w-md p-8 relative z-10">
        <div className="text-center mb-6">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
            style={{ background: theme.gradient }}
          >
            <span className="text-3xl">💪</span>
          </div>
          <h1 className="text-3xl font-bold gradient-text mb-2">Create Account</h1>
          <p style={{ color: 'var(--theme-textSecondary)' }}>
            Start your fitness journey today
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              className="block text-sm font-medium mb-2"
              style={{ color: 'var(--theme-textSecondary)' }}
            >
              Username
            </label>
            <div className="relative">
              <User
                className="absolute left-3 top-1/2 transform -translate-y-1/2"
                size={18}
                style={{ color: 'var(--theme-textMuted)' }}
              />
              <input
                type="text"
                name="userName"
                value={formData.userName}
                onChange={handleChange}
                placeholder="Choose a username"
                className="theme-input w-full pl-10 pr-4 py-3"
                disabled={loading}
              />
            </div>
          </div>

          <div>
            <label
              className="block text-sm font-medium mb-2"
              style={{ color: 'var(--theme-textSecondary)' }}
            >
              Email
            </label>
            <div className="relative">
              <Mail
                className="absolute left-3 top-1/2 transform -translate-y-1/2"
                size={18}
                style={{ color: 'var(--theme-textMuted)' }}
              />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className="theme-input w-full pl-10 pr-4 py-3"
                disabled={loading}
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
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a strong password"
                className="theme-input w-full pl-10 pr-4 py-3"
                disabled={loading}
              />
            </div>
          </div>

          <div>
            <label
              className="block text-sm font-medium mb-2"
              style={{ color: 'var(--theme-textSecondary)' }}
            >
              Confirm Password
            </label>
            <div className="relative">
              <Lock
                className="absolute left-3 top-1/2 transform -translate-y-1/2"
                size={18}
                style={{ color: 'var(--theme-textMuted)' }}
              />
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                className="theme-input w-full pl-10 pr-4 py-3"
                disabled={loading}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: 'var(--theme-textSecondary)' }}
              >
                Age
              </label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                placeholder="Age"
                className="theme-input w-full px-4 py-3"
                disabled={loading}
                min="1"
                max="120"
              />
            </div>

            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: 'var(--theme-textSecondary)' }}
              >
                Gender
              </label>
              <select
                name="gender"
                value={formData.gender || ""}
                onChange={handleChange}
                className="theme-input w-full px-4 py-3"
                style={{
                  color: formData.gender ? "var(--theme-text)" : "var(--theme-textMuted)"
                }}
                disabled={loading}
              >
                <option value="" hidden>Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-3.5 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>Creating Account...</span>
              </>
            ) : (
              <>
                <span>Create Account</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <p className="text-center mt-6" style={{ color: 'var(--theme-textSecondary)' }}>
          Already have an account?{' '}
          <button
            onClick={() => navigate('/login')}
            className="font-medium hover:underline"
            style={{ color: 'var(--theme-primary)' }}
            disabled={loading}
          >
            Sign in
          </button>
        </p>
      </GlassCard>
    </div>
  );
};

export default Register;
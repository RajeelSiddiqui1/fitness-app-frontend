import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight, ArrowLeft, RefreshCw, CheckCircle, XCircle, Eye, EyeOff } from 'lucide-react';
import GlassCard from '../components/GlassCard';
import ThemeToggle from '../components/ThemeToggle';
import { useTheme } from '../contexts/ThemeContext';
import { axiosInstance } from '../lib/axios';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  
  const [step, setStep] = useState(1); // 1: Request OTP, 2: Verify OTP, 3: New Password
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [countdown, setCountdown] = useState(0);
  
  const inputRefs = useRef([]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  useEffect(() => {
    if (step === 2 && inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, [step]);

  const handleOtpChange = (index, value) => {
    if (isNaN(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError('');

    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    if (!/^\d+$/.test(pastedData)) return;

    const newOtp = [...otp];
    for (let i = 0; i < pastedData.length; i++) {
      newOtp[i] = pastedData[i];
    }
    setOtp(newOtp);
    
    const lastFilledIndex = pastedData.length - 1;
    if (lastFilledIndex < 5) {
      inputRefs.current[lastFilledIndex + 1]?.focus();
    } else {
      inputRefs.current[5]?.focus();
    }
  };

  // Step 1: Request Password Reset OTP
  const handleRequestOtp = async (e) => {
    e.preventDefault();
    
    if (!email) {
      setError('Please enter your email address');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await axiosInstance.post('/auth/password-reset-otp', { email });
      
      if (response.data.message) {
        setSuccess('OTP sent successfully! Check your email.');
        setStep(2);
        setCountdown(60);
      }
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to send OTP. Please try again.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify Password Reset OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    const otpValue = otp.join('');
    
    if (otpValue.length !== 6) {
      setError('Please enter the complete 6-digit OTP');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await axiosInstance.post('/auth/verify-password-otp', {
        email,
        otpPassword: otpValue
      });

      if (response.data.message) {
        setSuccess('OTP verified successfully!');
        setTimeout(() => {
          setStep(3);
          setSuccess('');
        }, 1500);
      }
    } catch (err) {
      const message = err.response?.data?.message || 'Invalid or expired OTP. Please try again.';
      setError(message);
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Reset Password
  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (!password || !confirmPassword) {
      setError('Please fill in all password fields');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await axiosInstance.post('/auth/password-reset', {
        email,
        password,
        confirmPassword
      });

      if (response.data.message) {
        setSuccess('Password reset successfully!');
        setTimeout(() => {
          navigate('/login', { state: { passwordReset: true } });
        }, 1500);
      }
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to reset password. Please try again.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP
  const handleResend = async () => {
    if (countdown > 0 || resendLoading) return;

    setResendLoading(true);
    setError('');

    try {
      const response = await axiosInstance.post('/auth/password-reset-otp', { email });
      
      if (response.data.message) {
        setSuccess('New OTP sent successfully!');
        setCountdown(60);
        setOtp(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
      }
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to resend OTP. Please try again.';
      setError(message);
    } finally {
      setResendLoading(false);
    }
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center gap-2 mb-6">
      {[1, 2, 3].map((s) => (
        <React.Fragment key={s}>
          <div 
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
              step >= s ? 'text-white' : ''
            }`}
            style={{ 
              background: step >= s ? theme.gradient : 'var(--theme-inputBg)',
              border: step >= s ? 'none' : '1px solid var(--theme-border)'
            }}
          >
            {step > s ? <CheckCircle size={16} /> : s}
          </div>
          {s < 3 && (
            <div 
              className="w-12 h-0.5"
              style={{ 
                background: step > s ? theme.gradient : 'var(--theme-border)' 
              }}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4 py-12 relative overflow-hidden"
      style={{ background: 'var(--theme-bg)' }}
    >
      {/* Animated background orbs */}
      <div className="bg-orb bg-orb-1" />
      <div className="bg-orb bg-orb-2" />
      <div className="bg-orb bg-orb-3" />

      {/* Theme toggle positioned top right */}
      <div className="absolute top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      <GlassCard className="w-full max-w-md p-8 relative z-10">
        {/* Success Message */}
        {success && !error && (
          <div 
            className="mb-6 p-4 rounded-xl flex items-center gap-3"
            style={{ background: 'rgba(34, 197, 94, 0.1)', border: '1px solid rgba(34, 197, 94, 0.3)' }}
          >
            <CheckCircle size={20} style={{ color: '#22c55e' }} />
            <span style={{ color: '#22c55e' }}>{success}</span>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div 
            className="mb-6 p-4 rounded-xl flex items-center gap-3"
            style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)' }}
          >
            <XCircle size={20} style={{ color: 'var(--theme-error)' }} />
            <span style={{ color: 'var(--theme-error)' }}>{error}</span>
          </div>
        )}

        {/* Step Indicator */}
        {renderStepIndicator()}

        {/* Header */}
        <div className="text-center mb-6">
          <div 
            className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
            style={{ background: theme.gradient }}
          >
            <span className="text-3xl">🔐</span>
          </div>
          <h1 className="text-3xl font-bold gradient-text mb-2">
            {step === 1 && 'Reset Password'}
            {step === 2 && 'Verify OTP'}
            {step === 3 && 'New Password'}
          </h1>
          <p style={{ color: 'var(--theme-textSecondary)' }}>
            {step === 1 && 'Enter your email to receive a reset OTP'}
            {step === 2 && 'Enter the 6-digit code sent to your email'}
            {step === 3 && 'Create a new password for your account'}
          </p>
        </div>

        {/* Step 1: Request OTP */}
        {step === 1 && (
          <form onSubmit={handleRequestOtp} className="space-y-5">
            <div>
              <label 
                className="block text-sm font-medium mb-2"
                style={{ color: 'var(--theme-textSecondary)' }}
              >
                Email Address
              </label>
              <div className="relative">
                <Mail 
                  className="absolute left-3 top-1/2 transform -translate-y-1/2" 
                  size={18} 
                  style={{ color: 'var(--theme-textMuted)' }} 
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError('');
                  }}
                  placeholder="Enter your email"
                  className="theme-input w-full pl-10 pr-4 py-3"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3.5 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <RefreshCw size={18} className="animate-spin" />
                  <span>Sending OTP...</span>
                </>
              ) : (
                <>
                  <span>Send Reset OTP</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>
        )}

        {/* Step 2: Verify OTP */}
        {step === 2 && (
          <form onSubmit={handleVerifyOtp} className="space-y-6">
            {/* Email Display */}
            <div 
              className="flex items-center justify-center gap-2 p-3 rounded-xl"
              style={{ background: 'var(--theme-cardBg)', border: '1px solid var(--theme-border)' }}
            >
              <Mail size={18} style={{ color: 'var(--theme-primary)' }} />
              <span className="font-medium" style={{ color: 'var(--theme-text)' }}>{email}</span>
            </div>

            {/* OTP Input */}
            <div>
              <label 
                className="block text-sm font-medium mb-3 text-center"
                style={{ color: 'var(--theme-textSecondary)' }}
              >
                Enter 6-digit OTP
              </label>
              <div className="flex justify-center gap-2" onPaste={handlePaste}>
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="theme-input w-12 h-14 text-center text-xl font-bold"
                    style={{ 
                      borderColor: error ? 'var(--theme-error)' : 'var(--theme-border)',
                      background: 'var(--theme-inputBg)'
                    }}
                  />
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || otp.join('').length !== 6}
              className="btn-primary w-full py-3.5 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <RefreshCw size={18} className="animate-spin" />
                  <span>Verifying...</span>
                </>
              ) : (
                <>
                  <span>Verify OTP</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>

            {/* Resend OTP */}
            <div className="text-center">
              <p style={{ color: 'var(--theme-textSecondary)' }} className="mb-2">
                Didn't receive the OTP?
              </p>
              <button
                type="button"
                onClick={handleResend}
                disabled={countdown > 0 || resendLoading}
                className="font-medium hover:underline disabled:opacity-50 disabled:no-underline"
                style={{ color: 'var(--theme-primary)' }}
              >
                {resendLoading ? (
                  <span className="inline-flex items-center gap-2">
                    <RefreshCw size={16} className="animate-spin" />
                    Sending...
                  </span>
                ) : countdown > 0 ? (
                  `Resend OTP in ${countdown}s`
                ) : (
                  'Resend OTP'
                )}
              </button>
            </div>

            {/* Back Button */}
            <div className="text-center">
              <button
                type="button"
                onClick={() => {
                  setStep(1);
                  setOtp(['', '', '', '', '', '']);
                  setError('');
                }}
                className="inline-flex items-center gap-2 font-medium hover:underline"
                style={{ color: 'var(--theme-textSecondary)' }}
              >
                <ArrowLeft size={16} />
                Change Email
              </button>
            </div>
          </form>
        )}

        {/* Step 3: New Password */}
        {step === 3 && (
          <form onSubmit={handleResetPassword} className="space-y-5">
            <div>
              <label 
                className="block text-sm font-medium mb-2"
                style={{ color: 'var(--theme-textSecondary)' }}
              >
                New Password
              </label>
              <div className="relative">
                <Lock 
                  className="absolute left-3 top-1/2 transform -translate-y-1/2" 
                  size={18} 
                  style={{ color: 'var(--theme-textMuted)' }} 
                />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError('');
                  }}
                  placeholder="Enter new password"
                  className="theme-input w-full pl-10 pr-12 py-3"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                >
                  {showPassword ? (
                    <EyeOff size={18} style={{ color: 'var(--theme-textMuted)' }} />
                  ) : (
                    <Eye size={18} style={{ color: 'var(--theme-textMuted)' }} />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label 
                className="block text-sm font-medium mb-2"
                style={{ color: 'var(--theme-textSecondary)' }}
              >
                Confirm New Password
              </label>
              <div className="relative">
                <Lock 
                  className="absolute left-3 top-1/2 transform -translate-y-1/2" 
                  size={18} 
                  style={{ color: 'var(--theme-textMuted)' }} 
                />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setError('');
                  }}
                  placeholder="Confirm new password"
                  className="theme-input w-full pl-10 pr-12 py-3"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={18} style={{ color: 'var(--theme-textMuted)' }} />
                  ) : (
                    <Eye size={18} style={{ color: 'var(--theme-textMuted)' }} />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3.5 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <RefreshCw size={18} className="animate-spin" />
                  <span>Resetting Password...</span>
                </>
              ) : (
                <>
                  <span>Reset Password</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>

            {/* Back Button */}
            <div className="text-center">
              <button
                type="button"
                onClick={() => {
                  setStep(2);
                  setPassword('');
                  setConfirmPassword('');
                  setError('');
                }}
                className="inline-flex items-center gap-2 font-medium hover:underline"
                style={{ color: 'var(--theme-textSecondary)' }}
              >
                <ArrowLeft size={16} />
                Back to Verify OTP
              </button>
            </div>
          </form>
        )}

        {/* Login Link */}
        <div className="mt-6 text-center pt-6" style={{ borderTop: '1px solid var(--theme-border)' }}>
          <button
            onClick={() => navigate('/login')}
            className="inline-flex items-center gap-2 font-medium hover:underline"
            style={{ color: 'var(--theme-textSecondary)' }}
          >
            <ArrowLeft size={16} />
            Back to Login
          </button>
        </div>
      </GlassCard>
    </div>
  );
};

export default ForgotPassword;

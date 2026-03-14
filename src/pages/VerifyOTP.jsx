import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Mail, ArrowRight, ArrowLeft, RefreshCw, CheckCircle, XCircle } from 'lucide-react';
import GlassCard from '../components/GlassCard';
import ThemeToggle from '../components/ThemeToggle';
import { useTheme } from '../contexts/ThemeContext';
import { axiosInstance } from '../lib/axios';

const VerifyOTP = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme } = useTheme();
  
  const email = location.state?.email || '';
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
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
    if (email && inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, [email]);

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

  const handleVerify = async (e) => {
    e.preventDefault();
    const otpValue = otp.join('');
    
    if (otpValue.length !== 6) {
      setError('Please enter the complete 6-digit OTP');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await axiosInstance.post('/auth/verify-otp', {
        email,
        otp: otpValue
      });

      if (response.data.message) {
        setSuccess('Account verified successfully!');
        setTimeout(() => {
          navigate('/login', { state: { verified: true, email } });
        }, 1500);
      }
    } catch (err) {
      const message = err.response?.data?.message || 'Verification failed. Please try again.';
      setError(message);
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (countdown > 0 || resendLoading) return;

    setResendLoading(true);
    setError('');

    try {
      const response = await axiosInstance.post('/auth/resend-otp', { email });
      
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

  if (!email) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center p-4"
        style={{ background: 'var(--theme-bg)' }}
      >
        <GlassCard className="w-full max-w-md p-8 text-center">
          <XCircle className="mx-auto mb-4" size={48} style={{ color: 'var(--theme-error)' }} />
          <h2 className="text-xl font-bold mb-2">Invalid Access</h2>
          <p style={{ color: 'var(--theme-textSecondary)' }} className="mb-4">
            Please register first to verify your account.
          </p>
          <button
            onClick={() => navigate('/register')}
            className="btn-primary py-3 px-6 inline-flex items-center gap-2"
          >
            <ArrowLeft size={18} />
            Go to Register
          </button>
        </GlassCard>
      </div>
    );
  }

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

        {/* Logo */}
        <div className="text-center mb-6">
          <div 
            className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
            style={{ background: theme.gradient }}
          >
            <span className="text-3xl">📧</span>
          </div>
          <h1 className="text-3xl font-bold gradient-text mb-2">Verify Email</h1>
          <p style={{ color: 'var(--theme-textSecondary)' }}>
            We've sent a 6-digit OTP to your email
          </p>
        </div>

        {/* Email Display */}
        <div 
          className="flex items-center justify-center gap-2 p-3 rounded-xl mb-6"
          style={{ background: 'var(--theme-cardBg)', border: '1px solid var(--theme-border)' }}
        >
          <Mail size={18} style={{ color: 'var(--theme-primary)' }} />
          <span className="font-medium" style={{ color: 'var(--theme-text)' }}>{email}</span>
        </div>

        <form onSubmit={handleVerify} className="space-y-6">
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

          {/* Verify Button */}
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
                <span>Verify Account</span>
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
        </form>

        {/* Back to Register */}
        <div className="mt-6 text-center pt-6" style={{ borderTop: '1px solid var(--theme-border)' }}>
          <button
            onClick={() => navigate('/register')}
            className="inline-flex items-center gap-2 font-medium hover:underline"
            style={{ color: 'var(--theme-textSecondary)' }}
          >
            <ArrowLeft size={16} />
            Back to Register
          </button>
        </div>
      </GlassCard>
    </div>
  );
};

export default VerifyOTP;

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  X, Lock, Mail, User, GraduationCap, ShieldCheck, ArrowRight, 
  Loader2, KeyRound, CheckCircle2, ArrowLeft, RefreshCw 
} from 'lucide-react';
import { forgotPasswordApi, verifyOtpApi, resetPasswordApi } from '../services/api';

export default function AuthModal() {
  const { authModalOpen, setAuthModalOpen, authModalMode, setAuthModalMode, login, register } = useAuth();
  
  // Registration / Login fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [targetExam, setTargetExam] = useState('Banking (SBI / IBPS PO & Clerk)');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  // Forgot password flow states: 'request' | 'verify' | 'newPassword' | 'done'
  const [forgotStep, setForgotStep] = useState('request');
  const [forgotEmail, setForgotEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  if (!authModalOpen) return null;

  const resetAllStates = () => {
    setError('');
    setSuccessMsg('');
    setForgotStep('request');
    setOtp('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const switchMode = (mode) => {
    setAuthModalMode(mode);
    resetAllStates();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setLoading(true);

    try {
      if (authModalMode === 'login') {
        await login(email, password);
      } else if (authModalMode === 'register') {
        await register(name, email, password, targetExam);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = async (demoEmail, demoPassword) => {
    setError('');
    setSuccessMsg('');
    setLoading(true);
    try {
      await login(demoEmail, demoPassword);
    } catch (err) {
      setError('Demo login failed.');
    } finally {
      setLoading(false);
    }
  };

  // 1. Send OTP to email
  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!forgotEmail) {
      setError('Please provide your registered email address.');
      return;
    }
    setError('');
    setSuccessMsg('');
    setLoading(true);

    try {
      const res = await forgotPasswordApi(forgotEmail);
      setSuccessMsg(res.data.message || 'Verification code sent to your email.');
      setForgotStep('verify');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // 2. Verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp || otp.length < 6) {
      setError('Please enter the 6-digit OTP code.');
      return;
    }
    setError('');
    setSuccessMsg('');
    setLoading(true);

    try {
      const res = await verifyOtpApi(forgotEmail, otp);
      setSuccessMsg(res.data.message || 'OTP verified. Please set your new password.');
      setForgotStep('newPassword');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid or expired OTP code.');
    } finally {
      setLoading(false);
    }
  };

  // 3. Reset Password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match. Please re-check.');
      return;
    }
    setError('');
    setSuccessMsg('');
    setLoading(true);

    try {
      const res = await resetPasswordApi(forgotEmail, otp, newPassword);
      setSuccessMsg(res.data.message || 'Password reset successful! You can now log in.');
      setForgotStep('done');
      setEmail(forgotEmail);
      setPassword(newPassword);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div 
        className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-black/10 overflow-hidden p-6 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={() => { setAuthModalOpen(false); resetAllStates(); }}
          className="absolute top-5 right-5 p-1.5 rounded-full hover:bg-neutral-100 text-neutral-400 hover:text-black transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-black text-white flex items-center justify-center font-bold text-xl mx-auto mb-3 font-heading">
            {authModalMode === 'forgot' ? <KeyRound className="w-6 h-6" /> : 'A'}
          </div>
          <h3 className="text-xl font-bold text-black font-heading">
            {authModalMode === 'login' && 'Welcome Back to Aptitude Pro'}
            {authModalMode === 'register' && 'Create Your Aptitude Pro Account'}
            {authModalMode === 'forgot' && 'Account Recovery'}
          </h3>
          <p className="text-xs text-[#757575] mt-1">
            {authModalMode === 'login' && 'Access personalized learning progress, mock tests, and analytics.'}
            {authModalMode === 'register' && 'Join thousands of aspirants cracking banking and placement aptitude.'}
            {authModalMode === 'forgot' && 'Reset your password with a 6-digit OTP code sent to your email.'}
          </p>
        </div>

        {/* Tab switch (only in login/register) */}
        {authModalMode !== 'forgot' && (
          <div className="flex bg-neutral-100 p-1 rounded-full mb-5">
            <button
              type="button"
              onClick={() => switchMode('login')}
              className={`flex-1 py-1.5 rounded-full text-xs font-semibold transition-all ${
                authModalMode === 'login' ? 'bg-white text-black shadow-sm' : 'text-neutral-500 hover:text-black'
              }`}
            >
              Log In
            </button>
            <button
              type="button"
              onClick={() => switchMode('register')}
              className={`flex-1 py-1.5 rounded-full text-xs font-semibold transition-all ${
                authModalMode === 'register' ? 'bg-white text-black shadow-sm' : 'text-neutral-500 hover:text-black'
              }`}
            >
              Register
            </button>
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="mb-4 p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
            {error}
          </div>
        )}

        {/* Success message */}
        {successMsg && (
          <div className="mb-4 p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-600" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* ===================== FORGOT PASSWORD FLOW ===================== */}
        {authModalMode === 'forgot' ? (
          <div>
            {/* Step 1: Request OTP */}
            {forgotStep === 'request' && (
              <form onSubmit={handleSendOtp} className="space-y-4">
                <div>
                  <label className="block text-[11px] font-bold text-neutral-700 uppercase tracking-wider mb-1">
                    Your Registered Email
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3" />
                    <input
                      type="email"
                      required
                      placeholder="name@example.com"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-black/10 bg-neutral-50/50 text-xs font-medium outline-none focus:border-black focus:bg-white transition-all"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full btn-samsung !py-3 !text-xs !w-full justify-center disabled:opacity-50"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <span>Send 6-Digit OTP</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}

            {/* Step 2: Verify OTP */}
            {forgotStep === 'verify' && (
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div>
                  <label className="block text-[11px] font-bold text-neutral-700 uppercase tracking-wider mb-1">
                    Enter 6-Digit Verification Code
                  </label>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      maxLength={6}
                      required
                      placeholder="123456"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                      className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-black/10 bg-neutral-50/50 text-center tracking-[6px] text-base font-bold outline-none focus:border-black focus:bg-white transition-all"
                    />
                  </div>
                  <p className="text-[10px] text-neutral-500 mt-1">Code sent to: <strong>{forgotEmail}</strong></p>
                </div>

                <button
                  type="submit"
                  disabled={loading || otp.length !== 6}
                  className="w-full btn-samsung !py-3 !text-xs !w-full justify-center disabled:opacity-50"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <span>Verify Code</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    disabled={loading}
                    className="inline-flex items-center gap-1 text-[11px] text-[#1428A0] font-semibold hover:underline"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Resend OTP Code</span>
                  </button>
                </div>
              </form>
            )}

            {/* Step 3: Enter New Password */}
            {forgotStep === 'newPassword' && (
              <form onSubmit={handleResetPassword} className="space-y-3.5">
                <div>
                  <label className="block text-[11px] font-bold text-neutral-700 uppercase tracking-wider mb-1">
                    New Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3" />
                    <input
                      type="password"
                      required
                      placeholder="Minimum 6 characters"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-black/10 bg-neutral-50/50 text-xs font-medium outline-none focus:border-black focus:bg-white transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-neutral-700 uppercase tracking-wider mb-1">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3" />
                    <input
                      type="password"
                      required
                      placeholder="Re-enter new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-black/10 bg-neutral-50/50 text-xs font-medium outline-none focus:border-black focus:bg-white transition-all"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full btn-samsung !py-3 !text-xs !w-full justify-center disabled:opacity-50"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <span>Set New Password</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}

            {/* Step 4: Done */}
            {forgotStep === 'done' && (
              <div className="text-center py-2 space-y-4">
                <button
                  type="button"
                  onClick={() => switchMode('login')}
                  className="w-full btn-samsung !py-3 !text-xs !w-full justify-center"
                >
                  <span>Go to Login</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Back to login */}
            {forgotStep !== 'done' && (
              <div className="mt-4 pt-3 border-t border-black/8 text-center">
                <button
                  type="button"
                  onClick={() => switchMode('login')}
                  className="inline-flex items-center gap-1.5 text-xs text-neutral-600 hover:text-black font-semibold"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Sign In</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          /* ===================== LOGIN / REGISTER FORM ===================== */
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {authModalMode === 'register' && (
              <div>
                <label className="block text-[11px] font-bold text-neutral-700 uppercase tracking-wider mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahul Sharma"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-black/10 bg-neutral-50/50 text-xs font-medium outline-none focus:border-black focus:bg-white transition-all"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-[11px] font-bold text-neutral-700 uppercase tracking-wider mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-black/10 bg-neutral-50/50 text-xs font-medium outline-none focus:border-black focus:bg-white transition-all"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-[11px] font-bold text-neutral-700 uppercase tracking-wider">
                  Password
                </label>
                {authModalMode === 'login' && (
                  <button
                    type="button"
                    onClick={() => {
                      setForgotEmail(email);
                      switchMode('forgot');
                    }}
                    className="text-[11px] text-[#1428A0] font-semibold hover:underline"
                  >
                    Forgot Password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  placeholder="•••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-black/10 bg-neutral-50/50 text-xs font-medium outline-none focus:border-black focus:bg-white transition-all"
                />
              </div>
            </div>

            {authModalMode === 'register' && (
              <div>
                <label className="block text-[11px] font-bold text-neutral-700 uppercase tracking-wider mb-1">
                  Target Exam / Company
                </label>
                <div className="relative">
                  <GraduationCap className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3" />
                  <select
                    value={targetExam}
                    onChange={(e) => setTargetExam(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-black/10 bg-neutral-50/50 text-xs font-medium outline-none focus:border-black focus:bg-white transition-all"
                  >
                    <option value="Banking (SBI / IBPS PO & Clerk)">Banking (SBI / IBPS PO & Clerk)</option>
                    <option value="Campus Placement (TCS, Infosys, Wipro)">Campus Placement (TCS, Infosys, Wipro)</option>
                    <option value="SSC CGL & CHSL">SSC CGL & CHSL</option>
                    <option value="UPSC CSAT">UPSC CSAT</option>
                    <option value="General Aptitude Mastery">General Aptitude Mastery</option>
                  </select>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-samsung !py-3 !text-xs !w-full justify-center mt-2 disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <span>{authModalMode === 'login' ? 'Sign In to Dashboard' : 'Complete Registration'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}

        {/* Quick Demo Access Buttons (Only shown on login) */}
        {authModalMode === 'login' && (
          <div className="mt-6 pt-5 border-t border-black/8">
            <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider text-center mb-3">
              Quick 1-Click Demo Logins
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemo('aspirant@aptitudepro.com', 'student123')}
                className="p-2.5 rounded-2xl border border-black/10 hover:border-black/30 bg-neutral-50 hover:bg-white text-left transition-all group"
              >
                <div className="flex items-center gap-1.5 text-xs font-bold text-black group-hover:text-[#1428A0]">
                  <span>Student Aspirant</span>
                </div>
                <p className="text-[10px] text-neutral-500 mt-0.5">Rohan (SBI PO)</p>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemo('admin@aptitudepro.com', 'admin123')}
                className="p-2.5 rounded-2xl border border-black/10 hover:border-black/30 bg-neutral-50 hover:bg-white text-left transition-all group"
              >
                <div className="flex items-center gap-1.5 text-xs font-bold text-black group-hover:text-[#1428A0]">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#1428A0]" />
                  <span>Admin Master</span>
                </div>
                <p className="text-[10px] text-neutral-500 mt-0.5">Full Privileges</p>
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

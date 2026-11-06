import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { X, Lock, Mail, User, GraduationCap, ShieldCheck, ArrowRight, Loader2 } from 'lucide-react';

export default function AuthModal() {
  const { authModalOpen, setAuthModalOpen, authModalMode, setAuthModalMode, login, register } = useAuth();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [targetExam, setTargetExam] = useState('Banking & Campus Placement');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!authModalOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (authModalMode === 'login') {
        await login(email, password);
      } else {
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
    setLoading(true);
    try {
      await login(demoEmail, demoPassword);
    } catch (err) {
      setError('Demo login failed.');
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
          onClick={() => setAuthModalOpen(false)}
          className="absolute top-5 right-5 p-1.5 rounded-full hover:bg-neutral-100 text-neutral-400 hover:text-black transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-black text-white flex items-center justify-center font-bold text-xl mx-auto mb-3 font-heading">
            A
          </div>
          <h3 className="text-xl font-bold text-black font-heading">
            {authModalMode === 'login' ? 'Welcome Back to Aptitude Pro' : 'Create Your Aptitude Pro Account'}
          </h3>
          <p className="text-xs text-[#757575] mt-1">
            {authModalMode === 'login' 
              ? 'Access personalized learning progress, mock tests, and analytics.' 
              : 'Join thousands of aspirants cracking banking and placement aptitude.'}
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex bg-neutral-100 p-1 rounded-full mb-5">
          <button
            type="button"
            onClick={() => { setAuthModalMode('login'); setError(''); }}
            className={`flex-1 py-1.5 rounded-full text-xs font-semibold transition-all ${
              authModalMode === 'login' ? 'bg-white text-black shadow-sm' : 'text-neutral-500 hover:text-black'
            }`}
          >
            Log In
          </button>
          <button
            type="button"
            onClick={() => { setAuthModalMode('register'); setError(''); }}
            className={`flex-1 py-1.5 rounded-full text-xs font-semibold transition-all ${
              authModalMode === 'register' ? 'bg-white text-black shadow-sm' : 'text-neutral-500 hover:text-black'
            }`}
          >
            Register
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
            {error}
          </div>
        )}

        {/* Form */}
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
            <label className="block text-[11px] font-bold text-neutral-700 uppercase tracking-wider mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3" />
              <input
                type="password"
                required
                placeholder="••••••••"
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

        {/* Quick Demo Access Buttons */}
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

      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Search, 
  Menu, 
  X, 
  Flame, 
  User as UserIcon, 
  LogOut, 
  ShieldCheck, 
  Bookmark, 
  CheckCircle2, 
  Sparkles,
  ChevronDown,
  BookOpen
} from 'lucide-react';

export default function Navbar({ onOpenSearch }) {
  const { user, logout, openLoginModal, openRegisterModal, isAdmin } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Learn', path: '/learn' },
    { name: 'Practice', path: '/practice' },
    { name: 'Mock Tests', path: '/mock-tests' },
    { name: 'Exams', path: '/exams' },
    { name: 'Formula Book', path: '/formulas' },
    { name: 'Performance', path: '/dashboard' },
  ];

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <header className={`sticky top-0 z-40 w-full transition-all duration-300 ${
      scrolled 
        ? 'bg-white/90 backdrop-blur-md border-b border-black/8 shadow-sm' 
        : 'bg-white/80 backdrop-blur-sm border-b border-black/5'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Desktop Nav Links */}
          <div className="flex items-center gap-8 xl:gap-12">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 group shrink-0">
              <div className="w-10 h-10 rounded-2xl bg-black flex items-center justify-center text-white font-bold text-lg shadow-sm transition-transform duration-200 group-hover:scale-105">
                <span className="font-heading tracking-tight">A</span>
              </div>
              <span className="text-xl font-bold tracking-tight text-black flex items-center gap-1.5 font-heading">
                Aptitude
                <span className="text-xs px-2 py-0.5 rounded-full bg-[#1428A0] text-white font-semibold tracking-wider uppercase">
                  PRO
                </span>
              </span>
            </Link>

            {/* Desktop Nav Links */}
            <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
              {navLinks.map((link) => {
                const active = isActive(link.path);
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`px-3.5 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                      active 
                        ? 'bg-black text-white font-semibold shadow-sm' 
                        : 'text-[#191919] hover:text-black hover:bg-black/5'
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right Action Icons */}
          <div className="hidden md:flex items-center gap-3">
            
            {/* Global Search Button */}
            <button
              onClick={onOpenSearch}
              className="flex items-center gap-2 px-3.5 py-2 rounded-full border border-black/10 bg-white hover:bg-black/5 text-[#757575] hover:text-black transition-all text-xs font-medium"
              title="Search topics, formulas, exams (Ctrl+K)"
            >
              <Search className="w-4 h-4 text-black" />
              <span>Search...</span>
              <kbd className="hidden xl:inline-block px-1.5 py-0.5 text-[10px] font-mono bg-neutral-100 border border-neutral-300 rounded text-neutral-600">
                ⌘K
              </kbd>
            </button>

            {/* Daily Challenge Pill */}
            <Link
              to="/daily-challenge"
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-[#E8ECF5] text-[#1428A0] font-semibold text-xs transition-transform hover:scale-105"
            >
              <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span>Daily Challenge</span>
              {user?.streak ? (
                <span className="bg-[#1428A0] text-white px-1.5 py-0.2 rounded-full text-[10px]">
                  {user.streak}d
                </span>
              ) : null}
            </Link>

            {/* User Profile / Auth */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 pr-3 rounded-full border border-black/10 hover:border-black/30 transition-all bg-white"
                >
                  <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center font-bold text-xs uppercase">
                    {user.name.charAt(0)}
                  </div>
                  <span className="text-xs font-semibold text-black max-w-[100px] truncate">
                    {user.name.split(' ')[0]}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-[#757575]" />
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-black/10 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                    <div className="px-4 py-2 border-b border-black/5">
                      <p className="text-xs font-bold text-black">{user.name}</p>
                      <p className="text-[11px] text-[#757575] truncate">{user.email}</p>
                      <span className="inline-block mt-1 text-[10px] px-2 py-0.5 rounded-full bg-blue-50 text-[#1428A0] font-semibold">
                        {user.targetExam || 'Aptitude Aspirant'}
                      </span>
                    </div>

                    <Link
                      to="/dashboard"
                      className="flex items-center gap-2.5 px-4 py-2 text-xs text-[#191919] hover:bg-neutral-50 transition-colors"
                    >
                      <UserIcon className="w-4 h-4 text-[#757575]" />
                      <span>My Performance Hub</span>
                    </Link>

                    <Link
                      to="/formulas?filter=saved"
                      className="flex items-center gap-2.5 px-4 py-2 text-xs text-[#191919] hover:bg-neutral-50 transition-colors"
                    >
                      <Bookmark className="w-4 h-4 text-[#757575]" />
                      <span>Saved Formulas ({user.savedFormulas?.length || 0})</span>
                    </Link>

                    {isAdmin && (
                      <Link
                        to="/admin"
                        className="flex items-center gap-2.5 px-4 py-2 text-xs text-[#1428A0] font-semibold hover:bg-blue-50/50 transition-colors"
                      >
                        <ShieldCheck className="w-4 h-4 text-[#1428A0]" />
                        <span>Admin Console</span>
                      </Link>
                    )}

                    <div className="border-t border-black/5 my-1" />

                    <button
                      onClick={logout}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 transition-colors text-left font-medium"
                    >
                      <LogOut className="w-4 h-4 text-rose-600" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={openLoginModal}
                  className="px-4 py-2 text-xs font-semibold text-black hover:bg-black/5 rounded-full transition-colors"
                >
                  Log In
                </button>
                <button
                  onClick={openRegisterModal}
                  className="btn-samsung !text-xs !py-2 !px-4"
                >
                  Sign Up
                </button>
              </div>
            )}

          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={onOpenSearch}
              className="p-2 rounded-full border border-black/10 text-black hover:bg-black/5"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-full border border-black/10 text-black hover:bg-black/5"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-black/10 bg-white px-4 pt-2 pb-6 space-y-2 animate-in fade-in">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`block px-4 py-3 rounded-2xl text-sm font-medium ${
                isActive(link.path)
                  ? 'bg-black text-white font-semibold'
                  : 'text-[#191919] hover:bg-neutral-100'
              }`}
            >
              {link.name}
            </Link>
          ))}

          <Link
            to="/daily-challenge"
            className="flex items-center justify-between px-4 py-3 rounded-2xl bg-[#E8ECF5] text-[#1428A0] font-semibold text-sm"
          >
            <span className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-amber-500 fill-amber-500" />
              Daily Practice Sprint
            </span>
            <span className="bg-[#1428A0] text-white text-xs px-2 py-0.5 rounded-full">15 Qs</span>
          </Link>

          {isAdmin && (
            <Link
              to="/admin"
              className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-neutral-900 text-white font-semibold text-sm"
            >
              <ShieldCheck className="w-5 h-5 text-[#1428A0]" />
              Admin Dashboard
            </Link>
          )}

          <div className="pt-4 border-t border-black/10">
            {user ? (
              <div className="space-y-2">
                <div className="flex items-center gap-3 px-2">
                  <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center font-bold text-sm">
                    {user.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-black">{user.name}</p>
                    <p className="text-xs text-[#757575]">{user.email}</p>
                  </div>
                </div>
                <button
                  onClick={logout}
                  className="w-full mt-2 py-2.5 text-center text-xs text-rose-600 font-semibold bg-rose-50 rounded-full"
                >
                  Log Out
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-2">
                <button
                  onClick={openLoginModal}
                  className="py-2.5 rounded-full border border-black/20 text-xs font-semibold text-black text-center"
                >
                  Log In
                </button>
                <button
                  onClick={openRegisterModal}
                  className="py-2.5 rounded-full bg-black text-white text-xs font-semibold text-center"
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowUpRight, Shield, Award, HelpCircle } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-black/10 text-[#191919] pt-16 pb-12 mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top highlight row */}
        <div className="pb-12 border-b border-black/10 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-2xl bg-black text-white flex items-center justify-center shrink-0">
              <Award className="w-5 h-5 text-white" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-black font-heading">Verified Examination Syllabi</h4>
              <p className="text-xs text-[#757575] mt-1 leading-relaxed">
                Real patterns benchmarked against IBPS, SBI, SSC CGL, TCS NQT, and Infosys standards.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-2xl bg-[#1428A0] text-white flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-black font-heading">Formula & Shortcut Engine</h4>
              <p className="text-xs text-[#757575] mt-1 leading-relaxed">
                Over 200 high-frequency formulas with step-by-step derivations and single-click copy.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-2xl bg-neutral-900 text-white flex items-center justify-center shrink-0">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-black font-heading">Adaptive Exam Simulation</h4>
              <p className="text-xs text-[#757575] mt-1 leading-relaxed">
                Strict timer engines, negative marking, section cutoffs, and comprehensive Recharts analytics.
              </p>
            </div>
          </div>
        </div>

        {/* Main 4-column link layout */}
        <div className="py-12 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          
          <div className="col-span-2">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-black flex items-center justify-center text-white font-bold text-base">
                A
              </div>
              <span className="text-xl font-bold tracking-tight text-black font-heading">
                Aptitude<span className="text-[#1428A0]">Pro</span>
              </span>
            </Link>
            <p className="text-xs text-[#757575] mt-4 leading-relaxed max-w-sm">
              The premier interactive learning and assessment platform engineered for banking aspirants, competitive examination candidates, and campus placements.
            </p>
            <div className="mt-6 flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                MongoDB Live Sync
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-neutral-100 text-[#757575] text-xs font-medium">
                Samsung Design Language
              </span>
            </div>
          </div>

          <div>
            <h5 className="text-xs font-bold text-black uppercase tracking-wider mb-4 font-heading">Learning Tracks</h5>
            <ul className="space-y-2.5 text-xs text-[#757575]">
              <li><Link to="/learn?category=Quantitative+Aptitude" className="hover:text-black transition-colors">Quantitative Aptitude</Link></li>
              <li><Link to="/learn?category=Logical+Reasoning" className="hover:text-black transition-colors">Logical Reasoning</Link></li>
              <li><Link to="/learn?category=Verbal+Ability" className="hover:text-black transition-colors">Verbal Ability</Link></li>
              <li><Link to="/learn?category=Data+Interpretation" className="hover:text-black transition-colors">Data Interpretation</Link></li>
              <li><Link to="/learn?category=Computer+Aptitude" className="hover:text-black transition-colors">Computer Aptitude</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="text-xs font-bold text-black uppercase tracking-wider mb-4 font-heading">Target Exams</h5>
            <ul className="space-y-2.5 text-xs text-[#757575]">
              <li><Link to="/exams/ibps-po" className="hover:text-black transition-colors">IBPS PO & Clerk</Link></li>
              <li><Link to="/exams/sbi-po" className="hover:text-black transition-colors">SBI PO & Clerk</Link></li>
              <li><Link to="/exams/ssc-cgl" className="hover:text-black transition-colors">SSC CGL & CHSL</Link></li>
              <li><Link to="/exams/rrb-ntpc" className="hover:text-black transition-colors">RRB NTPC Railways</Link></li>
              <li><Link to="/exams/upsc-csat" className="hover:text-black transition-colors">UPSC Civil Services CSAT</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="text-xs font-bold text-black uppercase tracking-wider mb-4 font-heading">Company Placement</h5>
            <ul className="space-y-2.5 text-xs text-[#757575]">
              <li><Link to="/companies/tcs" className="hover:text-black transition-colors">TCS NQT Prep</Link></li>
              <li><Link to="/companies/infosys" className="hover:text-black transition-colors">Infosys Specialist</Link></li>
              <li><Link to="/companies/wipro" className="hover:text-black transition-colors">Wipro Elite NTH</Link></li>
              <li><Link to="/companies/accenture" className="hover:text-black transition-colors">Accenture ASE</Link></li>
              <li><Link to="/companies/zoho" className="hover:text-black transition-colors">Zoho Round 1 SDE</Link></li>
            </ul>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-black/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#757575]">
          <p>© {new Date().getFullYear()} Aptitude Pro. All examination rights and trademarks belong to their respective authorities.</p>
          <div className="flex items-center gap-6">
            <Link to="/formulas" className="hover:text-black">Formula Library</Link>
            <Link to="/daily-challenge" className="hover:text-black">Daily Challenge</Link>
            <Link to="/mock-tests" className="hover:text-black">Mock Test System</Link>
            <Link to="/dashboard" className="hover:text-black">User Analytics</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}

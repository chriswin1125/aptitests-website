import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getCompanyBySlugApi } from '../services/api';
import { 
  ArrowLeft, 
  Building2, 
  Clock, 
  CheckCircle2, 
  HelpCircle, 
  FileText, 
  ArrowRight, 
  Sparkles, 
  Award,
  AlertCircle,
  Briefcase,
  Loader2
} from 'lucide-react';

export default function CompanyDetailPage() {
  const { slug } = useParams();
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [revealedQuestions, setRevealedQuestions] = useState({});

  useEffect(() => {
    const fetchCompany = async () => {
      setLoading(true);
      try {
        const res = await getCompanyBySlugApi(slug);
        setCompany(res.data);
      } catch (err) {
        console.error('Error fetching company', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCompany();
  }, [slug]);

  const toggleQuestion = (idx) => {
    setRevealedQuestions(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F7F7F7]">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-[#1428A0] animate-spin mx-auto mb-3" />
          <p className="text-xs text-neutral-500">Loading placement dossier...</p>
        </div>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F7F7F7]">
        <div className="text-center bg-white p-8 rounded-3xl border border-black/5 shadow-sm max-w-md">
          <AlertCircle className="w-10 h-10 text-rose-500 mx-auto mb-3" />
          <h2 className="text-lg font-bold text-black font-heading">Company Not Found</h2>
          <p className="text-xs text-[#757575] mt-1">The requested campus recruitment profile does not exist.</p>
          <Link to="/exams?category=Campus+Placement" className="btn-samsung !text-xs !py-2 mt-4 inline-flex">
            Back to Campus Recruitment
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F7F7] pb-24">
      
      {/* Top Header */}
      <section className="bg-white border-b border-black/5 pt-10 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <Link to="/exams?category=Campus+Placement" className="inline-flex items-center gap-1.5 text-xs text-neutral-500 hover:text-black font-medium transition-colors mb-4">
            <ArrowLeft className="w-4 h-4" />
            <span>Campus Placement Drives</span>
          </Link>

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-3xl bg-black text-white font-bold text-xl flex items-center justify-center font-heading shrink-0">
                {company.name.slice(0, 3).toUpperCase()}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-[#1428A0] text-white font-semibold">
                    Package: {company.ctcRange}
                  </span>
                </div>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-black tracking-tight font-heading">
                  {company.name} Placement Drive
                </h1>
                <p className="text-xs sm:text-sm text-[#757575] mt-0.5">
                  {company.tagline}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Link to="/mock-tests" className="btn-samsung !text-xs !py-3">
                <FileText className="w-4 h-4" />
                <span>Launch {company.name} Mock Test</span>
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        
        {/* Overview & Hiring Profile */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          <div className="lg:col-span-8 samsung-card p-6 sm:p-8 bg-white border border-black/8 space-y-6">
            <div>
              <h3 className="text-lg font-bold text-black font-heading">Company & Recruitment Overview</h3>
              <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed mt-2">
                {company.overview}
              </p>
            </div>

            {/* Assessment Pattern Breakdown */}
            {company.assessmentPattern?.sections?.length > 0 && (
              <div className="pt-6 border-t border-black/8 space-y-4">
                <h4 className="text-sm font-bold text-black font-heading">Assessment Structure & Pattern</h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-neutral-50 text-neutral-500 uppercase text-[10px] border-b border-black/5">
                      <tr>
                        <th className="p-3">Section</th>
                        <th className="p-3">Questions</th>
                        <th className="p-3">Duration</th>
                        <th className="p-3">Difficulty</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-black/5 text-neutral-700">
                      {company.assessmentPattern.sections.map((sec, secIdx) => (
                        <tr key={secIdx} className="hover:bg-neutral-50/50">
                          <td className="p-3 font-bold text-black">{sec.name}</td>
                          <td className="p-3">{sec.questions} Qs</td>
                          <td className="p-3 font-semibold text-[#1428A0]">{sec.durationMinutes} Mins</td>
                          <td className="p-3">
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-neutral-100 font-medium">
                              {sec.difficulty}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Selection Rounds */}
            {company.rounds?.length > 0 && (
              <div className="pt-6 border-t border-black/8 space-y-4">
                <h4 className="text-sm font-bold text-black font-heading">Selection Stages & Rounds</h4>
                <div className="space-y-3">
                  {company.rounds.map((round, rIdx) => (
                    <div key={rIdx} className="p-4 rounded-2xl bg-[#FAF9F6] border border-black/5 flex items-start gap-3">
                      <span className="w-7 h-7 rounded-xl bg-black text-white text-xs font-bold flex items-center justify-center shrink-0">
                        R{round.roundNumber}
                      </span>
                      <div>
                        <h5 className="text-xs font-bold text-black">{round.roundName}</h5>
                        <p className="text-xs text-neutral-600 mt-0.5">{round.description}</p>
                        {round.keyFocus?.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {round.keyFocus.map((f, fIdx) => (
                              <span key={fIdx} className="text-[10px] px-2 py-0.5 rounded-full bg-white border border-black/5 text-neutral-600 font-medium">
                                {f}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Rail: Hiring Roles & Quick Facts */}
          <div className="lg:col-span-4 space-y-6">
            
            <div className="samsung-card p-6 bg-white border border-black/8 space-y-4">
              <h4 className="text-sm font-bold text-black font-heading">Hiring Packages & Roles</h4>
              <div className="space-y-2">
                {company.hiringRoles?.map((role, rIdx) => (
                  <div key={rIdx} className="p-3 rounded-2xl bg-[#FAF9F6] border border-black/5 text-xs font-bold text-black flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-[#1428A0]" />
                    <span>{role}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Interview Tips */}
            {company.interviewTips?.length > 0 && (
              <div className="samsung-card p-6 bg-white border border-black/8 space-y-4">
                <h4 className="text-sm font-bold text-black font-heading">Interview Preparation</h4>
                <div className="space-y-3">
                  {company.interviewTips.map((tipGroup, tgIdx) => (
                    <div key={tgIdx} className="space-y-1.5">
                      <p className="text-[11px] font-bold text-black uppercase tracking-wider">{tipGroup.category}</p>
                      {tipGroup.points?.map((pt, pIdx) => (
                        <p key={pIdx} className="text-xs text-neutral-600 flex items-start gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{pt}</span>
                        </p>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

        </div>

        {/* Company-Style Practice Questions */}
        {company.practiceQuestions?.length > 0 && (
          <div className="samsung-card p-6 sm:p-8 bg-white border border-black/8 space-y-6">
            <h3 className="text-lg font-bold text-black font-heading">Company-Style Practice Questions</h3>
            <div className="space-y-4">
              {company.practiceQuestions.map((pq, idx) => {
                const isRevealed = revealedQuestions[idx];
                return (
                  <div key={idx} className="p-5 rounded-2xl bg-[#FAF9F6] border border-black/5 space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-black">{company.name} Problem {idx + 1}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-50 text-[#1428A0] font-semibold">
                        {pq.yearAsked || pq.section}
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm font-semibold text-black leading-snug">
                      {pq.question}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                      {pq.options?.map((opt, optIdx) => (
                        <div 
                          key={optIdx} 
                          className={`p-2.5 rounded-xl border text-xs ${
                            isRevealed && optIdx === pq.correctAnswer
                              ? 'bg-emerald-50 border-emerald-500 font-bold text-emerald-900'
                              : 'bg-white border-black/5 text-neutral-700'
                          }`}
                        >
                          <span className="font-bold text-neutral-400 mr-2">{String.fromCharCode(65 + optIdx)})</span>
                          {opt}
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={() => toggleQuestion(idx)}
                      className="text-xs font-bold text-[#1428A0] hover:underline flex items-center gap-1"
                    >
                      <HelpCircle className="w-3.5 h-3.5" />
                      <span>{isRevealed ? 'Hide Solution' : 'View Correct Answer & Explanation'}</span>
                    </button>

                    {isRevealed && (
                      <div className="p-3.5 rounded-xl bg-white border border-emerald-200 text-xs space-y-1 animate-in fade-in">
                        <p className="font-bold text-emerald-700">
                          Correct Option: {String.fromCharCode(65 + pq.correctAnswer)} ({pq.options[pq.correctAnswer]})
                        </p>
                        <p className="text-neutral-700">{pq.explanation}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>

    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getExamBySlugApi } from '../services/api';
import { 
  ArrowLeft, 
  Clock, 
  Award, 
  BookOpen, 
  CheckCircle2, 
  HelpCircle, 
  ArrowRight, 
  Sparkles, 
  AlertCircle, 
  Zap, 
  Landmark,
  FileText,
  Loader2
} from 'lucide-react';

export default function ExamDetailPage() {
  const { slug } = useParams();
  const [exam, setExam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [revealedSamples, setRevealedSamples] = useState({});

  useEffect(() => {
    const fetchExam = async () => {
      setLoading(true);
      try {
        const res = await getExamBySlugApi(slug);
        setExam(res.data);
      } catch (err) {
        console.error('Error fetching exam', err);
      } finally {
        setLoading(false);
      }
    };
    fetchExam();
  }, [slug]);

  const toggleSample = (idx) => {
    setRevealedSamples(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F7F7F7]">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-[#1428A0] animate-spin mx-auto mb-3" />
          <p className="text-xs text-neutral-500">Loading exam dossier...</p>
        </div>
      </div>
    );
  }

  if (!exam) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F7F7F7]">
        <div className="text-center bg-white p-8 rounded-3xl border border-black/5 shadow-sm max-w-md">
          <AlertCircle className="w-10 h-10 text-rose-500 mx-auto mb-3" />
          <h2 className="text-lg font-bold text-black font-heading">Exam Not Found</h2>
          <p className="text-xs text-[#757575] mt-1">The requested examination guide does not exist.</p>
          <Link to="/exams" className="btn-samsung !text-xs !py-2 mt-4 inline-flex">
            Back to All Exams
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F7F7] pb-24">
      
      {/* Top Breadcrumb Header */}
      <section className="bg-white border-b border-black/5 pt-10 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <Link to="/exams" className="inline-flex items-center gap-1.5 text-xs text-neutral-500 hover:text-black font-medium transition-colors mb-4">
            <ArrowLeft className="w-4 h-4" />
            <span>All Examinations</span>
          </Link>

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-black text-white font-semibold">
                  {exam.category}
                </span>
                <span className="text-xs text-neutral-500 font-medium">
                  Conducted {exam.frequency}
                </span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-extrabold text-black tracking-tight font-heading">
                {exam.name}
              </h1>
              <p className="text-xs sm:text-sm text-[#757575] mt-1 max-w-2xl">
                {exam.tagline}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link to={`/mock-tests?exam=${exam.slug}`} className="btn-samsung !text-xs !py-3">
                <FileText className="w-4 h-4" />
                <span>Launch {exam.name} Mocks</span>
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        
        {/* Overview & Key Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          <div className="lg:col-span-8 samsung-card p-6 sm:p-8 bg-white border border-black/8 space-y-6">
            <div>
              <h3 className="text-lg font-bold text-black font-heading">Examination Overview</h3>
              <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed mt-2">
                {exam.overview}
              </p>
            </div>

            {/* Stages & Sections breakdown */}
            {exam.stages?.map((stage, sIdx) => (
              <div key={sIdx} className="pt-6 border-t border-black/8 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-black font-heading">{stage.stageName}</h4>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-neutral-100 text-neutral-700 font-semibold">
                    {stage.mode}
                  </span>
                </div>

                {/* Sections Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-neutral-50 text-neutral-500 uppercase text-[10px] border-b border-black/5">
                      <tr>
                        <th className="p-3">Section Name</th>
                        <th className="p-3">Questions</th>
                        <th className="p-3">Marks</th>
                        <th className="p-3">Time Limit</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-black/5 text-neutral-700">
                      {stage.sections?.map((sec, secIdx) => (
                        <tr key={secIdx} className="hover:bg-neutral-50/50">
                          <td className="p-3 font-bold text-black">{sec.name}</td>
                          <td className="p-3">{sec.questions}</td>
                          <td className="p-3">{sec.marks}</td>
                          <td className="p-3 font-semibold text-[#1428A0]">{sec.timeLimit}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>

          {/* Right Rail: Highlights */}
          <div className="lg:col-span-4 space-y-6">
            
            <div className="samsung-card p-6 bg-white border border-black/8 space-y-4">
              <h4 className="text-sm font-bold text-black font-heading">Assessment Snapshot</h4>
              
              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between py-2 border-b border-black/5">
                  <span className="text-neutral-500">Duration</span>
                  <span className="font-bold text-black">{exam.durationMinutes} Minutes</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-black/5">
                  <span className="text-neutral-500">Maximum Marks</span>
                  <span className="font-bold text-black">{exam.totalMarks} Marks</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-black/5">
                  <span className="text-neutral-500">Negative Marking</span>
                  <span className="font-semibold text-rose-600">{exam.negativeMarking}</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-neutral-500">Eligibility</span>
                  <span className="font-semibold text-black text-right max-w-[160px] truncate">{exam.eligibility || 'Graduation'}</span>
                </div>
              </div>
            </div>

            {/* Recommended Topics */}
            {exam.recommendedTopics?.length > 0 && (
              <div className="samsung-card p-6 bg-white border border-black/8 space-y-3">
                <h4 className="text-sm font-bold text-black font-heading">Priority Topics</h4>
                <div className="flex flex-wrap gap-1.5">
                  {exam.recommendedTopics.map(tSlug => (
                    <Link
                      key={tSlug}
                      to={`/learn/${tSlug}`}
                      className="text-xs px-3 py-1 rounded-full bg-neutral-100 hover:bg-black hover:text-white transition-colors capitalize font-medium"
                    >
                      {tSlug.replace(/-/g, ' ')}
                    </Link>
                  ))}
                </div>
              </div>
            )}

          </div>

        </div>

        {/* Preparation Strategy */}
        {exam.preparationStrategy?.length > 0 && (
          <div className="samsung-card p-6 sm:p-8 bg-white border border-black/8 space-y-6">
            <h3 className="text-lg font-bold text-black font-heading">Structured Preparation Strategy</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {exam.preparationStrategy.map((strat, sIdx) => (
                <div key={sIdx} className="p-5 rounded-2xl bg-[#FAF9F6] border border-black/5 space-y-2">
                  <span className="text-[10px] font-mono text-[#1428A0] font-bold uppercase">{strat.phase}</span>
                  <h4 className="text-sm font-bold text-black font-heading">{strat.title}</h4>
                  <p className="text-xs text-[#757575] leading-relaxed">{strat.description}</p>
                  
                  {strat.tips?.length > 0 && (
                    <div className="pt-2 border-t border-black/5 space-y-1">
                      {strat.tips.map((tip, tipIdx) => (
                        <p key={tipIdx} className="text-[11px] text-neutral-600 flex items-start gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{tip}</span>
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Sample Questions */}
        {exam.sampleQuestions?.length > 0 && (
          <div className="samsung-card p-6 sm:p-8 bg-white border border-black/8 space-y-6">
            <h3 className="text-lg font-bold text-black font-heading">Previous-Year Benchmark Questions</h3>
            <div className="space-y-4">
              {exam.sampleQuestions.map((sq, idx) => {
                const isRevealed = revealedSamples[idx];
                return (
                  <div key={idx} className="p-5 rounded-2xl bg-[#FAF9F6] border border-black/5 space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-black">Benchmark Problem {idx + 1}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-neutral-200 text-neutral-700 font-semibold">
                        {sq.section}
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm font-semibold text-black leading-snug">
                      {sq.question}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                      {sq.options?.map((opt, optIdx) => (
                        <div 
                          key={optIdx} 
                          className={`p-2.5 rounded-xl border text-xs ${
                            isRevealed && optIdx === sq.correctAnswer
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
                      onClick={() => toggleSample(idx)}
                      className="text-xs font-bold text-[#1428A0] hover:underline flex items-center gap-1"
                    >
                      <HelpCircle className="w-3.5 h-3.5" />
                      <span>{isRevealed ? 'Hide Explanation' : 'View Correct Answer & Explanation'}</span>
                    </button>

                    {isRevealed && (
                      <div className="p-3.5 rounded-xl bg-white border border-emerald-200 text-xs space-y-1 animate-in fade-in">
                        <p className="font-bold text-emerald-700">
                          Correct Option: {String.fromCharCode(65 + sq.correctAnswer)} ({sq.options[sq.correctAnswer]})
                        </p>
                        <p className="text-neutral-700">{sq.explanation}</p>
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

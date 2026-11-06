import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getTopicBySlugApi, submitTopicTestApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import confetti from 'canvas-confetti';
import { 
  ArrowLeft, 
  Clock, 
  Award, 
  BookOpen, 
  CheckCircle2, 
  Copy, 
  Check, 
  HelpCircle, 
  ChevronRight, 
  ChevronLeft,
  Flame, 
  Sparkles, 
  AlertCircle, 
  Zap, 
  Bookmark, 
  RotateCcw,
  Flag,
  Loader2,
  CheckCircle
} from 'lucide-react';

export default function TopicDetailPage() {
  const { slug } = useParams();
  const { user, toggleBookmarkFormula, toggleCompleteTopic } = useAuth();

  const [topic, setTopic] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('intro'); // 'intro', 'concepts', 'formulas', 'examples', 'practice', 'test'
  
  // Concept sub-tabs
  const [conceptSubTab, setConceptSubTab] = useState('basic'); // 'basic' | 'intermediate' | 'advanced' | 'shortcuts' | 'mistakes'

  // Practice section filter & state
  const [practiceFilter, setPracticeFilter] = useState('All');
  const [revealedSolutions, setRevealedSolutions] = useState({});

  // Topic Test State
  const [testActive, setTestActive] = useState(false);
  const [testCurrentIndex, setTestCurrentIndex] = useState(0);
  const [testAnswers, setTestAnswers] = useState({}); // { [questionIdx]: selectedOption }
  const [testMarkedForReview, setTestMarkedForReview] = useState({}); // { [questionIdx]: boolean }
  const [testTimerSeconds, setTestTimerSeconds] = useState(600); // 10 minutes default
  const [testSubmitted, setTestSubmitted] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const [isSubmittingTest, setIsSubmittingTest] = useState(false);

  // Copied Formula helper
  const [copiedFormulaName, setCopiedFormulaName] = useState(null);

  // Completed Topic state
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    const fetchTopic = async () => {
      setLoading(true);
      try {
        const res = await getTopicBySlugApi(slug);
        setTopic(res.data.topic);
        setIsCompleted(res.data.isCompleted);
      } catch (err) {
        console.error('Error fetching topic', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTopic();
  }, [slug]);

  // Topic Test Timer countdown
  useEffect(() => {
    let interval = null;
    if (testActive && !testSubmitted && testTimerSeconds > 0) {
      interval = setInterval(() => {
        setTestTimerSeconds((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            handleAutoSubmitTest();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [testActive, testSubmitted, testTimerSeconds]);

  const handleCopyFormula = (expr, name) => {
    navigator.clipboard.writeText(expr);
    setCopiedFormulaName(name);
    setTimeout(() => setCopiedFormulaName(null), 2000);
  };

  const handleToggleComplete = async () => {
    const status = await toggleCompleteTopic(topic.slug);
    setIsCompleted(status);
  };

  const toggleSolution = (qId) => {
    setRevealedSolutions(prev => ({ ...prev, [qId]: !prev[qId] }));
  };

  // Test Actions
  const handleStartTest = () => {
    setTestActive(true);
    setTestSubmitted(false);
    setTestResult(null);
    setTestAnswers({});
    setTestMarkedForReview({});
    setTestCurrentIndex(0);
    setTestTimerSeconds((topic?.testQuestions?.length || 5) * 120); // 2 mins per question
  };

  const handleSelectOption = (qIdx, optIdx) => {
    setTestAnswers(prev => ({ ...prev, [qIdx]: optIdx }));
  };

  const handleClearOption = (qIdx) => {
    setTestAnswers(prev => {
      const copy = { ...prev };
      delete copy[qIdx];
      return copy;
    });
  };

  const handleToggleMarkForReview = (qIdx) => {
    setTestMarkedForReview(prev => ({ ...prev, [qIdx]: !prev[qIdx] }));
  };

  const handleSubmitTest = async () => {
    if (isSubmittingTest) return;
    setIsSubmittingTest(true);
    try {
      const totalTimeSpent = ((topic?.testQuestions?.length || 5) * 120) - testTimerSeconds;
      const res = await submitTopicTestApi(topic.slug, {
        answers: testAnswers,
        timeSpentSeconds: totalTimeSpent
      });

      setTestResult(res.data);
      setTestSubmitted(true);
      setTestActive(false);

      if (res.data.accuracy >= 70) {
        setIsCompleted(true);
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
    } catch (err) {
      console.error('Error submitting topic test', err);
    } finally {
      setIsSubmittingTest(false);
    }
  };

  const handleAutoSubmitTest = () => {
    handleSubmitTest();
  };

  const formatTimer = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F7F7F7]">
        <div className="text-center">
          <Loader2 className="w-10 h-10 text-[#1428A0] animate-spin mx-auto mb-3" />
          <p className="text-xs text-[#757575]">Loading learning module...</p>
        </div>
      </div>
    );
  }

  if (!topic) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F7F7F7]">
        <div className="text-center bg-white p-8 rounded-3xl border border-black/5 shadow-sm max-w-md">
          <AlertCircle className="w-10 h-10 text-rose-500 mx-auto mb-3" />
          <h2 className="text-lg font-bold text-black font-heading">Topic Not Found</h2>
          <p className="text-xs text-[#757575] mt-1">The requested aptitude syllabus topic does not exist.</p>
          <Link to="/learn" className="btn-samsung !text-xs !py-2 mt-4 inline-flex">
            Back to All Topics
          </Link>
        </div>
      </div>
    );
  }

  const sectionsNav = [
    { id: 'intro', label: '1. Introduction' },
    { id: 'concepts', label: '2. Concepts' },
    { id: 'formulas', label: '3. Formula Book' },
    { id: 'examples', label: '4. Solved Examples' },
    { id: 'practice', label: '5. Practice Questions' },
    { id: 'test', label: '6. Topic Test' },
    { id: 'performance', label: '7. Performance' },
  ];

  return (
    <div className="min-h-screen bg-[#F7F7F7] pb-24">
      
      {/* Sticky Top Sub-Navigation Header */}
      <div className="bg-white border-b border-black/8 sticky top-20 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex items-center justify-between py-3 border-b border-black/5">
            <Link to="/learn" className="inline-flex items-center gap-1.5 text-xs text-neutral-500 hover:text-black font-medium transition-colors">
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Curriculum</span>
            </Link>

            <div className="flex items-center gap-2">
              <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-[#E8ECF5] text-[#1428A0] font-semibold">
                {topic.category}
              </span>
              <button
                onClick={handleToggleComplete}
                className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                  isCompleted 
                    ? 'bg-emerald-600 text-white' 
                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                }`}
              >
                <CheckCircle className="w-3.5 h-3.5" />
                <span>{isCompleted ? 'Completed' : 'Mark Complete'}</span>
              </button>
            </div>
          </div>

          {/* 7 Section Quick Jump Tabs */}
          <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto py-2.5 no-scrollbar">
            {sectionsNav.map((sec) => (
              <button
                key={sec.id}
                onClick={() => {
                  setActiveTab(sec.id);
                  if (sec.id === 'test' && !testActive && !testSubmitted) {
                    // stays on test ready screen
                  }
                }}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  activeTab === sec.id
                    ? 'bg-black text-white'
                    : 'text-neutral-500 hover:text-black hover:bg-black/5'
                }`}
              >
                {sec.label}
              </button>
            ))}
          </div>

        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">

        {/* SECTION 1: TOPIC INTRODUCTION */}
        {activeTab === 'intro' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            
            <div className="samsung-card p-8 sm:p-10 bg-white border border-black/8">
              <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-black/8">
                <div>
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#1428A0]">
                    Module Syllabus • {topic.category}
                  </span>
                  <h1 className="text-3xl sm:text-4xl font-extrabold text-black tracking-tight mt-1 font-heading">
                    {topic.name}
                  </h1>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-[10px] text-neutral-400 font-mono uppercase">Difficulty</p>
                    <p className="text-xs font-bold text-black">{topic.difficulty}</p>
                  </div>
                  <div className="h-8 w-px bg-black/10"></div>
                  <div className="text-right">
                    <p className="text-[10px] text-neutral-400 font-mono uppercase">Estimated Time</p>
                    <p className="text-xs font-bold text-black">{topic.estimatedTime}</p>
                  </div>
                </div>
              </div>

              {/* Summary and In-Depth Description */}
              <div className="py-6 space-y-4">
                <h3 className="text-base font-bold text-black font-heading">What is {topic.name}?</h3>
                <p className="text-sm text-neutral-700 leading-relaxed font-normal">
                  {topic.description}
                </p>
              </div>

              {/* 3 Overview Info Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-black/8">
                <div className="p-5 rounded-2xl bg-[#FAF9F6] border border-black/5">
                  <div className="flex items-center gap-2 mb-2">
                    <Award className="w-4 h-4 text-[#1428A0]" />
                    <h4 className="text-xs font-bold text-black uppercase tracking-wider font-heading">Why it is Important</h4>
                  </div>
                  <p className="text-xs text-neutral-600 leading-relaxed">
                    {topic.importance}
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-[#FAF9F6] border border-black/5">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-4 h-4 text-amber-600" />
                    <h4 className="text-xs font-bold text-black uppercase tracking-wider font-heading">Where it is Used</h4>
                  </div>
                  <p className="text-xs text-neutral-600 leading-relaxed">
                    {topic.examUsage}
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-[#FAF9F6] border border-black/5">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="w-4 h-4 text-emerald-600" />
                    <h4 className="text-xs font-bold text-black uppercase tracking-wider font-heading">Recommended Plan</h4>
                  </div>
                  <p className="text-xs text-neutral-600 leading-relaxed">
                    Review foundational concepts, memorize key formula cards, inspect 5 solved examples, and score 80%+ on the Topic Test.
                  </p>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-black/8 flex justify-end">
                <button
                  onClick={() => setActiveTab('concepts')}
                  className="btn-samsung !text-xs"
                >
                  <span>Proceed to Section 2: Concepts</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>
        )}

        {/* SECTION 2: CONCEPTS (Basic, Intermediate, Advanced, Shortcuts, Mistakes) */}
        {activeTab === 'concepts' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            
            <div className="samsung-card p-6 sm:p-8 bg-white border border-black/8">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-black/8">
                <div>
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#1428A0]">
                    Section 2 of 7
                  </span>
                  <h2 className="text-2xl font-bold text-black font-heading mt-0.5">
                    Theoretical Foundations & Concept Hierarchy
                  </h2>
                </div>

                {/* Sub-Tabs for Concept Level */}
                <div className="flex items-center gap-1.5 overflow-x-auto bg-neutral-100 p-1 rounded-full">
                  {[
                    { id: 'basic', label: 'Basic Concepts' },
                    { id: 'intermediate', label: 'Intermediate' },
                    { id: 'advanced', label: 'Advanced' },
                    { id: 'shortcuts', label: 'Shortcuts & Tricks' },
                    { id: 'mistakes', label: 'Common Mistakes' }
                  ].map((sub) => (
                    <button
                      key={sub.id}
                      onClick={() => setConceptSubTab(sub.id)}
                      className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                        conceptSubTab === sub.id 
                          ? 'bg-black text-white shadow-xs' 
                          : 'text-neutral-500 hover:text-black'
                      }`}
                    >
                      {sub.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sub-Tab Contents */}
              <div className="pt-6">
                
                {/* Basic Concepts */}
                {conceptSubTab === 'basic' && (
                  <div className="space-y-4">
                    {topic.concepts?.basic?.map((item, idx) => (
                      <div key={idx} className="p-5 rounded-2xl bg-neutral-50/70 border border-black/5">
                        <h4 className="text-sm font-bold text-black font-heading flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-black text-white text-[11px] flex items-center justify-center font-bold">
                            {idx + 1}
                          </span>
                          {item.title}
                        </h4>
                        <p className="text-xs text-neutral-700 mt-2 leading-relaxed pl-7">
                          {item.content}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Intermediate Concepts */}
                {conceptSubTab === 'intermediate' && (
                  <div className="space-y-4">
                    {topic.concepts?.intermediate?.map((item, idx) => (
                      <div key={idx} className="p-5 rounded-2xl bg-neutral-50/70 border border-black/5">
                        <h4 className="text-sm font-bold text-black font-heading flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-[#1428A0] text-white text-[11px] flex items-center justify-center font-bold">
                            {idx + 1}
                          </span>
                          {item.title}
                        </h4>
                        <p className="text-xs text-neutral-700 mt-2 leading-relaxed pl-7">
                          {item.content}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Advanced Concepts */}
                {conceptSubTab === 'advanced' && (
                  <div className="space-y-4">
                    {topic.concepts?.advanced?.map((item, idx) => (
                      <div key={idx} className="p-5 rounded-2xl bg-neutral-50/70 border border-black/5">
                        <h4 className="text-sm font-bold text-black font-heading flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-neutral-900 text-white text-[11px] flex items-center justify-center font-bold">
                            {idx + 1}
                          </span>
                          {item.title}
                        </h4>
                        <p className="text-xs text-neutral-700 mt-2 leading-relaxed pl-7">
                          {item.content}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Shortcuts & Tricks */}
                {conceptSubTab === 'shortcuts' && (
                  <div className="space-y-4">
                    {topic.concepts?.shortcuts?.map((item, idx) => (
                      <div key={idx} className="p-5 rounded-2xl bg-amber-50/50 border border-amber-200">
                        <div className="flex items-center gap-2 mb-2">
                          <Zap className="w-4 h-4 text-amber-600" />
                          <h4 className="text-sm font-bold text-amber-950 font-heading">{item.title}</h4>
                        </div>
                        <div className="my-2 p-3 rounded-xl bg-white border border-amber-200 text-xs font-mono font-bold text-amber-900">
                          {item.trick}
                        </div>
                        {item.example && (
                          <p className="text-xs text-amber-900 leading-relaxed mt-2">
                            <strong>Worked Example:</strong> {item.example}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Common Mistakes */}
                {conceptSubTab === 'mistakes' && (
                  <div className="space-y-4">
                    {topic.concepts?.commonMistakes?.map((item, idx) => (
                      <div key={idx} className="p-5 rounded-2xl bg-rose-50/50 border border-rose-200">
                        <div className="flex items-start gap-2.5">
                          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                          <div className="space-y-2">
                            <div>
                              <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600">Common Mistake:</span>
                              <p className="text-xs text-rose-950 font-semibold mt-0.5">{item.mistake}</p>
                            </div>
                            <div className="pt-2 border-t border-rose-200/60">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">Correct Method:</span>
                              <p className="text-xs text-emerald-950 font-medium mt-0.5">{item.correction}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

              </div>

              <div className="mt-8 pt-6 border-t border-black/8 flex items-center justify-between">
                <button
                  onClick={() => setActiveTab('intro')}
                  className="btn-samsung-ghost !text-xs"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Introduction</span>
                </button>
                <button
                  onClick={() => setActiveTab('formulas')}
                  className="btn-samsung !text-xs"
                >
                  <span>Section 3: Formula Book</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

            </div>

          </div>
        )}

        {/* SECTION 3: FORMULA BOOK */}
        {activeTab === 'formulas' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            
            <div className="samsung-card p-6 sm:p-8 bg-white border border-black/8">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-black/8">
                <div>
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#1428A0]">
                    Section 3 of 7
                  </span>
                  <h2 className="text-2xl font-bold text-black font-heading mt-0.5">
                    Formula Book & Equations
                  </h2>
                </div>

                <Link
                  to="/formulas"
                  className="text-xs font-bold text-[#1428A0] hover:underline flex items-center gap-1"
                >
                  <span>Open Full Library</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* Formula Cards */}
              <div className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                {topic.formulas?.map((formula, idx) => (
                  <div 
                    key={idx}
                    className="p-6 rounded-3xl bg-[#FAF9F6] border border-black/8 flex flex-col justify-between group hover:border-[#1428A0]/30 transition-all"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-bold text-black font-heading">{formula.name}</span>
                        <button
                          onClick={() => handleCopyFormula(formula.expression, formula.name)}
                          className="flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full bg-white border border-black/10 hover:border-black/30 transition-colors"
                        >
                          {copiedFormulaName === formula.name ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                              <span className="text-emerald-600">Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5 text-neutral-500" />
                              <span>Copy Formula</span>
                            </>
                          )}
                        </button>
                      </div>

                      {/* Formula mathematical box */}
                      <div className="my-3 p-4 rounded-2xl bg-neutral-900 text-white">
                        <code className="text-xs sm:text-sm font-mono text-emerald-400 font-semibold block break-all">
                          {formula.expression}
                        </code>
                      </div>

                      <p className="text-xs text-neutral-600 mt-2">
                        {formula.explanation}
                      </p>

                      {/* Variables list */}
                      {formula.variables?.length > 0 && (
                        <div className="mt-4 pt-3 border-t border-black/5">
                          <span className="text-[10px] font-mono font-bold text-neutral-400 uppercase tracking-wider block mb-1">
                            Variables
                          </span>
                          <div className="space-y-1">
                            {formula.variables.map((v, vIdx) => (
                              <p key={vIdx} className="text-xs text-neutral-600">
                                <strong className="text-black font-mono">{v.symbol}:</strong> {v.meaning}
                              </p>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* When to use */}
                      {formula.whenToUse && (
                        <div className="mt-3 p-2.5 rounded-xl bg-blue-50/60 border border-blue-100 text-xs text-blue-900">
                          <strong>When to use:</strong> {formula.whenToUse}
                        </div>
                      )}

                      {/* Solved Example */}
                      {formula.solvedExample && (
                        <div className="mt-3 p-2.5 rounded-xl bg-neutral-100 text-xs text-neutral-700">
                          <strong>Example:</strong> {formula.solvedExample}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 pt-6 border-t border-black/8 flex items-center justify-between">
                <button
                  onClick={() => setActiveTab('concepts')}
                  className="btn-samsung-ghost !text-xs"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Concepts</span>
                </button>
                <button
                  onClick={() => setActiveTab('examples')}
                  className="btn-samsung !text-xs"
                >
                  <span>Section 4: Solved Examples</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

            </div>

          </div>
        )}

        {/* SECTION 4: SOLVED EXAMPLES (At least 5 detailed examples) */}
        {activeTab === 'examples' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            
            <div className="samsung-card p-6 sm:p-8 bg-white border border-black/8">
              
              <div className="pb-6 border-b border-black/8">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#1428A0]">
                  Section 4 of 7
                </span>
                <h2 className="text-2xl font-bold text-black font-heading mt-0.5">
                  Solved Examples ({topic.solvedExamples?.length || 5} Step-by-Step Walkthroughs)
                </h2>
                <p className="text-xs text-[#757575] mt-1">
                  Examine detailed step-by-step solutions, explanations, and corresponding examination shortcuts.
                </p>
              </div>

              {/* Examples List */}
              <div className="pt-6 space-y-6">
                {topic.solvedExamples?.map((ex, idx) => (
                  <div 
                    key={idx}
                    className="p-6 rounded-3xl bg-[#FAF9F6] border border-black/8 space-y-4"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold px-3 py-1 rounded-full bg-black text-white">
                        Example {idx + 1}: {ex.title || `Problem ${idx + 1}`}
                      </span>
                      {ex.finalAnswer && (
                        <span className="text-xs px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                          Answer: {ex.finalAnswer}
                        </span>
                      )}
                    </div>

                    <p className="text-sm font-bold text-black leading-snug">
                      {ex.question}
                    </p>

                    {/* Step-by-Step Solution */}
                    <div className="p-4 rounded-2xl bg-white border border-black/5 space-y-2">
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-400">
                        Step-by-Step Derivation
                      </span>
                      <p className="text-xs text-neutral-700 leading-relaxed whitespace-pre-line font-medium">
                        {ex.solution}
                      </p>
                    </div>

                    {/* Explanation */}
                    {ex.explanation && (
                      <p className="text-xs text-[#757575] leading-relaxed">
                        <strong className="text-black">Why this works:</strong> {ex.explanation}
                      </p>
                    )}

                    {/* Shortcut method */}
                    {ex.shortcut && (
                      <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-2">
                        <Zap className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                        <div className="text-xs text-amber-900">
                          <strong>Examination Shortcut:</strong> {ex.shortcut}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-8 pt-6 border-t border-black/8 flex items-center justify-between">
                <button
                  onClick={() => setActiveTab('formulas')}
                  className="btn-samsung-ghost !text-xs"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Formula Book</span>
                </button>
                <button
                  onClick={() => setActiveTab('practice')}
                  className="btn-samsung !text-xs"
                >
                  <span>Section 5: Practice Questions</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

            </div>

          </div>
        )}

        {/* SECTION 5: PRACTICE QUESTIONS */}
        {activeTab === 'practice' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            
            <div className="samsung-card p-6 sm:p-8 bg-white border border-black/8">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-black/8">
                <div>
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#1428A0]">
                    Section 5 of 7
                  </span>
                  <h2 className="text-2xl font-bold text-black font-heading mt-0.5">
                    Self-Paced Practice Questions
                  </h2>
                </div>

                {/* Difficulty Filter Chips */}
                <div className="flex items-center gap-1.5 overflow-x-auto bg-neutral-100 p-1 rounded-full">
                  {['All', 'Beginner', 'Intermediate', 'Advanced'].map((diff) => (
                    <button
                      key={diff}
                      onClick={() => setPracticeFilter(diff)}
                      className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                        practiceFilter === diff
                          ? 'bg-black text-white'
                          : 'text-neutral-500 hover:text-black'
                      }`}
                    >
                      {diff}
                    </button>
                  ))}
                </div>
              </div>

              {/* Questions List */}
              <div className="pt-6 space-y-6">
                {topic.practiceQuestions
                  ?.filter(q => practiceFilter === 'All' || q.difficulty === practiceFilter)
                  ?.map((q, idx) => {
                    const isRevealed = revealedSolutions[q.id || idx];
                    return (
                      <div 
                        key={q.id || idx}
                        className="p-6 rounded-3xl bg-[#FAF9F6] border border-black/8 space-y-4"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-black">
                            Question {idx + 1}
                          </span>
                          <div className="flex items-center gap-2">
                            {q.previousExamRef && (
                              <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-50 text-[#1428A0] font-semibold">
                                {q.previousExamRef}
                              </span>
                            )}
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-neutral-200 text-neutral-700 font-medium">
                              {q.difficulty}
                            </span>
                          </div>
                        </div>

                        <p className="text-sm font-semibold text-black leading-snug">
                          {q.question}
                        </p>

                        {/* Options */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                          {q.options?.map((opt, optIdx) => (
                            <div 
                              key={optIdx}
                              className={`p-3 rounded-2xl border text-xs font-medium transition-all ${
                                isRevealed && optIdx === q.correctAnswer
                                  ? 'bg-emerald-50 border-emerald-500 text-emerald-900 font-bold'
                                  : 'bg-white border-black/8 text-neutral-700'
                              }`}
                            >
                              <span className="font-bold text-neutral-400 mr-2">
                                {String.fromCharCode(65 + optIdx)})
                              </span>
                              {opt}
                            </div>
                          ))}
                        </div>

                        {/* Toggle Explanation Button */}
                        <div className="pt-2">
                          <button
                            onClick={() => toggleSolution(q.id || idx)}
                            className="text-xs font-bold text-[#1428A0] hover:underline flex items-center gap-1.5"
                          >
                            <HelpCircle className="w-3.5 h-3.5" />
                            <span>{isRevealed ? 'Hide Solution' : 'View Correct Answer & Explanation'}</span>
                          </button>

                          {isRevealed && (
                            <div className="mt-3 p-4 rounded-2xl bg-white border border-emerald-200 text-xs space-y-2 animate-in fade-in">
                              <p className="font-bold text-emerald-700">
                                Correct Answer: Option {String.fromCharCode(65 + q.correctAnswer)} ({q.options[q.correctAnswer]})
                              </p>
                              <p className="text-neutral-700 leading-relaxed">
                                {q.explanation}
                              </p>
                            </div>
                          )}
                        </div>

                      </div>
                    );
                  })}
              </div>

              <div className="mt-8 pt-6 border-t border-black/8 flex items-center justify-between">
                <button
                  onClick={() => setActiveTab('examples')}
                  className="btn-samsung-ghost !text-xs"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Solved Examples</span>
                </button>
                <button
                  onClick={() => setActiveTab('test')}
                  className="btn-samsung !text-xs"
                >
                  <span>Section 6: Topic Test</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

            </div>

          </div>
        )}

        {/* SECTION 6: TOPIC TEST (Interactive CBT Test Engine) */}
        {activeTab === 'test' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            
            {/* Case A: Test Not Started Yet */}
            {!testActive && !testSubmitted && (
              <div className="samsung-card p-8 sm:p-12 bg-white border border-black/8 text-center max-w-2xl mx-auto">
                <div className="w-16 h-16 rounded-3xl bg-black text-white flex items-center justify-center mx-auto mb-4 font-heading text-2xl">
                  {topic.testQuestions?.length || 5}
                </div>
                
                <h2 className="text-2xl font-bold text-black font-heading">
                  {topic.name} Mastery Assessment
                </h2>
                <p className="text-xs text-[#757575] mt-2 leading-relaxed">
                  Test your real-time speed and concept retention. Automatic timer, navigation palette, and instant score evaluation.
                </p>

                <div className="my-6 p-4 rounded-2xl bg-[#FAF9F6] border border-black/5 grid grid-cols-3 gap-2 text-center text-xs">
                  <div>
                    <p className="font-bold text-black">{topic.testQuestions?.length || 5}</p>
                    <p className="text-[10px] text-neutral-400">Questions</p>
                  </div>
                  <div>
                    <p className="font-bold text-black">10 Mins</p>
                    <p className="text-[10px] text-neutral-400">Duration</p>
                  </div>
                  <div>
                    <p className="font-bold text-black">80%</p>
                    <p className="text-[10px] text-neutral-400">Pass Criteria</p>
                  </div>
                </div>

                <button
                  onClick={handleStartTest}
                  className="btn-samsung !text-xs !py-3 !px-8"
                >
                  <span>Start Topic Test</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Case B: Test Currently Active */}
            {testActive && !testSubmitted && (
              <div className="samsung-card p-6 sm:p-8 bg-white border border-black/8 space-y-6">
                
                {/* Timer & Header */}
                <div className="flex items-center justify-between pb-4 border-b border-black/8">
                  <div>
                    <span className="text-[11px] font-mono text-[#1428A0] font-bold uppercase">
                      {topic.name} Test in Progress
                    </span>
                    <h3 className="text-base font-bold text-black">
                      Question {testCurrentIndex + 1} of {topic.testQuestions.length}
                    </h3>
                  </div>

                  {/* Timer */}
                  <div className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full font-mono font-bold text-xs ${
                    testTimerSeconds < 120 
                      ? 'bg-rose-100 text-rose-700 animate-pulse' 
                      : 'bg-neutral-100 text-black'
                  }`}>
                    <Clock className="w-3.5 h-3.5" />
                    <span>{formatTimer(testTimerSeconds)}</span>
                  </div>
                </div>

                {/* Main Question Display */}
                {(() => {
                  const currentQ = topic.testQuestions[testCurrentIndex];
                  const selectedOpt = testAnswers[testCurrentIndex];
                  const isMarked = testMarkedForReview[testCurrentIndex];

                  return (
                    <div className="space-y-6">
                      
                      <div className="p-6 rounded-3xl bg-[#FAF9F6] border border-black/8">
                        <p className="text-base font-bold text-black leading-snug">
                          {currentQ.question}
                        </p>
                      </div>

                      {/* 4 Answer Options */}
                      <div className="space-y-3">
                        {currentQ.options.map((opt, optIdx) => {
                          const isSelected = selectedOpt === optIdx;
                          return (
                            <button
                              key={optIdx}
                              onClick={() => handleSelectOption(testCurrentIndex, optIdx)}
                              className={`w-full text-left p-4 rounded-2xl border text-xs font-semibold transition-all flex items-center justify-between ${
                                isSelected
                                  ? 'bg-[#E8ECF5] border-[#1428A0] text-black shadow-xs'
                                  : 'bg-white border-black/8 text-neutral-700 hover:border-black/30'
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                                  isSelected ? 'bg-[#1428A0] text-white' : 'bg-neutral-100 text-neutral-600'
                                }`}>
                                  {String.fromCharCode(65 + optIdx)}
                                </span>
                                <span>{opt}</span>
                              </div>
                              {isSelected && <CheckCircle2 className="w-4 h-4 text-[#1428A0]" />}
                            </button>
                          );
                        })}
                      </div>

                      {/* Control Action Bar */}
                      <div className="pt-4 border-t border-black/8 flex flex-wrap items-center justify-between gap-3">
                        
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleToggleMarkForReview(testCurrentIndex)}
                            className={`px-3 py-2 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                              isMarked 
                                ? 'bg-amber-500 text-white' 
                                : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                            }`}
                          >
                            <Flag className="w-3.5 h-3.5" />
                            <span>{isMarked ? 'Marked' : 'Mark for Review'}</span>
                          </button>

                          <button
                            onClick={() => handleClearOption(testCurrentIndex)}
                            className="px-3 py-2 rounded-full text-xs font-medium text-neutral-500 hover:text-black"
                          >
                            Clear Response
                          </button>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            disabled={testCurrentIndex === 0}
                            onClick={() => setTestCurrentIndex(prev => prev - 1)}
                            className="btn-samsung-ghost !text-xs !py-2 !px-3 disabled:opacity-40"
                          >
                            <ChevronLeft className="w-4 h-4" />
                            <span>Previous</span>
                          </button>

                          {testCurrentIndex < topic.testQuestions.length - 1 ? (
                            <button
                              onClick={() => setTestCurrentIndex(prev => prev + 1)}
                              className="btn-samsung !text-xs !py-2 !px-4"
                            >
                              <span>Next</span>
                              <ChevronRight className="w-4 h-4" />
                            </button>
                          ) : (
                            <button
                              onClick={handleSubmitTest}
                              disabled={isSubmittingTest}
                              className="btn-samsung-blue !text-xs !py-2 !px-5"
                            >
                              {isSubmittingTest ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Submit Test</span>}
                            </button>
                          )}
                        </div>

                      </div>

                      {/* Question Navigation Palette */}
                      <div className="pt-4 border-t border-black/8">
                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-400 block mb-2">
                          Question Palette
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {topic.testQuestions.map((_, pIdx) => {
                            const isAnswered = testAnswers[pIdx] !== undefined;
                            const isMarkedP = testMarkedForReview[pIdx];
                            const isCurr = testCurrentIndex === pIdx;

                            return (
                              <button
                                key={pIdx}
                                onClick={() => setTestCurrentIndex(pIdx)}
                                className={`w-8 h-8 rounded-xl font-bold text-xs transition-all ${
                                  isCurr 
                                    ? 'ring-2 ring-black font-extrabold' 
                                    : ''
                                } ${
                                  isMarkedP 
                                    ? 'bg-amber-500 text-white' 
                                    : isAnswered 
                                      ? 'bg-[#1428A0] text-white' 
                                      : 'bg-neutral-100 text-neutral-600'
                                }`}
                              >
                                {pIdx + 1}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                    </div>
                  );
                })()}

              </div>
            )}

            {/* Case C: Post-Submission Results Dashboard */}
            {testSubmitted && testResult && (
              <div className="samsung-card p-6 sm:p-10 bg-white border border-black/8 space-y-8">
                
                <div className="text-center pb-6 border-b border-black/8">
                  <div className="w-16 h-16 rounded-full mx-auto flex items-center justify-center font-bold text-2xl mb-3 bg-[#E8ECF5] text-[#1428A0]">
                    {testResult.accuracy}%
                  </div>
                  <h3 className="text-2xl font-bold text-black font-heading">
                    {testResult.masteryLevel === 'Mastered' ? 'Topic Mastered!' : 'Assessment Complete'}
                  </h3>
                  <p className="text-xs text-[#757575] mt-1">
                    Your test attempt has been evaluated and recorded to your learning performance records.
                  </p>
                </div>

                {/* Metrics Breakdown Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                  <div className="p-4 rounded-2xl bg-neutral-50 border border-black/5">
                    <p className="text-xs text-neutral-400">Score</p>
                    <p className="text-xl font-bold text-black mt-1">
                      {testResult.score} / {testResult.totalQuestions}
                    </p>
                  </div>
                  <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100">
                    <p className="text-xs text-emerald-600">Correct</p>
                    <p className="text-xl font-bold text-emerald-700 mt-1">
                      {testResult.correctCount}
                    </p>
                  </div>
                  <div className="p-4 rounded-2xl bg-rose-50 border border-rose-100">
                    <p className="text-xs text-rose-600">Incorrect</p>
                    <p className="text-xl font-bold text-rose-700 mt-1">
                      {testResult.incorrectCount}
                    </p>
                  </div>
                  <div className="p-4 rounded-2xl bg-blue-50 border border-blue-100">
                    <p className="text-xs text-[#1428A0]">Topic Mastery</p>
                    <p className="text-xl font-bold text-[#1428A0] mt-1">
                      {testResult.masteryLevel}
                    </p>
                  </div>
                </div>

                {/* Review Questions & Explanations */}
                <div className="space-y-4 pt-4">
                  <h4 className="text-sm font-bold text-black font-heading">Detailed Answers & Explanations</h4>
                  {testResult.questions?.map((q, idx) => (
                    <div 
                      key={idx}
                      className={`p-5 rounded-2xl border ${
                        q.isCorrect ? 'bg-emerald-50/40 border-emerald-200' : 'bg-rose-50/40 border-rose-200'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-black">Question {idx + 1}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          q.isCorrect ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
                        }`}>
                          {q.isCorrect ? 'Correct (+1)' : 'Incorrect'}
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-black">{q.question}</p>
                      
                      <div className="mt-2 text-xs space-y-1">
                        <p className="text-neutral-700">
                          <strong>Your Answer:</strong> {q.selectedOption >= 0 ? q.options[q.selectedOption] : 'Not Attempted'}
                        </p>
                        <p className="text-emerald-800 font-bold">
                          <strong>Correct Answer:</strong> {q.options[q.correctAnswer]}
                        </p>
                      </div>

                      <div className="mt-3 p-3 rounded-xl bg-white border border-black/5 text-xs text-neutral-600">
                        <strong>Explanation:</strong> {q.explanation}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t border-black/8 flex justify-center gap-4">
                  <button
                    onClick={handleStartTest}
                    className="btn-samsung-ghost !text-xs"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Retake Topic Test</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('performance')}
                    className="btn-samsung !text-xs"
                  >
                    <span>View Overall Performance</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

              </div>
            )}

          </div>
        )}

        {/* SECTION 7: PERFORMANCE */}
        {activeTab === 'performance' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            
            <div className="samsung-card p-6 sm:p-10 bg-white border border-black/8">
              
              <div className="pb-6 border-b border-black/8">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#1428A0]">
                  Section 7 of 7
                </span>
                <h2 className="text-2xl font-bold text-black font-heading mt-0.5">
                  Topic Mastery & Performance Metrics
                </h2>
                <p className="text-xs text-[#757575] mt-1">
                  Individual topic analytics, completion badges, and readiness status.
                </p>
              </div>

              <div className="pt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                
                <div className="p-6 rounded-3xl bg-[#FAF9F6] border border-black/5 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-mono text-neutral-400 uppercase font-bold">Topic Status</span>
                    <h3 className="text-lg font-bold text-black mt-1">
                      {isCompleted ? 'Completed & Mastered' : 'In Progress'}
                    </h3>
                    <p className="text-xs text-[#757575] mt-1">
                      {isCompleted 
                        ? 'You have satisfied the conceptual and testing requirements for this topic.' 
                        : 'Complete the Topic Test with 70%+ accuracy to achieve mastery badge.'}
                    </p>
                  </div>
                  <div className="mt-4 pt-4 border-t border-black/5">
                    <button
                      onClick={handleToggleComplete}
                      className="text-xs font-bold text-[#1428A0] hover:underline"
                    >
                      {isCompleted ? 'Mark as Not Completed' : 'Mark as Completed'}
                    </button>
                  </div>
                </div>

                <div className="p-6 rounded-3xl bg-[#FAF9F6] border border-black/5 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-mono text-neutral-400 uppercase font-bold">Topic Test Benchmark</span>
                    <h3 className="text-lg font-bold text-black mt-1">
                      {testResult ? `${testResult.accuracy}% Accuracy` : 'No Recent Attempt'}
                    </h3>
                    <p className="text-xs text-[#757575] mt-1">
                      {testResult 
                        ? `Score: ${testResult.score}/${testResult.totalQuestions} • Time: ${Math.round(testResult.timeSpentSeconds / 60)} mins`
                        : 'Take the Section 6 Topic Test to record your time and score.'}
                    </p>
                  </div>
                  <div className="mt-4 pt-4 border-t border-black/5">
                    <button
                      onClick={() => { setActiveTab('test'); handleStartTest(); }}
                      className="text-xs font-bold text-black hover:text-[#1428A0]"
                    >
                      Launch Test Drill →
                    </button>
                  </div>
                </div>

                <div className="p-6 rounded-3xl bg-[#FAF9F6] border border-black/5 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-mono text-neutral-400 uppercase font-bold">Comprehensive Analytics</span>
                    <h3 className="text-lg font-bold text-black mt-1">
                      Dashboard Sync
                    </h3>
                    <p className="text-xs text-[#757575] mt-1">
                      All your activity syncs with your central Aptitude Pro dashboard across all devices.
                    </p>
                  </div>
                  <div className="mt-4 pt-4 border-t border-black/5">
                    <Link to="/dashboard" className="text-xs font-bold text-[#1428A0] hover:underline">
                      Go to Full Dashboard →
                    </Link>
                  </div>
                </div>

              </div>

            </div>

          </div>
        )}

      </div>

    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getMockTestBySlugApi, submitMockTestApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import confetti from 'canvas-confetti';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { 
  Clock, 
  Flag, 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  ArrowLeft, 
  ArrowRight, 
  ChevronLeft, 
  ChevronRight, 
  RotateCcw, 
  Award, 
  AlertTriangle,
  Loader2,
  FileText
} from 'lucide-react';

export default function TestEnginePage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [test, setTest] = useState(null);
  const [loading, setLoading] = useState(true);

  // CBT State
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({}); // { [questionId]: selectedOptionIndex }
  const [markedForReview, setMarkedForReview] = useState({}); // { [questionId]: boolean }
  const [visitedQuestions, setVisitedQuestions] = useState({ 0: true });
  
  const [secondsRemaining, setSecondsRemaining] = useState(0);
  const [isTestStarted, setIsTestStarted] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [result, setResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [confirmSubmitModal, setConfirmSubmitModal] = useState(false);

  // Active section filter in examination
  const [activeSection, setActiveSection] = useState('All');

  useEffect(() => {
    const fetchTest = async () => {
      setLoading(true);
      try {
        const res = await getMockTestBySlugApi(slug);
        setTest(res.data);
        setSecondsRemaining(res.data.durationMinutes * 60);
      } catch (err) {
        console.error('Error fetching mock test', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTest();
  }, [slug]);

  // Timer Countdown
  useEffect(() => {
    let interval = null;
    if (isTestStarted && !isSubmitted && secondsRemaining > 0) {
      interval = setInterval(() => {
        setSecondsRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            autoSubmitTest();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTestStarted, isSubmitted, secondsRemaining]);

  // Track visited questions
  const goToQuestion = (idx) => {
    setCurrentIndex(idx);
    setVisitedQuestions(prev => ({ ...prev, [idx]: true }));
  };

  const handleSelectOption = (qId, optIdx) => {
    setUserAnswers(prev => ({ ...prev, [qId]: optIdx }));
  };

  const handleClearOption = (qId) => {
    setUserAnswers(prev => {
      const copy = { ...prev };
      delete copy[qId];
      return copy;
    });
  };

  const handleToggleMarkReview = (qId) => {
    setMarkedForReview(prev => ({ ...prev, [qId]: !prev[qId] }));
  };

  const handleSaveAndNext = () => {
    if (currentIndex < (test?.questions?.length || 1) - 1) {
      goToQuestion(currentIndex + 1);
    }
  };

  const handleFinalSubmit = async () => {
    if (submitting) return;
    setSubmitting(true);
    setConfirmSubmitModal(false);

    try {
      const totalTimeSpent = (test.durationMinutes * 60) - secondsRemaining;
      const res = await submitMockTestApi(test.slug, {
        userAnswers,
        timeSpentSeconds: totalTimeSpent
      });

      setResult(res.data);
      setIsSubmitted(true);
      setIsTestStarted(false);

      if (res.data.accuracy >= 70) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
    } catch (err) {
      console.error('Error submitting test', err);
    } finally {
      setSubmitting(false);
    }
  };

  const autoSubmitTest = () => {
    handleFinalSubmit();
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F7F7F7]">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-[#1428A0] animate-spin mx-auto mb-3" />
          <p className="text-xs text-neutral-500">Initializing exam engine...</p>
        </div>
      </div>
    );
  }

  if (!test) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F7F7F7]">
        <div className="text-center bg-white p-8 rounded-3xl border border-black/5 shadow-sm max-w-md">
          <AlertTriangle className="w-10 h-10 text-rose-500 mx-auto mb-3" />
          <h2 className="text-lg font-bold text-black font-heading">Mock Test Not Found</h2>
          <Link to="/mock-tests" className="btn-samsung !text-xs !py-2 mt-4 inline-flex">
            Back to Mock Tests
          </Link>
        </div>
      </div>
    );
  }

  // Section list
  const sections = ['All', ...new Set(test.questions.map(q => q.section))];
  const currentQuestion = test.questions[currentIndex];
  const currentQId = currentQuestion?.id || `q_${currentIndex}`;
  const isCurrentAnswered = userAnswers[currentQId] !== undefined;
  const isCurrentMarked = markedForReview[currentQId];

  // Palette counts
  const answeredCount = Object.keys(userAnswers).length;
  const markedCount = Object.values(markedForReview).filter(Boolean).length;
  const unattemptedCount = test.questions.length - answeredCount;

  return (
    <div className="min-h-screen bg-[#F7F7F7]">
      
      {/* 1. PRE-TEST INSTRUCTIONS SCREEN */}
      {!isTestStarted && !isSubmitted && (
        <div className="py-12 max-w-4xl mx-auto px-4 sm:px-6">
          <div className="samsung-card p-6 sm:p-10 bg-white border border-black/8 space-y-6">
            
            <div className="flex items-center justify-between pb-6 border-b border-black/8">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#1428A0]">
                  Official Simulation Blueprint
                </span>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-black font-heading mt-1">
                  {test.title}
                </h1>
                <p className="text-xs text-[#757575] mt-1">{test.category} • {test.type}</p>
              </div>

              <div className="text-right">
                <span className="text-xs font-mono font-bold bg-neutral-100 px-3 py-1 rounded-full text-black">
                  {test.durationMinutes} Minutes
                </span>
              </div>
            </div>

            {/* Test Configuration Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="p-3.5 rounded-2xl bg-neutral-50 border border-black/5">
                <p className="text-[10px] text-neutral-400 font-mono uppercase">Total Questions</p>
                <p className="text-lg font-bold text-black mt-0.5">{test.totalQuestions}</p>
              </div>
              <div className="p-3.5 rounded-2xl bg-neutral-50 border border-black/5">
                <p className="text-[10px] text-neutral-400 font-mono uppercase">Total Marks</p>
                <p className="text-lg font-bold text-black mt-0.5">{test.totalMarks}</p>
              </div>
              <div className="p-3.5 rounded-2xl bg-neutral-50 border border-black/5">
                <p className="text-[10px] text-neutral-400 font-mono uppercase">Marking Scheme</p>
                <p className="text-xs font-bold text-emerald-700 mt-1.5">+1.0 / -0.25</p>
              </div>
              <div className="p-3.5 rounded-2xl bg-neutral-50 border border-black/5">
                <p className="text-[10px] text-neutral-400 font-mono uppercase">Difficulty</p>
                <p className="text-xs font-bold text-black mt-1.5">{test.difficulty}</p>
              </div>
            </div>

            {/* Instructions list */}
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-bold text-black uppercase tracking-wider font-heading">
                Important Test Instructions
              </h4>
              <ul className="space-y-2 text-xs text-neutral-600 leading-relaxed list-disc pl-5">
                {test.instructions?.map((inst, iIdx) => (
                  <li key={iIdx}>{inst}</li>
                ))}
                <li>Once the examination timer starts, do not refresh or navigate away from the browser tab.</li>
                <li>The test will auto-submit when the countdown reaches 00:00.</li>
              </ul>
            </div>

            {/* Start Button */}
            <div className="pt-6 border-t border-black/8 flex items-center justify-between">
              <Link to="/mock-tests" className="btn-samsung-ghost !text-xs">
                <ArrowLeft className="w-4 h-4" />
                <span>Return to Mock Tests</span>
              </Link>
              <button
                onClick={() => {
                  setIsTestStarted(true);
                  setSecondsRemaining(test.durationMinutes * 60);
                }}
                className="btn-samsung !text-xs !py-3 !px-8"
              >
                <span>I am Ready to Begin</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>
      )}

      {/* 2. LIVE CBT EXAMINATION INTERFACE */}
      {isTestStarted && !isSubmitted && (
        <div className="min-h-screen flex flex-col">
          
          {/* Top Exam Status Bar */}
          <header className="bg-white border-b border-black/10 py-3 px-4 sm:px-8 sticky top-0 z-30 shadow-xs flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-black text-white flex items-center justify-center font-bold text-xs font-heading">
                A
              </div>
              <div>
                <h3 className="text-xs sm:text-sm font-bold text-black truncate max-w-xs sm:max-w-md">
                  {test.title}
                </h3>
                <span className="text-[10px] text-neutral-500 font-mono uppercase">
                  Candidate: {user?.name || 'Aspirant Demo'}
                </span>
              </div>
            </div>

            {/* Countdown Clock & Submit Button */}
            <div className="flex items-center gap-3">
              <div className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full font-mono font-bold text-xs ${
                secondsRemaining < 180 
                  ? 'bg-rose-100 text-rose-700 animate-pulse' 
                  : 'bg-neutral-100 text-black'
              }`}>
                <Clock className="w-4 h-4" />
                <span>{formatTime(secondsRemaining)}</span>
              </div>

              <button
                onClick={() => setConfirmSubmitModal(true)}
                className="btn-samsung-blue !text-xs !py-2 !px-4"
              >
                <span>Submit Test</span>
              </button>
            </div>
          </header>

          {/* Sub Header: Section Selector */}
          <div className="bg-neutral-50 border-b border-black/5 px-4 sm:px-8 py-2 flex items-center gap-2 overflow-x-auto no-scrollbar">
            <span className="text-[10px] font-mono font-bold uppercase text-neutral-400 mr-2 shrink-0">
              Sections:
            </span>
            {sections.map(sec => (
              <button
                key={sec}
                onClick={() => setActiveSection(sec)}
                className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  activeSection === sec 
                    ? 'bg-black text-white' 
                    : 'bg-white text-neutral-600 border border-black/8 hover:border-black/20'
                }`}
              >
                {sec}
              </button>
            ))}
          </div>

          {/* Main Question & Navigation Split */}
          <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left 8 Cols: Question Paper Area */}
            <div className="lg:col-span-8 samsung-card p-6 sm:p-8 bg-white border border-black/8 flex flex-col justify-between">
              <div>
                
                {/* Question Meta Row */}
                <div className="flex items-center justify-between pb-4 border-b border-black/8 mb-6">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-neutral-100 text-black">
                      Question {currentIndex + 1} of {test.questions.length}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#E8ECF5] text-[#1428A0] font-semibold">
                      {currentQuestion.section}
                    </span>
                  </div>

                  <span className="text-[11px] text-neutral-500 font-medium">
                    Marks: <strong className="text-emerald-700">+{currentQuestion.marks || 1}</strong> / <strong className="text-rose-600">-{currentQuestion.negativeMarks || 0.25}</strong>
                  </span>
                </div>

                {/* Question Stem */}
                <p className="text-base sm:text-lg font-bold text-black leading-relaxed mb-6 font-heading">
                  {currentQuestion.question}
                </p>

                {/* Answer Options */}
                <div className="space-y-3">
                  {currentQuestion.options.map((opt, optIdx) => {
                    const isSelected = userAnswers[currentQId] === optIdx;
                    return (
                      <button
                        key={optIdx}
                        onClick={() => handleSelectOption(currentQId, optIdx)}
                        className={`w-full text-left p-4 rounded-2xl border text-xs sm:text-sm font-semibold transition-all flex items-center justify-between ${
                          isSelected
                            ? 'bg-[#E8ECF5] border-[#1428A0] text-black shadow-xs'
                            : 'bg-white border-black/8 text-neutral-700 hover:border-black/30'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                            isSelected ? 'bg-[#1428A0] text-white' : 'bg-neutral-100 text-neutral-600'
                          }`}>
                            {String.fromCharCode(65 + optIdx)}
                          </span>
                          <span>{opt}</span>
                        </div>
                        {isSelected && <CheckCircle2 className="w-5 h-5 text-[#1428A0]" />}
                      </button>
                    );
                  })}
                </div>

              </div>

              {/* Bottom Action Controls */}
              <div className="pt-8 mt-8 border-t border-black/8 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleMarkReview(currentQId)}
                    className={`px-3.5 py-2 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                      isCurrentMarked 
                        ? 'bg-amber-500 text-white' 
                        : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                    }`}
                  >
                    <Flag className="w-3.5 h-3.5" />
                    <span>{isCurrentMarked ? 'Marked' : 'Mark for Review'}</span>
                  </button>

                  <button
                    onClick={() => handleClearOption(currentQId)}
                    className="px-3.5 py-2 rounded-full text-xs font-medium text-neutral-500 hover:text-black transition-colors"
                  >
                    Clear Response
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    disabled={currentIndex === 0}
                    onClick={() => goToQuestion(currentIndex - 1)}
                    className="btn-samsung-ghost !text-xs !py-2 !px-3 disabled:opacity-40"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Previous</span>
                  </button>

                  <button
                    onClick={handleSaveAndNext}
                    className="btn-samsung !text-xs !py-2 !px-5"
                  >
                    <span>Save & Next</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

            </div>

            {/* Right 4 Cols: Navigation Palette */}
            <div className="lg:col-span-4 space-y-6">
              
              <div className="samsung-card p-6 bg-white border border-black/8 space-y-5">
                
                <h4 className="text-xs font-bold text-black uppercase tracking-wider font-heading">
                  Question Palette
                </h4>

                {/* Legend */}
                <div className="grid grid-cols-2 gap-2 text-[11px] text-neutral-600 pb-3 border-b border-black/5">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-[#1428A0]"></span>
                    <span>Answered ({answeredCount})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-amber-500"></span>
                    <span>Marked ({markedCount})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-neutral-200"></span>
                    <span>Unattempted ({unattemptedCount})</span>
                  </div>
                </div>

                {/* Question Grid Buttons */}
                <div className="grid grid-cols-5 gap-2 max-h-72 overflow-y-auto p-1">
                  {test.questions.map((q, idx) => {
                    const qId = q.id || `q_${idx}`;
                    const isAnswered = userAnswers[qId] !== undefined;
                    const isMarked = markedForReview[qId];
                    const isCurrent = currentIndex === idx;

                    return (
                      <button
                        key={idx}
                        onClick={() => goToQuestion(idx)}
                        className={`h-9 rounded-xl font-bold text-xs transition-all ${
                          isCurrent 
                            ? 'ring-2 ring-black scale-105' 
                            : ''
                        } ${
                          isMarked 
                            ? 'bg-amber-500 text-white' 
                            : isAnswered 
                              ? 'bg-[#1428A0] text-white' 
                              : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                        }`}
                      >
                        {idx + 1}
                      </button>
                    );
                  })}
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => setConfirmSubmitModal(true)}
                    className="w-full btn-samsung !text-xs !py-2.5 justify-center"
                  >
                    <span>Final Submit Examination</span>
                  </button>
                </div>

              </div>

            </div>

          </div>

          {/* Submission Confirmation Modal */}
          {confirmSubmitModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
              <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-black/10 text-center space-y-4">
                <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto" />
                <h3 className="text-xl font-bold text-black font-heading">
                  Submit Examination?
                </h3>
                <p className="text-xs text-[#757575] leading-relaxed">
                  You have answered <strong>{answeredCount}</strong> of <strong>{test.totalQuestions}</strong> questions. Once submitted, your scores and section performance will be calculated immediately.
                </p>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <button
                    onClick={() => setConfirmSubmitModal(false)}
                    className="py-2.5 rounded-full border border-black/20 text-xs font-semibold text-black hover:bg-neutral-50"
                  >
                    Resume Exam
                  </button>
                  <button
                    onClick={handleFinalSubmit}
                    disabled={submitting}
                    className="py-2.5 rounded-full bg-black text-white text-xs font-semibold hover:bg-neutral-800"
                  >
                    {submitting ? 'Submitting...' : 'Yes, Submit'}
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      )}

      {/* 3. POST-SUBMISSION COMPREHENSIVE RESULT DASHBOARD */}
      {isSubmitted && result && (
        <div className="py-12 max-w-5xl mx-auto px-4 sm:px-6 space-y-8 animate-in fade-in duration-300">
          
          {/* Result Hero Banner */}
          <div className="samsung-card p-6 sm:p-10 bg-white border border-black/8 text-center space-y-4">
            <div className="w-20 h-20 rounded-full bg-[#E8ECF5] text-[#1428A0] font-heading font-extrabold text-3xl flex items-center justify-center mx-auto shadow-inner">
              {result.score}
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-black font-heading">
              Examination Performance Evaluation
            </h1>
            <p className="text-xs sm:text-sm text-[#757575] max-w-lg mx-auto">
              Test: <strong>{result.testTitle}</strong> • Total Marks: <strong>{result.maxMarks}</strong> • Accuracy: <strong>{result.accuracy}%</strong>
            </p>

            {/* Scorecard Metric Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto pt-4">
              <div className="p-4 rounded-2xl bg-neutral-50 border border-black/5">
                <p className="text-[10px] text-neutral-400 font-mono uppercase">Total Score</p>
                <p className="text-xl font-bold text-black mt-0.5">{result.score} / {result.maxMarks}</p>
              </div>
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100">
                <p className="text-[10px] text-emerald-600 font-mono uppercase">Correct</p>
                <p className="text-xl font-bold text-emerald-700 mt-0.5">{result.correctCount}</p>
              </div>
              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-100">
                <p className="text-[10px] text-rose-600 font-mono uppercase">Incorrect</p>
                <p className="text-xl font-bold text-rose-700 mt-0.5">{result.incorrectCount}</p>
              </div>
              <div className="p-4 rounded-2xl bg-neutral-50 border border-black/5">
                <p className="text-[10px] text-neutral-400 font-mono uppercase">Time Spent</p>
                <p className="text-xl font-bold text-black mt-0.5">{Math.round(result.timeSpentSeconds / 60)} Mins</p>
              </div>
            </div>
          </div>

          {/* Section-Wise Visual Analytics (Recharts Bar Chart) */}
          {result.sectionWise?.length > 0 && (
            <div className="samsung-card p-6 sm:p-8 bg-white border border-black/8 space-y-6">
              <h3 className="text-base font-bold text-black font-heading">
                Section-Wise Score & Accuracy Analysis
              </h3>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={result.sectionWise} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <XAxis dataKey="section" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#000000', borderRadius: '12px', color: '#FFFFFF', fontSize: '12px' }}
                    />
                    <Bar dataKey="score" name="Marks Scored" fill="#1428A0" radius={[6, 6, 0, 0]} />
                    <Bar dataKey="accuracy" name="Accuracy %" fill="#10B981" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Section cards breakdown */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                {result.sectionWise.map((sec, sIdx) => (
                  <div key={sIdx} className="p-4 rounded-2xl bg-[#FAF9F6] border border-black/5 text-xs space-y-1">
                    <p className="font-bold text-black">{sec.section}</p>
                    <p className="text-neutral-500">Score: <strong className="text-black">{sec.score}</strong> | Correct: <strong className="text-emerald-700">{sec.correct}</strong></p>
                    <p className="text-neutral-500">Accuracy: <strong className="text-[#1428A0]">{sec.accuracy}%</strong></p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Question-by-Question Solution Review */}
          <div className="samsung-card p-6 sm:p-8 bg-white border border-black/8 space-y-6">
            <h3 className="text-base font-bold text-black font-heading">
              Complete Question Review & Explanations ({result.answers?.length} Questions)
            </h3>

            <div className="space-y-4">
              {result.answers?.map((ans, idx) => (
                <div 
                  key={idx}
                  className={`p-5 rounded-2xl border ${
                    ans.isCorrect 
                      ? 'bg-emerald-50/40 border-emerald-200' 
                      : ans.selectedOption === -1 
                        ? 'bg-neutral-50 border-neutral-200' 
                        : 'bg-rose-50/40 border-rose-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-black">Question {idx + 1} ({ans.section})</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      ans.isCorrect 
                        ? 'bg-emerald-600 text-white' 
                        : ans.selectedOption === -1 
                          ? 'bg-neutral-200 text-neutral-700' 
                          : 'bg-rose-600 text-white'
                    }`}>
                      {ans.isCorrect ? 'Correct (+1.0)' : ans.selectedOption === -1 ? 'Unattempted (0)' : 'Incorrect (-0.25)'}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm font-semibold text-black leading-snug">{ans.questionText}</p>

                  <div className="mt-3 text-xs space-y-1">
                    <p className="text-neutral-700">
                      <strong>Your Answer:</strong> {ans.selectedOption >= 0 ? ans.options[ans.selectedOption] : 'Not Attempted'}
                    </p>
                    <p className="text-emerald-800 font-bold">
                      <strong>Correct Answer:</strong> {ans.options[ans.correctAnswer]}
                    </p>
                  </div>

                  <div className="mt-3 p-3 rounded-xl bg-white border border-black/5 text-xs text-neutral-600">
                    <strong>Explanation:</strong> {ans.explanation}
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-6 border-t border-black/8 flex items-center justify-center gap-4">
              <Link to="/mock-tests" className="btn-samsung-ghost !text-xs">
                <span>Explore Other Tests</span>
              </Link>
              <Link to="/dashboard" className="btn-samsung !text-xs">
                <span>Go to User Analytics Hub</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

          </div>

        </div>
      )}

    </div>
  );
}

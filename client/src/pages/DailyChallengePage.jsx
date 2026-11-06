import React, { useState, useEffect } from 'react';
import { getTodayChallengeApi, submitDailyChallengeApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import confetti from 'canvas-confetti';
import { 
  Flame, 
  Clock, 
  CheckCircle2, 
  Award, 
  ArrowRight, 
  RotateCcw, 
  HelpCircle, 
  Sparkles,
  Loader2,
  Calendar
} from 'lucide-react';

export default function DailyChallengePage() {
  const { user } = useAuth();
  
  const [challenge, setChallenge] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Test State
  const [answers, setAnswers] = useState({});
  const [isStarted, setIsStarted] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(900); // 15 mins
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [result, setResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchChallenge = async () => {
      setLoading(true);
      try {
        const res = await getTodayChallengeApi();
        setChallenge(res.data);
        setTimerSeconds(res.data.durationMinutes * 60);
      } catch (err) {
        console.error('Error fetching daily challenge', err);
      } finally {
        setLoading(false);
      }
    };
    fetchChallenge();
  }, []);

  // Countdown
  useEffect(() => {
    let interval = null;
    if (isStarted && !isSubmitted && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            handleSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isStarted, isSubmitted, timerSeconds]);

  const handleSelectOption = (qId, optIdx) => {
    setAnswers(prev => ({ ...prev, [qId]: optIdx }));
  };

  const handleSubmit = async () => {
    if (submitting) return;
    setSubmitting(true);
    try {
      const timeSpent = (challenge.durationMinutes * 60) - timerSeconds;
      const res = await submitDailyChallengeApi({
        dateString: challenge.dateString,
        answers,
        timeSpentSeconds: timeSpent
      });

      setResult(res.data);
      setIsSubmitted(true);
      setIsStarted(false);

      if (res.data.accuracy >= 60) {
        confetti({
          particleCount: 90,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
    } catch (err) {
      console.error('Error submitting daily challenge', err);
    } finally {
      setSubmitting(false);
    }
  };

  const formatTimer = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F7F7F7]">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-[#1428A0] animate-spin mx-auto mb-3" />
          <p className="text-xs text-neutral-500">Preparing today’s 15-question sprint...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F7F7] pb-24">
      
      {/* Header */}
      <section className="bg-white border-b border-black/5 pt-12 pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-xs font-bold">
                  <Flame className="w-4 h-4 fill-amber-500" />
                  Streak Active: {result?.streak || user?.streak || 1} Days
                </span>
                <span className="text-xs text-neutral-400 font-mono">
                  {challenge?.dateString}
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-black tracking-tight font-heading">
                Daily Aptitude Challenge
              </h1>
              <p className="text-xs sm:text-sm text-[#757575] mt-1 max-w-xl">
                A daily sprint composed of 5 Quantitative, 5 Logical, and 5 Verbal questions. Maintain your streak and sharpen exam reflexes.
              </p>
            </div>

            {isStarted && !isSubmitted && (
              <div className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-black text-white font-mono font-bold text-sm">
                <Clock className="w-4 h-4 text-emerald-400" />
                <span>{formatTimer(timerSeconds)}</span>
              </div>
            )}
          </div>

        </div>
      </section>

      {/* Main Container */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-8 space-y-8">
        
        {/* Pre-Start Screen */}
        {!isStarted && !isSubmitted && (
          <div className="samsung-card p-6 sm:p-10 bg-white border border-black/8 text-center space-y-6">
            <div className="w-16 h-16 rounded-3xl bg-amber-500 text-white flex items-center justify-center mx-auto shadow-md">
              <Flame className="w-8 h-8 fill-white" />
            </div>

            <h2 className="text-2xl font-bold text-black font-heading">
              Ready for Today’s 15-Question Sprint?
            </h2>
            <p className="text-xs text-[#757575] max-w-md mx-auto leading-relaxed">
              Equally distributed across Quant, Reasoning, and Verbal. Score 60% or higher to advance your learning streak.
            </p>

            <div className="grid grid-cols-3 gap-3 max-w-md mx-auto py-2">
              <div className="p-3 rounded-2xl bg-neutral-50 text-center">
                <p className="text-xs font-bold text-black">5 Qs</p>
                <p className="text-[10px] text-neutral-400">Quant</p>
              </div>
              <div className="p-3 rounded-2xl bg-neutral-50 text-center">
                <p className="text-xs font-bold text-black">5 Qs</p>
                <p className="text-[10px] text-neutral-400">Logical</p>
              </div>
              <div className="p-3 rounded-2xl bg-neutral-50 text-center">
                <p className="text-xs font-bold text-black">5 Qs</p>
                <p className="text-[10px] text-neutral-400">Verbal</p>
              </div>
            </div>

            <button
              onClick={() => {
                setIsStarted(true);
                setTimerSeconds(challenge.durationMinutes * 60);
              }}
              className="btn-samsung !text-xs !py-3 !px-8"
            >
              <span>Begin Today’s Sprint</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Live Challenge Questions List */}
        {isStarted && !isSubmitted && (
          <div className="space-y-6">
            {challenge.questions.map((q, idx) => {
              const qId = q.id || `dq_${idx}`;
              const selected = answers[qId];

              return (
                <div key={qId} className="samsung-card p-6 bg-white border border-black/8 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-black text-white">
                      Question {idx + 1}
                    </span>
                    <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-[#E8ECF5] text-[#1428A0] font-semibold">
                      {q.section}
                    </span>
                  </div>

                  <p className="text-sm font-semibold text-black leading-snug">
                    {q.question}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                    {q.options.map((opt, optIdx) => {
                      const isSelected = selected === optIdx;
                      return (
                        <button
                          key={optIdx}
                          onClick={() => handleSelectOption(qId, optIdx)}
                          className={`text-left p-3.5 rounded-2xl border text-xs font-semibold transition-all flex items-center justify-between ${
                            isSelected 
                              ? 'bg-[#E8ECF5] border-[#1428A0] text-black' 
                              : 'bg-white border-black/8 text-neutral-700 hover:border-black/30'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
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
                </div>
              );
            })}

            {/* Bottom Submit Sticky Button */}
            <div className="pt-4 flex justify-end">
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="btn-samsung !text-xs !py-3 !px-8"
              >
                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Submit Daily Challenge</span>}
              </button>
            </div>
          </div>
        )}

        {/* Post-Submission Result */}
        {isSubmitted && result && (
          <div className="samsung-card p-6 sm:p-10 bg-white border border-black/8 space-y-8 animate-in fade-in">
            <div className="text-center space-y-3">
              <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto shadow-sm">
                <Flame className="w-8 h-8 fill-amber-500" />
              </div>
              <h2 className="text-2xl font-bold text-black font-heading">
                Daily Sprint Completed!
              </h2>
              <p className="text-xs text-[#757575]">
                Date: <strong>{result.dateString}</strong> • Streak updated to <strong>{result.streak} Days</strong>
              </p>

              {/* Metrics */}
              <div className="grid grid-cols-3 gap-3 max-w-md mx-auto pt-4">
                <div className="p-3.5 rounded-2xl bg-neutral-50 text-center">
                  <p className="text-[10px] text-neutral-400">Score</p>
                  <p className="text-lg font-bold text-black">{result.score} / {result.totalQuestions}</p>
                </div>
                <div className="p-3.5 rounded-2xl bg-emerald-50 text-center">
                  <p className="text-[10px] text-emerald-600">Accuracy</p>
                  <p className="text-lg font-bold text-emerald-700">{result.accuracy}%</p>
                </div>
                <div className="p-3.5 rounded-2xl bg-amber-50 text-center">
                  <p className="text-[10px] text-amber-600">Streak</p>
                  <p className="text-lg font-bold text-amber-700">{result.streak}d</p>
                </div>
              </div>
            </div>

            {/* Detailed Questions Review */}
            <div className="space-y-4 pt-4 border-t border-black/8">
              <h3 className="text-sm font-bold text-black font-heading">Sprint Questions Review</h3>
              {result.questions?.map((q, idx) => (
                <div
                  key={idx}
                  className={`p-5 rounded-2xl border ${
                    q.isCorrect ? 'bg-emerald-50/40 border-emerald-200' : 'bg-rose-50/40 border-rose-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-black">Question {idx + 1} ({q.section})</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      q.isCorrect ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
                    }`}>
                      {q.isCorrect ? 'Correct (+1)' : 'Incorrect (0)'}
                    </span>
                  </div>

                  <p className="text-xs font-semibold text-black">{q.question}</p>

                  <div className="mt-2 text-xs space-y-1">
                    <p className="text-neutral-700">
                      <strong>Your Answer:</strong> {q.selectedOption >= 0 ? q.options[q.selectedOption] : 'Unattempted'}
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

            <div className="pt-4 flex justify-center">
              <button
                onClick={() => {
                  setIsSubmitted(false);
                  setIsStarted(true);
                  setAnswers({});
                  setTimerSeconds(challenge.durationMinutes * 60);
                }}
                className="btn-samsung-ghost !text-xs flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Retry Daily Sprint</span>
              </button>
            </div>
          </div>
        )}

      </div>

    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getMyAttemptsApi, getTopicsApi } from '../services/api';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart, 
  Line 
} from 'recharts';
import { 
  User, 
  Flame, 
  Award, 
  Clock, 
  BookOpen, 
  CheckCircle2, 
  Bookmark, 
  ArrowRight, 
  TrendingUp, 
  RotateCcw,
  Sparkles,
  Loader2
} from 'lucide-react';

export default function DashboardPage() {
  const { user, openLoginModal } = useAuth();
  
  const [attempts, setAttempts] = useState([]);
  const [recommendedTopics, setRecommendedTopics] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const [attRes, topRes] = await Promise.all([
          getMyAttemptsApi().catch(() => ({ data: [] })),
          getTopicsApi().catch(() => ({ data: [] }))
        ]);
        setAttempts(attRes.data);
        // Recommend topics not yet completed
        const completed = user.completedTopics || [];
        const uncompleted = topRes.data.filter(t => !completed.includes(t.slug)).slice(0, 4);
        setRecommendedTopics(uncompleted);
      } catch (err) {
        console.error('Error fetching dashboard data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F7F7F7] px-4">
        <div className="samsung-card p-8 sm:p-12 bg-white border border-black/8 text-center max-w-md w-full space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-black text-white flex items-center justify-center mx-auto text-xl font-bold font-heading">
            A
          </div>
          <h2 className="text-2xl font-bold text-black font-heading">
            Sign In to Access Your Dashboard
          </h2>
          <p className="text-xs text-[#757575] leading-relaxed">
            Monitor your exam accuracy trends, track topic mastery badges, review completed mock tests, and save high-frequency formulas.
          </p>
          <button
            onClick={openLoginModal}
            className="btn-samsung !text-xs !py-3 !w-full justify-center"
          >
            <span>Log In or Create Account</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  // Calculate stats
  const totalTests = user.stats?.testsAttempted || attempts.length || 0;
  const totalCorrect = user.stats?.correctAnswers || 0;
  const totalQ = user.stats?.totalQuestions || 1;
  const avgAccuracy = Math.round((totalCorrect / totalQ) * 100) || 75;
  const totalHours = Math.round(((user.stats?.totalTimeSpentSec || 7200) / 3600) * 10) / 10;
  const completedTopicsCount = user.completedTopics?.length || 0;
  const currentStreak = user.streak || 1;

  // Chart data from attempts
  const chartData = attempts.slice(0, 7).reverse().map((att, idx) => ({
    name: `Test ${idx + 1}`,
    score: att.score,
    accuracy: att.accuracy,
    title: att.testTitle
  }));

  // Fallback chart data if new user
  const displayChartData = chartData.length > 0 ? chartData : [
    { name: 'Mock 1', score: 10, accuracy: 68 },
    { name: 'Mock 2', score: 12, accuracy: 75 },
    { name: 'Mock 3', score: 14, accuracy: 82 },
    { name: 'Mock 4', score: 15, accuracy: 88 }
  ];

  return (
    <div className="min-h-screen bg-[#F7F7F7] pb-24">
      
      {/* Top Welcome Banner */}
      <section className="bg-white border-b border-black/5 pt-12 pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-3xl bg-black text-white font-heading font-extrabold text-2xl flex items-center justify-center shrink-0 uppercase">
                {user.name.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#E8ECF5] text-[#1428A0]">
                    {user.targetExam || 'General Aptitude Aspirant'}
                  </span>
                  <span className="flex items-center gap-1 text-xs font-bold text-amber-600">
                    <Flame className="w-3.5 h-3.5 fill-amber-500" />
                    {currentStreak} Day Streak
                  </span>
                </div>
                <h1 className="text-2xl sm:text-4xl font-extrabold text-black font-heading">
                  Welcome back, {user.name}
                </h1>
                <p className="text-xs text-[#757575] mt-0.5">
                  Account: {user.email} • Role: {user.role.toUpperCase()}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Link to="/daily-challenge" className="btn-samsung !text-xs !py-2.5">
                <Flame className="w-4 h-4 fill-amber-400" />
                <span>Today's Daily Challenge</span>
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        
        {/* Key Metrics Grid (5 Cards) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          <div className="samsung-card p-5 bg-white border border-black/8">
            <span className="text-[10px] font-mono text-neutral-400 uppercase font-bold">Tests Attempted</span>
            <p className="text-2xl font-bold text-black font-heading mt-1">{totalTests}</p>
            <p className="text-[11px] text-neutral-500 mt-0.5">Exam drills logged</p>
          </div>

          <div className="samsung-card p-5 bg-white border border-black/8">
            <span className="text-[10px] font-mono text-neutral-400 uppercase font-bold">Average Accuracy</span>
            <p className="text-2xl font-bold text-emerald-700 font-heading mt-1">{avgAccuracy}%</p>
            <p className="text-[11px] text-emerald-600 mt-0.5">Performance index</p>
          </div>

          <div className="samsung-card p-5 bg-white border border-black/8">
            <span className="text-[10px] font-mono text-neutral-400 uppercase font-bold">Learning Hours</span>
            <p className="text-2xl font-bold text-black font-heading mt-1">{totalHours}h</p>
            <p className="text-[11px] text-neutral-500 mt-0.5">Total engagement</p>
          </div>

          <div className="samsung-card p-5 bg-white border border-black/8">
            <span className="text-[10px] font-mono text-neutral-400 uppercase font-bold">Completed Topics</span>
            <p className="text-2xl font-bold text-[#1428A0] font-heading mt-1">{completedTopicsCount}</p>
            <p className="text-[11px] text-[#1428A0] mt-0.5">Syllabus modules</p>
          </div>

          <div className="samsung-card p-5 bg-white border border-black/8">
            <span className="text-[10px] font-mono text-neutral-400 uppercase font-bold">Active Streak</span>
            <p className="text-2xl font-bold text-amber-600 font-heading mt-1">{currentStreak} Days</p>
            <p className="text-[11px] text-amber-600 mt-0.5">Daily consistency</p>
          </div>
        </div>

        {/* Visual Charts & Continue Learning Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left 8 Cols: Accuracy & Score Trends (Recharts) */}
          <div className="lg:col-span-8 samsung-card p-6 sm:p-8 bg-white border border-black/8 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-black/8">
              <div>
                <h3 className="text-base font-bold text-black font-heading">
                  Accuracy & Score Progression
                </h3>
                <p className="text-xs text-[#757575] mt-0.5">
                  Visual tracking of your examination scores over successive attempts.
                </p>
              </div>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-neutral-100 text-neutral-600 font-medium">
                Recent Attempts
              </span>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={displayChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#000000', borderRadius: '12px', color: '#FFFFFF', fontSize: '12px' }}
                  />
                  <Line type="monotone" dataKey="score" stroke="#1428A0" strokeWidth={3} dot={{ r: 4 }} name="Score" />
                  <Line type="monotone" dataKey="accuracy" stroke="#10B981" strokeWidth={2} strokeDasharray="4 4" name="Accuracy %" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Right 4 Cols: Continue Learning & Shortcuts */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Continue Learning card */}
            <div className="samsung-card p-6 bg-white border border-black/8 space-y-4">
              <h4 className="text-sm font-bold text-black font-heading flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-[#1428A0]" />
                <span>Continue Learning</span>
              </h4>

              <div className="space-y-3">
                <Link
                  to="/learn/percentage"
                  className="block p-3.5 rounded-2xl bg-[#FAF9F6] border border-black/5 hover:border-black/20 transition-all group"
                >
                  <p className="text-xs font-bold text-black group-hover:text-[#1428A0]">
                    Quantitative: Percentage
                  </p>
                  <p className="text-[11px] text-neutral-500 mt-0.5">Core concepts & successive changes</p>
                </Link>

                <Link
                  to="/learn/time-and-work"
                  className="block p-3.5 rounded-2xl bg-[#FAF9F6] border border-black/5 hover:border-black/20 transition-all group"
                >
                  <p className="text-xs font-bold text-black group-hover:text-[#1428A0]">
                    Quantitative: Time & Work
                  </p>
                  <p className="text-[11px] text-neutral-500 mt-0.5">Efficiency LCM methods & wages</p>
                </Link>
              </div>

              <Link
                to="/learn"
                className="w-full btn-samsung-ghost !text-xs !py-2 justify-center"
              >
                <span>Browse Full Syllabus</span>
              </Link>
            </div>

            {/* Saved Formulas quick access */}
            <div className="samsung-card p-6 bg-white border border-black/8 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-black font-heading flex items-center gap-2">
                  <Bookmark className="w-4 h-4 text-[#1428A0]" />
                  <span>Saved Formulas</span>
                </h4>
                <span className="text-xs font-bold text-[#1428A0]">
                  {user.savedFormulas?.length || 0}
                </span>
              </div>
              <p className="text-xs text-[#757575]">
                Formulas bookmarked during your preparation are stored in your personal collection.
              </p>
              <Link
                to="/formulas?filter=saved"
                className="inline-flex text-xs font-bold text-black hover:text-[#1428A0] pt-1"
              >
                Open Bookmarked Formulas →
              </Link>
            </div>

          </div>

        </div>

        {/* Recommended Topics */}
        {recommendedTopics.length > 0 && (
          <div className="samsung-card p-6 sm:p-8 bg-white border border-black/8 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-black/8">
              <div>
                <h3 className="text-base font-bold text-black font-heading">
                  Recommended Modules for {user.targetExam || 'Your Goal'}
                </h3>
                <p className="text-xs text-[#757575] mt-0.5">
                  High-frequency aptitude modules prioritized for your chosen target track.
                </p>
              </div>
              <Link to="/learn" className="text-xs font-bold text-[#1428A0] hover:underline">
                View All Topics
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {recommendedTopics.map((top) => (
                <Link
                  key={top.slug}
                  to={`/learn/${top.slug}`}
                  className="p-5 rounded-3xl bg-[#FAF9F6] border border-black/5 hover:border-[#1428A0]/30 transition-all flex flex-col justify-between group"
                >
                  <div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#E8ECF5] text-[#1428A0] font-semibold">
                      {top.category.split(' ')[0]}
                    </span>
                    <h4 className="text-sm font-bold text-black group-hover:text-[#1428A0] font-heading mt-2">
                      {top.name}
                    </h4>
                    <p className="text-[11px] text-[#757575] mt-1 line-clamp-2">
                      {top.summary}
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-black/5 flex items-center justify-between text-xs font-bold text-black">
                    <span>Study Now</span>
                    <ArrowRight className="w-3.5 h-3.5 text-neutral-400 group-hover:text-black group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Recent Attempts History Table */}
        <div className="samsung-card p-6 sm:p-8 bg-white border border-black/8 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-black/8">
            <h3 className="text-base font-bold text-black font-heading">
              Recently Attempted Examinations
            </h3>
            <Link to="/mock-tests" className="text-xs font-bold text-[#1428A0] hover:underline">
              Take New Test
            </Link>
          </div>

          {attempts.length === 0 ? (
            <div className="py-8 text-center text-xs text-neutral-400">
              No examination attempts yet. Take a full mock or sectional test to record history.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-neutral-50 text-neutral-500 uppercase text-[10px] border-b border-black/5">
                  <tr>
                    <th className="p-3">Test Title</th>
                    <th className="p-3">Category</th>
                    <th className="p-3">Score</th>
                    <th className="p-3">Accuracy</th>
                    <th className="p-3">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/5 text-neutral-700">
                  {attempts.map((att) => (
                    <tr key={att._id} className="hover:bg-neutral-50/50">
                      <td className="p-3 font-bold text-black">{att.testTitle}</td>
                      <td className="p-3">{att.category}</td>
                      <td className="p-3 font-semibold text-black">{att.score} / {att.maxMarks}</td>
                      <td className="p-3 font-bold text-emerald-700">{att.accuracy}%</td>
                      <td className="p-3 text-neutral-400 font-mono">
                        {new Date(att.completedAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getTopicsApi, getMockTestsApi } from '../services/api';
import { 
  Zap, 
  Clock, 
  Target, 
  ArrowRight, 
  Flame, 
  CheckCircle2, 
  Sparkles,
  Calculator,
  Cpu,
  PenTool,
  BarChart,
  Server,
  Loader2
} from 'lucide-react';

export default function PracticePage() {
  const navigate = useNavigate();
  const [topics, setTopics] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState('Quantitative Aptitude');
  const [loading, setLoading] = useState(true);

  const subjects = [
    { name: 'Quantitative Aptitude', icon: Calculator, color: 'bg-black text-white' },
    { name: 'Logical Reasoning', icon: Cpu, color: 'bg-[#1428A0] text-white' },
    { name: 'Verbal Ability', icon: PenTool, color: 'bg-neutral-800 text-white' },
    { name: 'Data Interpretation', icon: BarChart, color: 'bg-neutral-700 text-white' },
    { name: 'Computer Aptitude', icon: Server, color: 'bg-neutral-900 text-white' },
  ];

  useEffect(() => {
    const fetchTopics = async () => {
      setLoading(true);
      try {
        const res = await getTopicsApi({ category: selectedSubject });
        setTopics(res.data);
      } catch (err) {
        console.error('Error fetching practice topics', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTopics();
  }, [selectedSubject]);

  return (
    <div className="min-h-screen bg-[#F7F7F7] pb-24">
      
      {/* Header Banner */}
      <section className="bg-white border-b border-black/5 pt-12 pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="max-w-2xl">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#1428A0]">
              Skill Sharpening Engine
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-black tracking-tight mt-2 font-heading">
              Targeted Practice Drills
            </h1>
            <p className="text-xs sm:text-sm text-[#757575] mt-2 leading-relaxed">
              Select any aptitude topic to launch an instant focused practice drill, view previous examination questions, and test your speed before attempting full-length mocks.
            </p>
          </div>

          {/* Subject Pills */}
          <div className="mt-8 flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
            {subjects.map((sub) => {
              const active = selectedSubject === sub.name;
              return (
                <button
                  key={sub.name}
                  onClick={() => setSelectedSubject(sub.name)}
                  className={`px-4 py-2.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 ${
                    active 
                      ? 'bg-black text-white shadow-sm' 
                      : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                  }`}
                >
                  <sub.icon className="w-3.5 h-3.5" />
                  <span>{sub.name}</span>
                </button>
              );
            })}
          </div>

        </div>
      </section>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        
        {/* Practice Mode Banners */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Daily Sprint Banner */}
          <div className="samsung-card p-6 sm:p-8 bg-gradient-to-br from-amber-50 to-orange-50/40 border border-amber-200/60 flex items-center justify-between gap-6">
            <div className="space-y-2">
              <span className="flex items-center gap-1.5 text-xs font-bold text-amber-700 uppercase tracking-wider">
                <Flame className="w-4 h-4 fill-amber-500" />
                <span>Daily Practice Challenge</span>
              </span>
              <h3 className="text-xl font-bold text-amber-950 font-heading">
                15-Question Sprint
              </h3>
              <p className="text-xs text-amber-900 leading-relaxed max-w-sm">
                5 Quant, 5 Reasoning, 5 Verbal questions refreshed daily with a 15-minute timer.
              </p>
              <div className="pt-2">
                <Link to="/daily-challenge" className="btn-samsung !text-xs !py-2.5 !px-5">
                  <span>Start Today's Sprint</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>

          {/* Full Mock Simulator Banner */}
          <div className="samsung-card p-6 sm:p-8 bg-white border border-black/8 flex items-center justify-between gap-6">
            <div className="space-y-2">
              <span className="flex items-center gap-1.5 text-xs font-bold text-[#1428A0] uppercase tracking-wider">
                <Target className="w-4 h-4" />
                <span>Full Examination Simulation</span>
              </span>
              <h3 className="text-xl font-bold text-black font-heading">
                All-India Mock Tests
              </h3>
              <p className="text-xs text-[#757575] leading-relaxed max-w-sm">
                Full-length examinations with negative marking, section navigation, and Recharts analytics.
              </p>
              <div className="pt-2">
                <Link to="/mock-tests" className="btn-samsung-ghost !text-xs !py-2.5 !px-5">
                  <span>Browse Mock Tests</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>

        </div>

        {/* Topic Practice Selector Grid */}
        <div className="samsung-card p-6 sm:p-8 bg-white border border-black/8 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-black/8">
            <div>
              <h3 className="text-base font-bold text-black font-heading">
                Choose a Topic for Focused Practice Drill
              </h3>
              <p className="text-xs text-[#757575] mt-0.5">
                Each drill includes beginner, intermediate, advanced, and previous exam questions.
              </p>
            </div>
            <span className="text-xs font-semibold text-neutral-400">
              {topics.length} Modules in {selectedSubject}
            </span>
          </div>

          {loading ? (
            <div className="py-12 text-center">
              <Loader2 className="w-8 h-8 text-[#1428A0] animate-spin mx-auto mb-2" />
              <p className="text-xs text-neutral-400">Loading topic drills...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {topics.map((t) => (
                <div
                  key={t._id}
                  className="p-5 rounded-2xl bg-[#FAF9F6] border border-black/5 hover:border-[#1428A0]/30 transition-all flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-neutral-200 text-neutral-700 font-semibold">
                        {t.difficulty}
                      </span>
                      <span className="text-[11px] font-mono text-neutral-400">
                        {t.estimatedTime}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-black group-hover:text-[#1428A0] font-heading mt-1">
                      {t.name}
                    </h4>
                    <p className="text-xs text-[#757575] mt-1 line-clamp-2">
                      {t.summary}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-black/5 flex items-center justify-between">
                    <Link
                      to={`/learn/${t.slug}`}
                      className="text-xs font-bold text-black hover:text-[#1428A0] flex items-center gap-1"
                    >
                      <span>Practice Questions</span>
                      <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

    </div>
  );
}

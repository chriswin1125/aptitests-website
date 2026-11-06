import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getTopicsApi, getMockTestsApi, getFormulasApi, getTodayChallengeApi } from '../services/api';
import { 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  TrendingUp, 
  Flame, 
  Copy, 
  Check, 
  Clock, 
  Award, 
  BarChart3, 
  Building2, 
  GraduationCap, 
  Landmark, 
  ChevronRight,
  BookOpen,
  Layers,
  ArrowUpRight
} from 'lucide-react';

export default function HomePage() {
  const { user, openLoginModal } = useAuth();
  const navigate = useNavigate();

  const [popularTopics, setPopularTopics] = useState([]);
  const [recentTests, setRecentTests] = useState([]);
  const [formulaOfTheDay, setFormulaOfTheDay] = useState(null);
  const [copiedFormula, setCopiedFormula] = useState(false);
  const [dailyChallenge, setDailyChallenge] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [topicsRes, testsRes, formulasRes, challengeRes] = await Promise.all([
          getTopicsApi({ category: 'Quantitative Aptitude' }),
          getMockTestsApi(),
          getFormulasApi(),
          getTodayChallengeApi().catch(() => null)
        ]);

        setPopularTopics(topicsRes.data.slice(0, 6));
        setRecentTests(testsRes.data.slice(0, 3));
        if (formulasRes.data.length > 0) {
          setFormulaOfTheDay(formulasRes.data[0]); // e.g. Basic percentage or successive change
        }
        if (challengeRes?.data) {
          setDailyChallenge(challengeRes.data);
        }
      } catch (err) {
        console.error('Error fetching homepage data', err);
      }
    };
    fetchData();
  }, []);

  const handleCopyFormula = (expr) => {
    if (!expr) return;
    navigator.clipboard.writeText(expr);
    setCopiedFormula(true);
    setTimeout(() => setCopiedFormula(false), 2000);
  };

  const companiesList = [
    { name: 'TCS', slug: 'tcs', pkg: '3.6 - 9.0 LPA', desc: 'Cognitive & Advanced NQT', logo: 'TCS' },
    { name: 'Infosys', slug: 'infosys', pkg: '3.6 - 9.5 LPA', desc: 'Mathematical & Logical Puzzles', logo: 'INF' },
    { name: 'Wipro', slug: 'wipro', pkg: '3.5 - 6.5 LPA', desc: 'Elite NTH Speed Rounds', logo: 'WIP' },
    { name: 'Accenture', slug: 'accenture', pkg: '4.5 - 6.5 LPA', desc: 'Cognitive & Pseudocode Test', logo: 'ACN' },
    { name: 'Cognizant', slug: 'cognizant', pkg: '4.0 - 6.75 LPA', desc: 'GenC & Elevate Aptitude', logo: 'CTS' },
    { name: 'Capgemini', slug: 'capgemini', pkg: '4.0 - 7.5 LPA', desc: 'Game-Based & Essay Rounds', logo: 'CAP' },
    { name: 'Zoho', slug: 'zoho', pkg: '6.0 - 12.0 LPA', desc: 'Pure Aptitude & Problem Solving', logo: 'ZOH' },
    { name: 'HCL', slug: 'hcl', pkg: '3.6 - 5.0 LPA', desc: 'First Careers Tech Drive', logo: 'HCL' },
  ];

  return (
    <div className="min-h-screen bg-[#F7F7F7]">

      {/* 1. HERO SECTION (Samsung inspired) */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-32 border-b border-black/5 bg-gradient-to-b from-white to-[#F7F7F7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-left">
              
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/5 border border-black/10 text-xs font-semibold text-black tracking-wide">
                <Sparkles className="w-3.5 h-3.5 text-[#1428A0]" />
                <span>Next-Generation Aptitude Learning Engine</span>
              </div>

              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-black leading-[1.08] font-heading">
                Master Aptitude. <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-black via-[#1428A0] to-neutral-700">
                  Crack Every Opportunity.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-[#757575] max-w-xl leading-relaxed font-normal">
                Your complete destination for aptitude preparation, competitive examinations, banking tests, and campus placement success.
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-4">
                <Link to="/learn" className="btn-samsung">
                  <span>Start Learning</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link to="/mock-tests" className="btn-samsung-ghost">
                  <span>Explore Mock Tests</span>
                </Link>
              </div>

              {/* Trust Metric Badges */}
              <div className="pt-8 border-t border-black/8 grid grid-cols-3 gap-6 max-w-lg">
                <div>
                  <p className="text-2xl sm:text-3xl font-extrabold text-black font-heading">68+</p>
                  <p className="text-xs text-[#757575] font-medium mt-0.5">Syllabus Topics</p>
                </div>
                <div>
                  <p className="text-2xl sm:text-3xl font-extrabold text-black font-heading">200+</p>
                  <p className="text-xs text-[#757575] font-medium mt-0.5">Formulas & Tricks</p>
                </div>
                <div>
                  <p className="text-2xl sm:text-3xl font-extrabold text-black font-heading">100%</p>
                  <p className="text-xs text-[#757575] font-medium mt-0.5">Free Practice</p>
                </div>
              </div>

            </div>

            {/* Right Visual: Samsung-Inspired Device Canvas */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                
                {/* Main Visual Card */}
                <div className="samsung-card p-6 sm:p-8 bg-white border border-black/10 shadow-2xl relative z-10">
                  
                  <div className="flex items-center justify-between pb-4 border-b border-black/5">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-rose-500"></div>
                      <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                      <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                    </div>
                    <span className="text-[11px] font-mono text-neutral-400 font-semibold uppercase">
                      Aptitude Pro v2.6 • Live
                    </span>
                  </div>

                  {/* Mock live practice widget */}
                  <div className="py-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#1428A0] uppercase tracking-wider">
                        Banking Prelims • Quantitative Speed Test
                      </span>
                      <span className="text-xs font-mono font-bold bg-neutral-100 px-2 py-0.5 rounded-full text-black">
                        18:42 Left
                      </span>
                    </div>

                    <div className="p-4 rounded-2xl bg-neutral-50 border border-black/5">
                      <p className="text-xs text-neutral-500 font-semibold mb-1">Question 04 of 35</p>
                      <p className="text-sm font-bold text-black leading-snug">
                        The price of sugar rises by 25%. By what % must a family reduce consumption so expenditure is unchanged?
                      </p>
                    </div>

                    {/* Interactive Answer Mock */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-3 rounded-xl border border-black/5 text-xs text-neutral-600 bg-white">
                        <span>A) 25%</span>
                      </div>
                      <div className="flex items-center justify-between p-3 rounded-xl border-2 border-[#1428A0] bg-[#E8ECF5] text-xs font-bold text-black shadow-sm">
                        <span>B) 20% (Correct - AB Rule)</span>
                        <CheckCircle2 className="w-4 h-4 text-[#1428A0]" />
                      </div>
                      <div className="flex items-center justify-between p-3 rounded-xl border border-black/5 text-xs text-neutral-600 bg-white">
                        <span>C) 16.67%</span>
                      </div>
                    </div>

                  </div>

                  {/* Bottom live stats inside device */}
                  <div className="pt-4 border-t border-black/5 flex items-center justify-between text-xs text-neutral-500">
                    <span className="flex items-center gap-1.5 font-medium text-emerald-600">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                      Real-time Analytics
                    </span>
                    <span className="font-semibold text-black">Mastery: 84%</span>
                  </div>

                </div>

                {/* Floating ambient badge */}
                <div className="hidden sm:flex absolute -bottom-6 -left-6 bg-black text-white p-4 rounded-3xl shadow-xl items-center gap-3 z-20 border border-white/20">
                  <div className="w-10 h-10 rounded-2xl bg-[#1428A0] flex items-center justify-center font-bold text-sm">
                    <Award className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-xs font-bold font-heading">Standardized Benchmarks</p>
                    <p className="text-[11px] text-neutral-400">IBPS • SBI • SSC • TCS • Zoho</p>
                  </div>
                </div>

              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 2. FEATURED CATEGORIES (Three Large Samsung Cards) */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-12">
          <span className="text-xs font-bold tracking-widest text-[#1428A0] uppercase font-mono">
            Structured Pathways
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-black mt-2 font-heading">
            Everything you need to prepare for success.
          </h2>
          <p className="text-sm sm:text-base text-[#757575] mt-2 max-w-2xl">
            Choose your target career path to unlock curated syllabi, sectional mock drills, and company-specific patterns.
          </p>
        </div>

        {/* 3 Large Category Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Card 1: Banking Exams (Dark Samsung Card) */}
          <div className="samsung-card-dark p-8 sm:p-10 flex flex-col justify-between min-h-[460px] relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-blue-600/20 to-transparent rounded-full blur-2xl pointer-events-none"></div>

            <div>
              <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center mb-6">
                <Landmark className="w-6 h-6 text-white" />
              </div>
              <span className="text-[11px] font-mono text-neutral-400 tracking-wider uppercase font-semibold">
                Nationalized & Central Banks
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold text-white mt-1 font-heading">
                Banking Exams
              </h3>
              <p className="text-xs text-neutral-300 mt-2 leading-relaxed">
                Specialized speed drills, complex multi-variable seating puzzles, and high-level Data Interpretation.
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mt-6">
                {['IBPS PO', 'IBPS Clerk', 'SBI PO', 'SBI Clerk', 'RBI Assistant', 'RBI Grade B'].map((tag) => (
                  <span key={tag} className="text-xs px-3 py-1 rounded-full bg-white/10 text-white font-medium hover:bg-white/20 transition-colors">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-8 mt-auto">
              <Link 
                to="/exams?category=Banking+Exams" 
                className="inline-flex items-center justify-between w-full p-4 rounded-2xl bg-white text-black font-bold text-xs hover:bg-neutral-100 transition-all"
              >
                <span>Explore Banking Curriculum</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Card 2: Competitive Exams */}
          <div className="samsung-card p-8 sm:p-10 flex flex-col justify-between min-h-[460px] bg-white group">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#E8ECF5] flex items-center justify-center mb-6">
                <GraduationCap className="w-6 h-6 text-[#1428A0]" />
              </div>
              <span className="text-[11px] font-mono text-neutral-400 tracking-wider uppercase font-semibold">
                Central & State Governance
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold text-black mt-1 font-heading">
                Competitive Exams
              </h3>
              <p className="text-xs text-[#757575] mt-2 leading-relaxed">
                Covers Advance Mathematics (Geometry, Trigonometry, Algebra) and high-order CSAT reading comprehension.
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mt-6">
                {['SSC CGL', 'SSC CHSL', 'RRB NTPC', 'RRB Group D', 'UPSC CSAT', 'State Exams'].map((tag) => (
                  <span key={tag} className="text-xs px-3 py-1 rounded-full bg-neutral-100 text-neutral-700 font-medium hover:bg-neutral-200 transition-colors">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-8 mt-auto">
              <Link 
                to="/exams?category=Competitive+Exams" 
                className="inline-flex items-center justify-between w-full p-4 rounded-2xl bg-black text-white font-bold text-xs hover:bg-neutral-800 transition-all"
              >
                <span>Practice Competitive Exams</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Card 3: Campus Placement */}
          <div className="samsung-card p-8 sm:p-10 flex flex-col justify-between min-h-[460px] bg-white group">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-neutral-100 flex items-center justify-center mb-6">
                <Building2 className="w-6 h-6 text-black" />
              </div>
              <span className="text-[11px] font-mono text-neutral-400 tracking-wider uppercase font-semibold">
                Tier 1 IT & Product Companies
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold text-black mt-1 font-heading">
                Campus Placement
              </h3>
              <p className="text-xs text-[#757575] mt-2 leading-relaxed">
                Authentic question styles, test patterns, cognitive rounds, pseudocode assessments, and interview tips.
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mt-6">
                {['TCS', 'Infosys', 'Wipro', 'Accenture', 'Cognizant', 'Capgemini', 'Zoho', 'HCL'].map((tag) => (
                  <span key={tag} className="text-xs px-3 py-1 rounded-full bg-neutral-100 text-neutral-700 font-medium hover:bg-neutral-200 transition-colors">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-8 mt-auto">
              <Link 
                to="/exams?category=Campus+Placement" 
                className="inline-flex items-center justify-between w-full p-4 rounded-2xl bg-black text-white font-bold text-xs hover:bg-neutral-800 transition-all"
              >
                <span>Crack Placement Drives</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

        </div>

      </section>

      {/* 3. DAILY PRACTICE CHALLENGE SPOTLIGHT & FORMULA OF THE DAY */}
      <section className="py-16 bg-white border-y border-black/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            
            {/* Daily Challenge Card (7 cols) */}
            <div className="lg:col-span-7 samsung-card p-6 sm:p-8 bg-[#FAF9F6] border border-black/10 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-amber-500 text-white">
                      <Flame className="w-5 h-5 fill-white" />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-600">
                        Today’s Active Sprint
                      </span>
                      <h3 className="text-xl font-bold text-black font-heading">Daily Practice Challenge</h3>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-black text-white text-xs font-semibold">
                    15 Questions
                  </span>
                </div>

                <p className="text-xs text-[#757575] leading-relaxed">
                  Sharpen your agility daily with 5 Quantitative, 5 Logical Reasoning, and 5 Verbal Ability questions under an automatic 15-minute timer.
                </p>

                {/* 3 Category distribution pills */}
                <div className="grid grid-cols-3 gap-3 my-6">
                  <div className="p-3 rounded-2xl bg-white border border-black/5 text-center">
                    <p className="text-xs font-bold text-black">5 Questions</p>
                    <p className="text-[10px] text-neutral-400 mt-0.5">Quantitative</p>
                  </div>
                  <div className="p-3 rounded-2xl bg-white border border-black/5 text-center">
                    <p className="text-xs font-bold text-black">5 Questions</p>
                    <p className="text-[10px] text-neutral-400 mt-0.5">Logical</p>
                  </div>
                  <div className="p-3 rounded-2xl bg-white border border-black/5 text-center">
                    <p className="text-xs font-bold text-black">5 Questions</p>
                    <p className="text-[10px] text-neutral-400 mt-0.5">Verbal</p>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between gap-4">
                <div className="text-xs text-neutral-500">
                  <span className="font-bold text-black">{user?.streak || 1} Day Streak</span> active
                </div>
                <Link to="/daily-challenge" className="btn-samsung !text-xs !py-2.5">
                  <span>Start Today’s Challenge</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Formula of the Day Card (5 cols) */}
            <div className="lg:col-span-5 samsung-card p-6 sm:p-8 bg-white border border-black/10 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-[#1428A0] text-white">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#1428A0]">
                        Daily Memory Card
                      </span>
                      <h3 className="text-lg font-bold text-black font-heading">Formula of the Day</h3>
                    </div>
                  </div>
                  <Link to="/formulas" className="text-xs text-[#1428A0] hover:underline font-semibold flex items-center gap-1">
                    <span>Library</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                {formulaOfTheDay ? (
                  <div>
                    <h4 className="text-sm font-bold text-black">{formulaOfTheDay.name}</h4>
                    <p className="text-[11px] text-[#757575] mt-0.5">{formulaOfTheDay.topicName} • {formulaOfTheDay.category}</p>

                    {/* Formula mathematical block */}
                    <div className="my-4 p-4 rounded-2xl bg-neutral-900 text-white flex items-center justify-between relative group">
                      <code className="text-xs sm:text-sm font-mono text-emerald-400 font-semibold break-all">
                        {formulaOfTheDay.expression}
                      </code>
                      <button
                        onClick={() => handleCopyFormula(formulaOfTheDay.expression)}
                        className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors shrink-0 ml-2"
                        title="Copy formula"
                      >
                        {copiedFormula ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>

                    <div className="text-xs text-neutral-600 bg-neutral-50 p-3 rounded-xl border border-black/5">
                      <span className="font-bold text-black">When to use: </span>
                      {formulaOfTheDay.whenToUse}
                    </div>
                  </div>
                ) : (
                  <div className="py-6 text-center text-xs text-neutral-400">Loading daily formula...</div>
                )}
              </div>

              <div className="pt-4 border-t border-black/5 flex items-center justify-between">
                <span className="text-[11px] text-neutral-400">Click copy or explore examples</span>
                <Link to={`/learn/${formulaOfTheDay?.topicSlug || 'percentage'}`} className="text-xs font-bold text-black hover:text-[#1428A0]">
                  View Topic Lesson →
                </Link>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 4. POPULAR APTITUDE TOPICS (Direct Topic Learning Portal) */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <span className="text-xs font-bold tracking-widest text-[#1428A0] uppercase font-mono">
              Core Aptitude Modules
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-black mt-2 font-heading">
              Popular Aptitude Topics
            </h2>
            <p className="text-sm text-[#757575] mt-1">
              Every topic features in-depth concept lessons, formula cards, 5+ solved examples, and a live topic test.
            </p>
          </div>
          <Link to="/learn" className="mt-4 md:mt-0 text-xs font-bold text-black hover:text-[#1428A0] flex items-center gap-1.5 group">
            <span>Browse All 68 Topics</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Topic Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {popularTopics.map((topic) => (
            <div 
              key={topic._id}
              onClick={() => navigate(`/learn/${topic.slug}`)}
              className="samsung-card p-6 bg-white border border-black/8 hover:border-[#1428A0]/30 cursor-pointer flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] px-2.5 py-1 rounded-full bg-[#E8ECF5] text-[#1428A0] font-semibold">
                    {topic.category.split(' ')[0]}
                  </span>
                  <span className="text-[11px] font-mono text-[#757575] flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {topic.estimatedTime}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-black group-hover:text-[#1428A0] transition-colors font-heading">
                  {topic.name}
                </h3>
                <p className="text-xs text-[#757575] mt-2 line-clamp-2 leading-relaxed">
                  {topic.summary}
                </p>

                <div className="mt-4 pt-3 border-t border-black/5 flex items-center justify-between text-[11px] text-neutral-500">
                  <span>Difficulty: <strong className="text-black">{topic.difficulty}</strong></span>
                  <span>Usage: <strong className="text-black">{topic.importance.split(' ')[0]}</strong></span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-black/5 flex items-center justify-between text-xs font-semibold text-black group-hover:text-[#1428A0]">
                <span>Open Learning Page</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>

      </section>

      {/* 5. TOP COMPANY PREPARATION CARDS */}
      <section className="py-20 bg-white border-t border-black/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold tracking-widest text-[#1428A0] uppercase font-mono">
              Recruitment Assessment Guides
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-black mt-2 font-heading">
              Target Top IT & Campus Recruiters
            </h2>
            <p className="text-xs sm:text-sm text-[#757575] mt-2">
              Detailed assessment patterns, question difficulty distributions, round descriptions, and company mocks.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {companiesList.map((company) => (
              <Link
                key={company.slug}
                to={`/companies/${company.slug}`}
                className="samsung-card p-6 bg-[#FAF9F6] border border-black/8 hover:border-black/20 hover:bg-white transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-black text-white font-bold text-base flex items-center justify-center font-heading group-hover:bg-[#1428A0] transition-colors">
                    {company.logo}
                  </div>
                  <h3 className="text-lg font-bold text-black mt-4 font-heading">{company.name}</h3>
                  <p className="text-[11px] text-[#1428A0] font-semibold mt-0.5">{company.pkg}</p>
                  <p className="text-xs text-[#757575] mt-2 line-clamp-2 leading-relaxed">
                    {company.desc}
                  </p>
                </div>

                <div className="mt-6 pt-3 border-t border-black/5 flex items-center justify-between text-xs font-bold text-black">
                  <span>View Prep Dossier</span>
                  <ArrowRight className="w-3.5 h-3.5 text-neutral-400 group-hover:text-black group-hover:translate-x-1 transition-all" />
                </div>
              </Link>
            ))}
          </div>

        </div>
      </section>

      {/* 6. RECENTLY ADDED MOCK TESTS */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <span className="text-xs font-bold tracking-widest text-[#1428A0] uppercase font-mono">
              Live Mock Test Engine
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-black mt-2 font-heading">
              Recently Added Mock Tests
            </h2>
            <p className="text-sm text-[#757575] mt-1">
              Full examination simulations featuring navigation palettes, timers, and instant performance breakdown.
            </p>
          </div>
          <Link to="/mock-tests" className="mt-4 md:mt-0 text-xs font-bold text-black hover:text-[#1428A0] flex items-center gap-1 group">
            <span>Explore All Tests</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {recentTests.map((test) => (
            <div 
              key={test._id} 
              className="samsung-card p-6 bg-white border border-black/8 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] px-2.5 py-1 rounded-full bg-black text-white font-semibold">
                    {test.type}
                  </span>
                  <span className="text-xs font-semibold text-neutral-500">
                    {test.difficulty}
                  </span>
                </div>

                <h3 className="text-base font-bold text-black font-heading leading-snug">
                  {test.title}
                </h3>
                <p className="text-xs text-[#757575] mt-2">
                  Category: <span className="font-semibold text-black">{test.category}</span>
                </p>

                <div className="my-5 p-3 rounded-2xl bg-neutral-50 grid grid-cols-3 gap-2 text-center text-xs">
                  <div>
                    <p className="font-bold text-black">{test.totalQuestions}</p>
                    <p className="text-[10px] text-neutral-400">Questions</p>
                  </div>
                  <div>
                    <p className="font-bold text-black">{test.durationMinutes}m</p>
                    <p className="text-[10px] text-neutral-400">Duration</p>
                  </div>
                  <div>
                    <p className="font-bold text-black">{test.totalMarks}</p>
                    <p className="text-[10px] text-neutral-400">Marks</p>
                  </div>
                </div>
              </div>

              <Link 
                to={`/test/${test.slug}`}
                className="btn-samsung !text-xs !w-full justify-center !py-2.5"
              >
                <span>Take Mock Test</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ))}
        </div>

      </section>

      {/* 7. WHY CHOOSE APTITUDE PRO (Samsung Clean Architecture Showcase) */}
      <section className="py-20 bg-white border-t border-black/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold tracking-widest text-[#1428A0] uppercase font-mono">
              Engineered For Results
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-black mt-2 font-heading">
              Why Choose Aptitude Pro?
            </h2>
            <p className="text-sm text-[#757575] mt-2">
              Unlike generic static platforms, Aptitude Pro pairs commercial design standards with real examination analytics.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-[#FAF9F6] border border-black/5">
              <div className="w-12 h-12 rounded-2xl bg-black text-white flex items-center justify-center font-bold text-xl mb-6">
                1
              </div>
              <h4 className="text-lg font-bold text-black font-heading">Complete 7-Section Topic Depth</h4>
              <p className="text-xs text-[#757575] mt-2 leading-relaxed">
                Every topic contains Introduction, Concepts from basic to advanced, Formula Book, at least 5 Solved Examples with shortcuts, Practice Questions, and a Live Topic Test.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-[#FAF9F6] border border-black/5">
              <div className="w-12 h-12 rounded-2xl bg-[#1428A0] text-white flex items-center justify-center font-bold text-xl mb-6">
                2
              </div>
              <h4 className="text-lg font-bold text-black font-heading">Dynamic Exam-Engine Simulation</h4>
              <p className="text-xs text-[#757575] mt-2 leading-relaxed">
                Realistic exam interfaces featuring Mark for Review, Clear Response, Save and Next, countdown timers, negative marking, and detailed Recharts visual breakdown.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-[#FAF9F6] border border-black/5">
              <div className="w-12 h-12 rounded-2xl bg-neutral-900 text-white flex items-center justify-center font-bold text-xl mb-6">
                3
              </div>
              <h4 className="text-lg font-bold text-black font-heading">Persistent Learning Streaks</h4>
              <p className="text-xs text-[#757575] mt-2 leading-relaxed">
                Full MongoDB synchronization for test history, topic completions, streak counters, and bookmarked formula sheets across all devices.
              </p>
            </div>
          </div>

          {/* Bottom CTA Banner */}
          <div className="mt-16 p-8 sm:p-12 rounded-3xl bg-black text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
            <div>
              <h3 className="text-2xl sm:text-3xl font-bold font-heading">
                Ready to crack your upcoming aptitude exam?
              </h3>
              <p className="text-xs sm:text-sm text-neutral-400 mt-1">
                Begin with fundamental Quantitative Aptitude or test your skills on today's sprint.
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <Link to="/learn" className="px-6 py-3 rounded-full bg-white text-black font-bold text-xs hover:bg-neutral-100 transition-all">
                Start Learning Now
              </Link>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
}

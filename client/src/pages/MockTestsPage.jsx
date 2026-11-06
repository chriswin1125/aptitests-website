import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { getMockTestsApi } from '../services/api';
import { 
  FileText, 
  Clock, 
  Award, 
  ArrowRight, 
  Filter, 
  Sparkles, 
  Layers, 
  Search,
  CheckCircle2,
  Loader2
} from 'lucide-react';

export default function MockTestsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialType = searchParams.get('type') || 'All';
  const targetExamParam = searchParams.get('exam') || '';

  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState(initialType);
  const [searchQuery, setSearchQuery] = useState('');

  const testTypes = ['All', 'Full Mock', 'Sectional Test', 'Topic Mastery', 'Company Specific'];

  useEffect(() => {
    const fetchTests = async () => {
      setLoading(true);
      try {
        const params = {};
        if (selectedType !== 'All') params.type = selectedType;
        if (targetExamParam) params.search = targetExamParam;
        if (searchQuery.trim()) params.search = searchQuery.trim();

        const res = await getMockTestsApi(params);
        setTests(res.data);
      } catch (err) {
        console.error('Error fetching mock tests', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTests();
  }, [selectedType, targetExamParam, searchQuery]);

  return (
    <div className="min-h-screen bg-[#F7F7F7] pb-24">
      
      {/* Header Banner */}
      <section className="bg-white border-b border-black/5 pt-12 pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="max-w-2xl">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#1428A0]">
              Examination Engine
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-black tracking-tight mt-2 font-heading">
              All-India Mock Test Series
            </h1>
            <p className="text-xs sm:text-sm text-[#757575] mt-2 leading-relaxed">
              Experience the actual examination pressure with strict section timers, negative marking penalties, question palettes, and comprehensive Recharts performance analytics.
            </p>
          </div>

          {/* Test Type Filter Pills */}
          <div className="mt-8 flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
            {testTypes.map((type) => {
              const active = selectedType === type;
              return (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`px-4 py-2.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                    active 
                      ? 'bg-black text-white shadow-sm' 
                      : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                  }`}
                >
                  {type === 'All' ? 'All Test Formats' : type}
                </button>
              );
            })}
          </div>

        </div>
      </section>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        
        {/* Search Toolbar */}
        <div className="bg-white p-4 rounded-3xl border border-black/5 shadow-sm flex items-center justify-between gap-4">
          <div className="relative w-full max-w-md">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search tests by title, exam, or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-2xl bg-neutral-50 border border-black/8 text-xs font-medium outline-none focus:border-black transition-colors"
            />
          </div>

          <div className="text-xs text-neutral-500 font-medium">
            Showing <strong className="text-black">{tests.length}</strong> available simulations
          </div>
        </div>

        {/* Tests List */}
        {loading ? (
          <div className="py-20 text-center">
            <Loader2 className="w-8 h-8 text-[#1428A0] animate-spin mx-auto mb-3" />
            <p className="text-xs text-neutral-500">Loading mock test registry...</p>
          </div>
        ) : tests.length === 0 ? (
          <div className="py-20 text-center bg-white rounded-3xl border border-black/5 p-8">
            <FileText className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-black font-heading">No mock tests match this filter</h3>
            <p className="text-xs text-[#757575] mt-1">Try resetting search criteria or select All Test Formats.</p>
            <button
              onClick={() => { setSelectedType('All'); setSearchQuery(''); }}
              className="mt-4 btn-samsung !text-xs !py-2"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tests.map((test) => (
              <div
                key={test._id}
                className="samsung-card p-6 bg-white border border-black/8 hover:border-[#1428A0]/30 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-black text-white font-semibold">
                      {test.type}
                    </span>
                    <span className="text-xs font-semibold text-neutral-500">
                      {test.difficulty}
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-black group-hover:text-[#1428A0] transition-colors font-heading leading-snug">
                    {test.title}
                  </h3>

                  <p className="text-xs text-[#757575] mt-1.5 font-medium">
                    Category: <strong className="text-black">{test.category}</strong> {test.examName && `• ${test.examName}`}
                  </p>

                  <div className="my-5 p-3.5 rounded-2xl bg-neutral-50 grid grid-cols-3 gap-2 text-center text-xs">
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
                      <p className="text-[10px] text-neutral-400">Max Marks</p>
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <Link
                    to={`/test/${test.slug}`}
                    className="btn-samsung !text-xs !w-full justify-center !py-2.5"
                  >
                    <span>Launch Live Examination</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

    </div>
  );
}

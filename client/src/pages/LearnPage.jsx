import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { getTopicsApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { 
  Search, 
  Clock, 
  CheckCircle, 
  ChevronRight, 
  Filter, 
  BookOpen, 
  Sparkles, 
  Calculator, 
  Cpu, 
  PenTool, 
  BarChart, 
  Server,
  Loader2
} from 'lucide-react';

export default function LearnPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'All';
  
  const { user } = useAuth();
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { name: 'All', label: 'All Subjects', count: 68 },
    { name: 'Quantitative Aptitude', label: 'Quantitative (25)', icon: Calculator },
    { name: 'Logical Reasoning', label: 'Logical (22)', icon: Cpu },
    { name: 'Verbal Ability', label: 'Verbal (15)', icon: PenTool },
    { name: 'Data Interpretation', label: 'Data Interpretation (8)', icon: BarChart },
    { name: 'Computer Aptitude', label: 'Computer Aptitude (9)', icon: Server },
  ];

  const difficulties = ['All', 'Beginner', 'Intermediate', 'Advanced'];

  useEffect(() => {
    const fetchTopics = async () => {
      setLoading(true);
      try {
        const params = {};
        if (selectedCategory !== 'All') params.category = selectedCategory;
        if (selectedDifficulty !== 'All') params.difficulty = selectedDifficulty;
        if (searchQuery.trim()) params.search = searchQuery.trim();

        const res = await getTopicsApi(params);
        setTopics(res.data);
      } catch (err) {
        console.error('Error fetching topics', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTopics();
  }, [selectedCategory, selectedDifficulty, searchQuery]);

  const handleCategoryChange = (catName) => {
    setSelectedCategory(catName);
    if (catName === 'All') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', catName);
    }
    setSearchParams(searchParams);
  };

  return (
    <div className="min-h-screen bg-[#F7F7F7] pb-24">
      
      {/* Page Header */}
      <section className="bg-white border-b border-black/5 pt-12 pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="max-w-3xl">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#1428A0]">
              Curriculum Directory
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-black tracking-tight mt-2 font-heading">
              Aptitude Learning Tracks
            </h1>
            <p className="text-xs sm:text-sm text-[#757575] mt-2 leading-relaxed">
              Explore 68 structured topics across Quantitative Aptitude, Logical Reasoning, Verbal Ability, Data Interpretation, and Computer Aptitude. Each topic includes full conceptual theory, verified shortcuts, solved examples, and interactive topic tests.
            </p>
          </div>

          {/* Subject Category Filter Tabs */}
          <div className="mt-8 flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
            {categories.map((cat) => {
              const active = selectedCategory === cat.name;
              return (
                <button
                  key={cat.name}
                  onClick={() => handleCategoryChange(cat.name)}
                  className={`px-4 py-2.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 ${
                    active 
                      ? 'bg-black text-white shadow-sm' 
                      : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                  }`}
                >
                  {cat.icon && <cat.icon className="w-3.5 h-3.5" />}
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* Search and Difficulty Filter Bar */}
        <div className="bg-white p-4 rounded-3xl border border-black/5 shadow-sm mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Search Input */}
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search topics by name, concept or exam..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-2xl bg-neutral-50 border border-black/8 text-xs font-medium outline-none focus:border-black transition-colors"
            />
          </div>

          {/* Difficulty Chips */}
          <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto">
            <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider shrink-0 mr-1 flex items-center gap-1">
              <Filter className="w-3 h-3" /> Level:
            </span>
            {difficulties.map((diff) => (
              <button
                key={diff}
                onClick={() => setSelectedDifficulty(diff)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  selectedDifficulty === diff 
                    ? 'bg-[#1428A0] text-white font-semibold' 
                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                }`}
              >
                {diff}
              </button>
            ))}
          </div>

        </div>

        {/* Topics Count info */}
        <div className="flex items-center justify-between mb-6 px-1">
          <p className="text-xs text-neutral-500 font-medium">
            Showing <strong className="text-black">{topics.length}</strong> topics in {selectedCategory === 'All' ? 'All Subjects' : selectedCategory}
          </p>
          {user?.completedTopics?.length > 0 && (
            <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
              <CheckCircle className="w-3.5 h-3.5" />
              {user.completedTopics.length} completed
            </span>
          )}
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="py-20 text-center">
            <Loader2 className="w-8 h-8 text-[#1428A0] animate-spin mx-auto mb-3" />
            <p className="text-xs text-neutral-500">Loading topic syllabus...</p>
          </div>
        ) : topics.length === 0 ? (
          <div className="py-20 text-center bg-white rounded-3xl border border-black/5 p-8">
            <BookOpen className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-black font-heading">No topics found</h3>
            <p className="text-xs text-[#757575] mt-1">Try adjusting your search query or difficulty filter.</p>
            <button
              onClick={() => { setSelectedCategory('All'); setSelectedDifficulty('All'); setSearchQuery(''); }}
              className="mt-4 btn-samsung !text-xs !py-2"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          /* Topic Cards Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {topics.map((topic) => {
              const isCompleted = user?.completedTopics?.includes(topic.slug);
              return (
                <Link
                  key={topic._id}
                  to={`/learn/${topic.slug}`}
                  className="samsung-card p-6 bg-white border border-black/8 hover:border-[#1428A0]/30 transition-all flex flex-col justify-between group"
                >
                  <div>
                    {/* Header Row */}
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-[#E8ECF5] text-[#1428A0] font-semibold">
                        {topic.category.split(' ')[0]}
                      </span>
                      <div className="flex items-center gap-1.5">
                        {isCompleted && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" /> Done
                          </span>
                        )}
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-600 font-medium">
                          {topic.difficulty}
                        </span>
                      </div>
                    </div>

                    <h3 className="text-base sm:text-lg font-bold text-black group-hover:text-[#1428A0] transition-colors font-heading">
                      {topic.name}
                    </h3>
                    
                    <p className="text-xs text-[#757575] mt-2 line-clamp-2 leading-relaxed">
                      {topic.summary}
                    </p>

                    <div className="mt-4 pt-3 border-t border-black/5 flex items-center justify-between text-[11px] text-neutral-400">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {topic.estimatedTime}
                      </span>
                      <span>Importance: <strong className="text-black">{topic.importance.split(' ')[0]}</strong></span>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-black/5 flex items-center justify-between text-xs font-bold text-black group-hover:text-[#1428A0]">
                    <span>Start Master Lesson</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              );
            })}
          </div>
        )}

      </div>

    </div>
  );
}

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { searchGlobalApi } from '../services/api';
import { 
  Search, 
  X, 
  BookOpen, 
  Binary, 
  Building2, 
  GraduationCap, 
  FileText, 
  ArrowRight,
  Sparkles,
  Loader2
} from 'lucide-react';

export default function GlobalSearchModal({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  const categories = ['All', 'Quantitative Aptitude', 'Logical Reasoning', 'Verbal Ability', 'Data Interpretation', 'Computer Aptitude'];

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!query.trim()) {
      setResults(null);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await searchGlobalApi(query, categoryFilter);
        setResults(res.data.results);
      } catch (err) {
        console.error('Search error', err);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query, categoryFilter]);

  if (!isOpen) return null;

  const handleSelect = (url) => {
    navigate(url);
    onClose();
  };

  const hasAnyResults = results && (
    results.topics?.length > 0 ||
    results.formulas?.length > 0 ||
    results.exams?.length > 0 ||
    results.companies?.length > 0 ||
    results.tests?.length > 0
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      
      <div 
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-black/10 overflow-hidden flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Search Input Bar */}
        <div className="p-4 sm:p-5 border-b border-black/8 flex items-center gap-3 bg-white">
          <Search className="w-5 h-5 text-black shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search topics, formulas, exams, companies, tests..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full text-base sm:text-lg font-medium text-black bg-transparent outline-none placeholder:text-neutral-400"
          />
          {loading && <Loader2 className="w-5 h-5 text-[#1428A0] animate-spin shrink-0" />}
          {query && (
            <button 
              onClick={() => setQuery('')}
              className="p-1 hover:bg-neutral-100 rounded-full text-neutral-400 hover:text-black"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="text-xs font-semibold px-2.5 py-1 rounded-full bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
          >
            ESC
          </button>
        </div>

        {/* Category Filter Pills */}
        <div className="px-4 py-2.5 bg-neutral-50/60 border-b border-black/5 flex items-center gap-2 overflow-x-auto no-scrollbar">
          <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider shrink-0 mr-1">
            Filter:
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                categoryFilter === cat 
                  ? 'bg-black text-white' 
                  : 'bg-white text-neutral-600 border border-black/8 hover:border-black/20'
              }`}
            >
              {cat === 'All' ? 'All Subjects' : cat.split(' ')[0]}
            </button>
          ))}
        </div>

        {/* Results Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          
          {!query.trim() && (
            <div className="py-12 text-center">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-neutral-100 flex items-center justify-center text-neutral-400 mb-3">
                <Sparkles className="w-6 h-6 text-[#1428A0]" />
              </div>
              <h4 className="text-sm font-bold text-black font-heading">Explore Aptitude Pro</h4>
              <p className="text-xs text-[#757575] mt-1 max-w-sm mx-auto">
                Type keywords like "Percentage", "Time and Work", "TCS", "SBI PO", or "Profit %" to instantly inspect lessons and formulas.
              </p>
              
              <div className="flex flex-wrap justify-center gap-2 mt-5">
                {['Percentage', 'Profit and Loss', 'Time and Work', 'TCS NQT', 'Syllogism', 'IBPS PO'].map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => setQuery(suggestion)}
                    className="text-xs px-3 py-1.5 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-medium"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}

          {query.trim() && !loading && !hasAnyResults && (
            <div className="py-12 text-center text-[#757575] text-sm">
              No direct matches found for "<span className="text-black font-semibold">{query}</span>". Try another keyword or check category filters.
            </div>
          )}

          {/* Topics Results */}
          {results?.topics?.length > 0 && (
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2.5">
                <BookOpen className="w-3.5 h-3.5 text-[#1428A0]" />
                <span>Aptitude Topics ({results.topics.length})</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {results.topics.map((t) => (
                  <button
                    key={t._id}
                    onClick={() => handleSelect(`/learn/${t.slug}`)}
                    className="flex items-start justify-between p-3 rounded-2xl border border-black/6 bg-white hover:bg-neutral-50 hover:border-black/20 text-left transition-all group"
                  >
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-black group-hover:text-[#1428A0] transition-colors">
                          {t.name}
                        </span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-neutral-100 text-neutral-600 font-medium">
                          {t.difficulty}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#757575] line-clamp-1 mt-0.5">{t.summary}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-neutral-400 group-hover:text-black group-hover:translate-x-0.5 transition-all shrink-0 mt-1" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Formulas Results */}
          {results?.formulas?.length > 0 && (
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2.5">
                <Binary className="w-3.5 h-3.5 text-[#1428A0]" />
                <span>Formulas ({results.formulas.length})</span>
              </div>
              <div className="space-y-2">
                {results.formulas.map((f) => (
                  <button
                    key={f._id}
                    onClick={() => handleSelect(`/formulas?search=${encodeURIComponent(f.name)}`)}
                    className="w-full flex items-center justify-between p-3 rounded-2xl border border-black/6 bg-white hover:bg-neutral-50 hover:border-black/20 text-left transition-all group"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-black">{f.name}</span>
                        <span className="text-[10px] text-neutral-400">({f.topicName})</span>
                      </div>
                      <code className="text-[11px] font-mono text-[#1428A0] font-semibold mt-0.5 block">
                        {f.expression}
                      </code>
                    </div>
                    <span className="text-xs text-neutral-400 group-hover:text-black font-semibold shrink-0">
                      View
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Exams Results */}
          {results?.exams?.length > 0 && (
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2.5">
                <GraduationCap className="w-3.5 h-3.5 text-[#1428A0]" />
                <span>Target Exams ({results.exams.length})</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {results.exams.map((e) => (
                  <button
                    key={e._id}
                    onClick={() => handleSelect(`/exams/${e.slug}`)}
                    className="p-3 rounded-2xl border border-black/6 bg-white hover:bg-neutral-50 hover:border-black/20 text-left transition-all"
                  >
                    <p className="text-xs font-bold text-black">{e.name}</p>
                    <p className="text-[11px] text-[#757575] line-clamp-1 mt-0.5">{e.tagline || e.category}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Companies Results */}
          {results?.companies?.length > 0 && (
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2.5">
                <Building2 className="w-3.5 h-3.5 text-[#1428A0]" />
                <span>Companies ({results.companies.length})</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {results.companies.map((c) => (
                  <button
                    key={c._id}
                    onClick={() => handleSelect(`/companies/${c.slug}`)}
                    className="p-3 rounded-2xl border border-black/6 bg-white hover:bg-neutral-50 hover:border-black/20 text-left transition-all"
                  >
                    <p className="text-xs font-bold text-black">{c.name}</p>
                    <p className="text-[11px] text-[#757575] mt-0.5">Package: {c.ctcRange}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Tests Results */}
          {results?.tests?.length > 0 && (
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2.5">
                <FileText className="w-3.5 h-3.5 text-[#1428A0]" />
                <span>Mock Tests ({results.tests.length})</span>
              </div>
              <div className="space-y-2">
                {results.tests.map((test) => (
                  <button
                    key={test._id}
                    onClick={() => handleSelect(`/test/${test.slug}`)}
                    className="w-full flex items-center justify-between p-3 rounded-2xl border border-black/6 bg-white hover:bg-neutral-50 text-left transition-all"
                  >
                    <div>
                      <p className="text-xs font-bold text-black">{test.title}</p>
                      <p className="text-[11px] text-[#757575] mt-0.5">{test.category} • {test.totalQuestions} Questions • {test.durationMinutes} mins</p>
                    </div>
                    <span className="btn-samsung !text-[11px] !py-1.5 !px-3 shrink-0">
                      Take Test
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}

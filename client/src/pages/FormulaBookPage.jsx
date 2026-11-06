import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { getFormulasApi, getFormulaTopicsApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { 
  Search, 
  Copy, 
  Check, 
  Bookmark, 
  Filter, 
  Download, 
  Printer, 
  Sparkles, 
  BookOpen, 
  HelpCircle, 
  X,
  ChevronDown,
  Loader2,
  FileSpreadsheet
} from 'lucide-react';

export default function FormulaBookPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialSearch = searchParams.get('search') || '';
  const filterSaved = searchParams.get('filter') === 'saved';

  const { user, toggleBookmarkFormula } = useAuth();
  
  const [formulas, setFormulas] = useState([]);
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedTopic, setSelectedTopic] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [copiedId, setCopiedId] = useState(null);
  const [expandedExampleId, setExpandedExampleId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [fRes, tRes] = await Promise.all([
          getFormulasApi(),
          getFormulaTopicsApi()
        ]);
        setFormulas(fRes.data);
        setTopics(tRes.data);
      } catch (err) {
        console.error('Error fetching formulas', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleCopy = (formula) => {
    navigator.clipboard.writeText(`${formula.name}: ${formula.expression}`);
    setCopiedId(formula._id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  // Filter formulas
  const filteredFormulas = formulas.filter(f => {
    if (filterSaved && !user?.savedFormulas?.includes(f._id)) return false;
    if (selectedTopic !== 'All' && f.topicSlug !== selectedTopic) return false;
    if (selectedCategory !== 'All' && f.category !== selectedCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = f.name.toLowerCase().includes(q);
      const matchExpr = f.expression.toLowerCase().includes(q);
      const matchTopic = f.topicName.toLowerCase().includes(q);
      const matchUse = f.whenToUse?.toLowerCase().includes(q);
      return matchName || matchExpr || matchTopic || matchUse;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-[#F7F7F7] pb-24 print:bg-white print:p-0">
      
      {/* Header Banner */}
      <section className="bg-white border-b border-black/5 pt-12 pb-10 print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="max-w-2xl">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#1428A0]">
                Quantitative Aptitude Library
              </span>
              <h1 className="text-3xl sm:text-5xl font-extrabold text-black tracking-tight mt-2 font-heading">
                Formula Book
              </h1>
              <p className="text-xs sm:text-sm text-[#757575] mt-2 leading-relaxed">
                The comprehensive mathematical reference handbook. Search, bookmark, copy, and download authentic formulas with variable meanings and solved examples.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <button
                onClick={handlePrint}
                className="btn-samsung-ghost !text-xs !py-2.5 !px-4 flex items-center gap-2"
              >
                <Printer className="w-4 h-4" />
                <span>Print / Save PDF</span>
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* Search & Filter Toolbar */}
        <div className="bg-white p-4 rounded-3xl border border-black/5 shadow-sm mb-8 space-y-4 print:hidden">
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            
            {/* Search Input */}
            <div className="relative w-full md:w-96">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Search formulas by name, equation or topic..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-2xl bg-neutral-50 border border-black/8 text-xs font-medium outline-none focus:border-black transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-2.5 text-neutral-400 hover:text-black"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Topic Filter Dropdown */}
            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="relative w-full md:w-64">
                <select
                  value={selectedTopic}
                  onChange={(e) => setSelectedTopic(e.target.value)}
                  className="w-full py-2 px-4 rounded-2xl bg-neutral-50 border border-black/8 text-xs font-semibold text-black outline-none focus:border-black appearance-none cursor-pointer"
                >
                  <option value="All">All Topics ({formulas.length})</option>
                  {topics.map(t => (
                    <option key={t.slug} value={t.slug}>{t.name} ({t.count})</option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-neutral-400 absolute right-3 top-2.5 pointer-events-none" />
              </div>

              {/* Saved filter pill */}
              <Link
                to={filterSaved ? '/formulas' : '/formulas?filter=saved'}
                className={`px-4 py-2 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  filterSaved 
                    ? 'bg-[#1428A0] text-white shadow-xs' 
                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                }`}
              >
                <Bookmark className="w-3.5 h-3.5" />
                <span>Bookmarked</span>
              </Link>
            </div>

          </div>

        </div>

        {/* Total info */}
        <div className="flex items-center justify-between mb-6 px-1 print:hidden">
          <p className="text-xs text-neutral-500 font-medium">
            Showing <strong className="text-black">{filteredFormulas.length}</strong> formula cards
          </p>
        </div>

        {/* Loading state */}
        {loading ? (
          <div className="py-20 text-center">
            <Loader2 className="w-8 h-8 text-[#1428A0] animate-spin mx-auto mb-3" />
            <p className="text-xs text-neutral-500">Loading formula handbook...</p>
          </div>
        ) : filteredFormulas.length === 0 ? (
          <div className="py-20 text-center bg-white rounded-3xl border border-black/5 p-8">
            <BookOpen className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-black font-heading">No formulas match your criteria</h3>
            <p className="text-xs text-[#757575] mt-1">Try resetting search filters or search another topic.</p>
            <button
              onClick={() => { setSearchQuery(''); setSelectedTopic('All'); setSelectedCategory('All'); }}
              className="mt-4 btn-samsung !text-xs !py-2"
            >
              Reset Search
            </button>
          </div>
        ) : (
          /* Formula Cards Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 print:grid-cols-1 print:gap-4">
            {filteredFormulas.map((formula) => {
              const isBookmarked = user?.savedFormulas?.includes(formula._id);
              const isExampleOpen = expandedExampleId === formula._id;

              return (
                <div 
                  key={formula._id}
                  className="samsung-card p-6 bg-white border border-black/8 hover:border-[#1428A0]/30 transition-all flex flex-col justify-between print:border-black print:shadow-none"
                >
                  <div>
                    {/* Header */}
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#E8ECF5] text-[#1428A0] font-semibold">
                          {formula.topicName}
                        </span>
                        <h3 className="text-base font-bold text-black font-heading mt-1">
                          {formula.name}
                        </h3>
                      </div>

                      {/* Top Action Icons */}
                      <div className="flex items-center gap-1.5 print:hidden">
                        <button
                          onClick={() => toggleBookmarkFormula(formula._id)}
                          className={`p-2 rounded-xl transition-colors ${
                            isBookmarked 
                              ? 'bg-amber-100 text-amber-700' 
                              : 'bg-neutral-100 text-neutral-400 hover:text-black'
                          }`}
                          title="Bookmark formula"
                        >
                          <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-amber-600' : ''}`} />
                        </button>

                        <button
                          onClick={() => handleCopy(formula)}
                          className="p-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-600 transition-colors"
                          title="Copy formula"
                        >
                          {copiedId === formula._id ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="w-3.5 h-3.5 text-neutral-600" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Formula Mathematical Card */}
                    <div className="my-4 p-4 rounded-2xl bg-neutral-900 text-white flex items-center justify-between">
                      <code className="text-xs sm:text-sm font-mono text-emerald-400 font-semibold break-all">
                        {formula.expression}
                      </code>
                    </div>

                    {/* Variables breakdown */}
                    {formula.variables?.length > 0 && (
                      <div className="mt-3">
                        <span className="text-[10px] font-mono font-bold text-neutral-400 uppercase tracking-wider block mb-1">
                          Variables Meaning
                        </span>
                        <div className="space-y-0.5">
                          {formula.variables.map((v, vIdx) => (
                            <p key={vIdx} className="text-xs text-neutral-600">
                              <strong className="text-black font-mono">{v.symbol}:</strong> {v.meaning}
                            </p>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* When to use */}
                    <div className="mt-3 p-3 rounded-xl bg-blue-50/60 border border-blue-100 text-xs text-blue-900">
                      <strong>When to use:</strong> {formula.whenToUse}
                    </div>

                    {/* Solved Example Accordion */}
                    {formula.solvedExample && (
                      <div className="mt-3">
                        <button
                          onClick={() => setExpandedExampleId(isExampleOpen ? null : formula._id)}
                          className="text-xs font-bold text-[#1428A0] hover:underline flex items-center gap-1 print:hidden"
                        >
                          <HelpCircle className="w-3.5 h-3.5" />
                          <span>{isExampleOpen ? 'Hide Solved Example' : 'View Solved Example'}</span>
                        </button>

                        {(isExampleOpen || window.matchMedia('print').matches) && (
                          <div className="mt-2 p-3.5 rounded-xl bg-[#FAF9F6] border border-black/5 text-xs space-y-1.5 animate-in fade-in">
                            <p className="font-semibold text-black">
                              <strong>Q:</strong> {formula.solvedExample.question}
                            </p>
                            <p className="text-neutral-700">
                              <strong>Solution:</strong> {formula.solvedExample.solution}
                            </p>
                            <p className="font-bold text-emerald-700">
                              <strong>Final Answer:</strong> {formula.solvedExample.answer}
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Card bottom */}
                  <div className="mt-5 pt-3 border-t border-black/5 flex items-center justify-between text-[11px] text-neutral-400 print:hidden">
                    <button
                      onClick={() => handleCopy(formula)}
                      className="text-black font-semibold hover:text-[#1428A0] flex items-center gap-1"
                    >
                      <Copy className="w-3 h-3" />
                      <span>{copiedId === formula._id ? 'Copied to Clipboard' : 'Copy Formula'}</span>
                    </button>
                    <Link to={`/learn/${formula.topicSlug}`} className="hover:text-black">
                      Go to Topic Lesson →
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>

    </div>
  );
}

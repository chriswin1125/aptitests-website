import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { getExamsApi, getCompaniesApi } from '../services/api';
import { 
  Landmark, 
  GraduationCap, 
  Building2, 
  ArrowRight, 
  Clock, 
  Award, 
  Layers, 
  CheckCircle2, 
  Sparkles,
  Loader2
} from 'lucide-react';

export default function ExamsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCat = searchParams.get('category') || 'All';

  const [activeTab, setActiveTab] = useState(initialCat);
  const [exams, setExams] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [examsRes, compsRes] = await Promise.all([
          getExamsApi(),
          getCompaniesApi()
        ]);
        setExams(examsRes.data);
        setCompanies(compsRes.data);
      } catch (err) {
        console.error('Error fetching exams', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === 'All') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', tab);
    }
    setSearchParams(searchParams);
  };

  const bankingExams = exams.filter(e => e.category === 'Banking Exams');
  const competitiveExams = exams.filter(e => e.category === 'Competitive Exams');

  return (
    <div className="min-h-screen bg-[#F7F7F7] pb-24">
      
      {/* Header Banner */}
      <section className="bg-white border-b border-black/5 pt-12 pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="max-w-2xl">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#1428A0]">
              Examination Syllabi & Guides
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-black tracking-tight mt-2 font-heading">
              Exam Preparation Hub
            </h1>
            <p className="text-xs sm:text-sm text-[#757575] mt-2 leading-relaxed">
              Curated preparation tracks tailored to banking exams, central/state competitive examinations, and top campus recruitment drives.
            </p>
          </div>

          {/* 4 Category Filter Pills */}
          <div className="mt-8 flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
            {[
              { id: 'All', label: 'All Examinations', count: exams.length + companies.length },
              { id: 'Banking Exams', label: 'Banking Exams', icon: Landmark, count: bankingExams.length },
              { id: 'Competitive Exams', label: 'Competitive Exams', icon: GraduationCap, count: competitiveExams.length },
              { id: 'Campus Placement', label: 'Campus Recruitment', icon: Building2, count: companies.length },
            ].map((tab) => {
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`px-4 py-2.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 ${
                    active 
                      ? 'bg-black text-white shadow-sm' 
                      : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                  }`}
                >
                  {tab.icon && <tab.icon className="w-3.5 h-3.5" />}
                  <span>{tab.label}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    active ? 'bg-white/20 text-white' : 'bg-neutral-200 text-neutral-700'
                  }`}>
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>

        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-12">
        
        {loading ? (
          <div className="py-20 text-center">
            <Loader2 className="w-8 h-8 text-[#1428A0] animate-spin mx-auto mb-3" />
            <p className="text-xs text-neutral-500">Loading examination blueprints...</p>
          </div>
        ) : (
          <>
            {/* 1. BANKING EXAMS SECTION */}
            {(activeTab === 'All' || activeTab === 'Banking Exams') && (
              <div>
                <div className="flex items-center gap-2.5 mb-6">
                  <div className="w-8 h-8 rounded-xl bg-black text-white flex items-center justify-center">
                    <Landmark className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-black font-heading">Banking Examinations</h2>
                    <p className="text-xs text-[#757575]">IBPS PO, IBPS Clerk, SBI PO, SBI Clerk, RBI Assistant, RBI Grade B</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {bankingExams.map((exam) => (
                    <Link
                      key={exam.slug}
                      to={`/exams/${exam.slug}`}
                      className="samsung-card p-6 bg-white border border-black/8 hover:border-[#1428A0]/30 transition-all flex flex-col justify-between group"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-black text-white font-semibold">
                            {exam.category.split(' ')[0]}
                          </span>
                          <span className="text-xs font-mono text-neutral-400">
                            {exam.frequency}
                          </span>
                        </div>

                        <h3 className="text-lg font-bold text-black group-hover:text-[#1428A0] transition-colors font-heading">
                          {exam.name}
                        </h3>
                        <p className="text-xs text-[#757575] mt-1 font-medium">{exam.tagline}</p>
                        
                        <p className="text-xs text-neutral-600 mt-3 line-clamp-2 leading-relaxed">
                          {exam.overview}
                        </p>

                        <div className="my-4 p-3 rounded-2xl bg-neutral-50 grid grid-cols-2 gap-2 text-center text-xs">
                          <div>
                            <p className="font-bold text-black">{exam.totalMarks} Marks</p>
                            <p className="text-[10px] text-neutral-400">Total Marks</p>
                          </div>
                          <div>
                            <p className="font-bold text-black">{exam.durationMinutes} Mins</p>
                            <p className="text-[10px] text-neutral-400">Duration</p>
                          </div>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-black/5 flex items-center justify-between text-xs font-bold text-black group-hover:text-[#1428A0]">
                        <span>View Syllabus & Tests</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* 2. COMPETITIVE EXAMS SECTION */}
            {(activeTab === 'All' || activeTab === 'Competitive Exams') && (
              <div>
                <div className="flex items-center gap-2.5 mb-6">
                  <div className="w-8 h-8 rounded-xl bg-[#1428A0] text-white flex items-center justify-center">
                    <GraduationCap className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-black font-heading">Competitive Examinations</h2>
                    <p className="text-xs text-[#757575]">SSC CGL, SSC CHSL, RRB NTPC, RRB Group D, UPSC CSAT</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {competitiveExams.map((exam) => (
                    <Link
                      key={exam.slug}
                      to={`/exams/${exam.slug}`}
                      className="samsung-card p-6 bg-white border border-black/8 hover:border-[#1428A0]/30 transition-all flex flex-col justify-between group"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-[#1428A0] text-white font-semibold">
                            {exam.category.split(' ')[0]}
                          </span>
                          <span className="text-xs font-mono text-neutral-400">
                            {exam.frequency}
                          </span>
                        </div>

                        <h3 className="text-lg font-bold text-black group-hover:text-[#1428A0] transition-colors font-heading">
                          {exam.name}
                        </h3>
                        <p className="text-xs text-[#757575] mt-1 font-medium">{exam.tagline}</p>
                        
                        <p className="text-xs text-neutral-600 mt-3 line-clamp-2 leading-relaxed">
                          {exam.overview}
                        </p>

                        <div className="my-4 p-3 rounded-2xl bg-neutral-50 grid grid-cols-2 gap-2 text-center text-xs">
                          <div>
                            <p className="font-bold text-black">{exam.totalMarks} Marks</p>
                            <p className="text-[10px] text-neutral-400">Total Marks</p>
                          </div>
                          <div>
                            <p className="font-bold text-black">{exam.durationMinutes} Mins</p>
                            <p className="text-[10px] text-neutral-400">Duration</p>
                          </div>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-black/5 flex items-center justify-between text-xs font-bold text-black group-hover:text-[#1428A0]">
                        <span>View Syllabus & Tests</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* 3. CAMPUS PLACEMENT SECTION */}
            {(activeTab === 'All' || activeTab === 'Campus Placement') && (
              <div>
                <div className="flex items-center gap-2.5 mb-6">
                  <div className="w-8 h-8 rounded-xl bg-neutral-900 text-white flex items-center justify-center">
                    <Building2 className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-black font-heading">Campus Recruitment Assessment Drives</h2>
                    <p className="text-xs text-[#757575]">TCS, Infosys, Wipro, Accenture, Cognizant, Capgemini, Zoho, HCL</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {companies.map((comp) => {
                    const companyPhotos = {
                      tcs: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=160&auto=format&fit=crop&q=80',
                      infosys: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=160&auto=format&fit=crop&q=80',
                      wipro: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=160&auto=format&fit=crop&q=80',
                      accenture: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=160&auto=format&fit=crop&q=80',
                      cognizant: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=160&auto=format&fit=crop&q=80',
                      capgemini: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=160&auto=format&fit=crop&q=80',
                      zoho: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=160&auto=format&fit=crop&q=80',
                      hcl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=160&auto=format&fit=crop&q=80'
                    };
                    const photo = companyPhotos[comp.slug] || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=160&auto=format&fit=crop&q=80';

                    return (
                      <Link
                        key={comp.slug}
                        to={`/companies/${comp.slug}`}
                        className="samsung-card p-5 bg-white border border-black/8 hover:border-black/30 transition-all flex flex-col justify-between group overflow-hidden"
                      >
                        <div>
                          <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 rounded-2xl overflow-hidden border border-black/10 shadow-sm shrink-0">
                              <img 
                                src={photo} 
                                alt={comp.name} 
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" 
                              />
                            </div>
                            <span className="text-[10px] font-mono font-bold text-neutral-500 bg-black/5 px-2.5 py-0.5 rounded-full">
                              Tier-1
                            </span>
                          </div>

                          <h3 className="text-base font-bold text-black font-heading group-hover:text-[#1428A0] transition-colors">{comp.name}</h3>
                          <p className="text-xs font-semibold text-[#1428A0] mt-0.5">Package: {comp.ctcRange}</p>
                        
                        <p className="text-xs text-neutral-600 mt-2 line-clamp-2 leading-relaxed">
                          {comp.overview}
                        </p>

                        <div className="mt-4 pt-3 border-t border-black/5 text-[11px] text-neutral-400">
                          <span>Roles: <strong className="text-black">{comp.hiringRoles?.[0] || 'Software Engineer'}</strong></span>
                        </div>
                      </div>

                      <div className="mt-5 pt-3 border-t border-black/5 flex items-center justify-between text-xs font-bold text-black group-hover:text-[#1428A0]">
                        <span>Full Assessment Guide</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </Link>
                  );
                })}
                </div>
              </div>
            )}
          </>
        )}

      </div>

    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  getAdminStatsApi, 
  getAdminUsersApi, 
  updateAdminUserRoleApi, 
  createFormulaApi, 
  createTopicApi, 
  getTopicsApi 
} from '../services/api';
import { 
  ShieldCheck, 
  Users, 
  BookOpen, 
  FileText, 
  Binary, 
  TrendingUp, 
  Plus, 
  CheckCircle, 
  AlertCircle,
  Loader2,
  Lock
} from 'lucide-react';

export default function AdminPage() {
  const { user, isAdmin, openLoginModal } = useAuth();

  const [stats, setStats] = useState(null);
  const [userList, setUserList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeAdminTab, setActiveAdminTab] = useState('stats'); // 'stats' | 'users' | 'add-formula' | 'add-topic'
  const [statusMsg, setStatusMsg] = useState('');

  // Add Formula Form State
  const [formulaForm, setFormulaForm] = useState({
    name: '',
    topicSlug: 'percentage',
    topicName: 'Percentage',
    category: 'Quantitative Aptitude',
    expression: '',
    whenToUse: '',
    sampleQuestion: '',
    sampleSolution: '',
    sampleAnswer: ''
  });

  // Add Topic Form State
  const [topicForm, setTopicForm] = useState({
    name: '',
    slug: '',
    category: 'Quantitative Aptitude',
    difficulty: 'Intermediate',
    estimatedTime: '2.5 Hours',
    summary: '',
    description: '',
    importance: 'High'
  });

  useEffect(() => {
    if (!isAdmin) {
      setLoading(false);
      return;
    }

    const fetchAdminData = async () => {
      setLoading(true);
      try {
        const [statsRes, usersRes] = await Promise.all([
          getAdminStatsApi(),
          getAdminUsersApi()
        ]);
        setStats(statsRes.data);
        setUserList(usersRes.data);
      } catch (err) {
        console.error('Error fetching admin data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAdminData();
  }, [isAdmin]);

  const handleRoleToggle = async (userId, currentRole) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    try {
      await updateAdminUserRoleApi(userId, newRole);
      setUserList(prev => prev.map(u => u._id === userId ? { ...u, role: newRole } : u));
      setStatusMsg(`User role updated to ${newRole}`);
      setTimeout(() => setStatusMsg(''), 3000);
    } catch (err) {
      alert('Failed to update role');
    }
  };

  const handleCreateFormula = async (e) => {
    e.preventDefault();
    try {
      await createFormulaApi({
        name: formulaForm.name,
        topicSlug: formulaForm.topicSlug,
        topicName: formulaForm.topicName,
        category: formulaForm.category,
        expression: formulaForm.expression,
        whenToUse: formulaForm.whenToUse,
        solvedExample: {
          question: formulaForm.sampleQuestion || 'Standard verification problem',
          solution: formulaForm.sampleSolution || 'Apply direct substitution',
          answer: formulaForm.sampleAnswer || 'Calculated'
        }
      });
      setStatusMsg('Formula added to database successfully!');
      setFormulaForm({
        name: '',
        topicSlug: 'percentage',
        topicName: 'Percentage',
        category: 'Quantitative Aptitude',
        expression: '',
        whenToUse: '',
        sampleQuestion: '',
        sampleSolution: '',
        sampleAnswer: ''
      });
      setTimeout(() => setStatusMsg(''), 3000);
    } catch (err) {
      alert(err.response?.data?.message || 'Error creating formula');
    }
  };

  const handleCreateTopic = async (e) => {
    e.preventDefault();
    try {
      const slug = topicForm.slug || topicForm.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      await createTopicApi({
        ...topicForm,
        slug,
        concepts: { basic: [], intermediate: [], advanced: [], shortcuts: [], commonMistakes: [] },
        formulas: [],
        solvedExamples: [],
        practiceQuestions: [],
        testQuestions: []
      });
      setStatusMsg('Topic created successfully!');
      setTopicForm({
        name: '',
        slug: '',
        category: 'Quantitative Aptitude',
        difficulty: 'Intermediate',
        estimatedTime: '2.5 Hours',
        summary: '',
        description: '',
        importance: 'High'
      });
      setTimeout(() => setStatusMsg(''), 3000);
    } catch (err) {
      alert(err.response?.data?.message || 'Error creating topic');
    }
  };

  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F7F7F7] px-4">
        <div className="samsung-card p-8 sm:p-12 bg-white border border-black/8 text-center max-w-md w-full space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-neutral-900 text-white flex items-center justify-center mx-auto text-xl font-bold font-heading">
            <Lock className="w-8 h-8 text-[#1428A0]" />
          </div>
          <h2 className="text-2xl font-bold text-black font-heading">
            Admin Privileges Required
          </h2>
          <p className="text-xs text-[#757575] leading-relaxed">
            Only platform administrators can access this console. Please sign in with an authorized admin account.
          </p>
          <button
            onClick={openLoginModal}
            className="btn-samsung !text-xs !py-3 !w-full justify-center"
          >
            <span>Switch to Admin Account</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F7F7] pb-24">
      
      {/* Header */}
      <section className="bg-white border-b border-black/5 pt-12 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-blue-50 text-[#1428A0] text-xs font-bold">
                  <ShieldCheck className="w-4 h-4" />
                  Admin Console
                </span>
                <span className="text-xs text-neutral-400">Authenticated: {user.name}</span>
              </div>
              <h1 className="text-3xl font-extrabold text-black font-heading">
                Platform Content & User Governance
              </h1>
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto bg-neutral-100 p-1.5 rounded-full">
              {[
                { id: 'stats', label: 'Overview Stats' },
                { id: 'users', label: 'User Directory' },
                { id: 'add-formula', label: '+ Add Formula' },
                { id: 'add-topic', label: '+ Add Topic' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveAdminTab(tab.id)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                    activeAdminTab === tab.id
                      ? 'bg-black text-white shadow-xs'
                      : 'text-neutral-600 hover:text-black'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        
        {statusMsg && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <span>{statusMsg}</span>
          </div>
        )}

        {/* 1. OVERVIEW STATS TAB */}
        {activeAdminTab === 'stats' && stats && (
          <div className="space-y-8 animate-in fade-in">
            
            {/* Metric Counters */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
              {[
                { label: 'Registered Users', val: stats.counts.totalUsers },
                { label: 'Curriculum Topics', val: stats.counts.totalTopics },
                { label: 'Formulas', val: stats.counts.totalFormulas },
                { label: 'Exams Syllabi', val: stats.counts.totalExams },
                { label: 'Recruiters', val: stats.counts.totalCompanies },
                { label: 'Mock Tests', val: stats.counts.totalMockTests },
                { label: 'Exam Submissions', val: stats.counts.totalAttempts },
              ].map((m, idx) => (
                <div key={idx} className="samsung-card p-4 bg-white border border-black/8 text-center">
                  <span className="text-[10px] font-mono text-neutral-400 uppercase font-bold block truncate">
                    {m.label}
                  </span>
                  <p className="text-2xl font-bold text-black font-heading mt-1">{m.val}</p>
                </div>
              ))}
            </div>

            {/* Recent Registrations & Attempts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              <div className="samsung-card p-6 bg-white border border-black/8 space-y-4">
                <h3 className="text-sm font-bold text-black font-heading">Recent User Registrations</h3>
                <div className="divide-y divide-black/5 text-xs">
                  {stats.recentUsers?.map(u => (
                    <div key={u._id} className="py-2.5 flex items-center justify-between">
                      <div>
                        <p className="font-bold text-black">{u.name}</p>
                        <p className="text-[11px] text-neutral-400">{u.email}</p>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-neutral-100 font-semibold uppercase">
                        {u.role}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="samsung-card p-6 bg-white border border-black/8 space-y-4">
                <h3 className="text-sm font-bold text-black font-heading">Recent Mock Test Submissions</h3>
                <div className="divide-y divide-black/5 text-xs">
                  {stats.recentAttempts?.map(a => (
                    <div key={a._id} className="py-2.5 flex items-center justify-between">
                      <div>
                        <p className="font-bold text-black">{a.testTitle}</p>
                        <p className="text-[11px] text-neutral-400">{a.userEmail || 'Aspirant Demo'}</p>
                      </div>
                      <span className="font-bold text-emerald-700">
                        {a.score} / {a.maxMarks} ({a.accuracy}%)
                      </span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>
        )}

        {/* 2. USERS MANAGEMENT TAB */}
        {activeAdminTab === 'users' && (
          <div className="samsung-card p-6 sm:p-8 bg-white border border-black/8 space-y-6 animate-in fade-in">
            <h3 className="text-base font-bold text-black font-heading">
              User Directory & Role Management
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-neutral-50 text-neutral-500 uppercase text-[10px] border-b border-black/5">
                  <tr>
                    <th className="p-3">User</th>
                    <th className="p-3">Target Exam</th>
                    <th className="p-3">Streak</th>
                    <th className="p-3">Role</th>
                    <th className="p-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/5 text-neutral-700">
                  {userList.map(u => (
                    <tr key={u._id} className="hover:bg-neutral-50/50">
                      <td className="p-3">
                        <p className="font-bold text-black">{u.name}</p>
                        <p className="text-[11px] text-neutral-400">{u.email}</p>
                      </td>
                      <td className="p-3 font-medium">{u.targetExam || 'General'}</td>
                      <td className="p-3 font-semibold text-amber-600">{u.streak || 1}d</td>
                      <td className="p-3">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                          u.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-neutral-100 text-neutral-700'
                        }`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => handleRoleToggle(u._id, u.role)}
                          className="text-xs font-semibold text-[#1428A0] hover:underline"
                        >
                          Switch to {u.role === 'admin' ? 'User' : 'Admin'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 3. ADD FORMULA TAB */}
        {activeAdminTab === 'add-formula' && (
          <div className="samsung-card p-6 sm:p-8 bg-white border border-black/8 max-w-2xl mx-auto space-y-6 animate-in fade-in">
            <h3 className="text-base font-bold text-black font-heading">
              Add New Formula to Formula Book
            </h3>

            <form onSubmit={handleCreateFormula} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-neutral-700 uppercase tracking-wider mb-1">
                  Formula Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Successive Percentage Change"
                  value={formulaForm.name}
                  onChange={(e) => setFormulaForm({ ...formulaForm, name: e.target.value })}
                  className="w-full p-2.5 rounded-2xl bg-neutral-50 border border-black/8 outline-none focus:border-black font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-neutral-700 uppercase tracking-wider mb-1">
                    Subject Category
                  </label>
                  <select
                    value={formulaForm.category}
                    onChange={(e) => setFormulaForm({ ...formulaForm, category: e.target.value })}
                    className="w-full p-2.5 rounded-2xl bg-neutral-50 border border-black/8 outline-none font-medium"
                  >
                    <option value="Quantitative Aptitude">Quantitative Aptitude</option>
                    <option value="Logical Reasoning">Logical Reasoning</option>
                    <option value="Data Interpretation">Data Interpretation</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-neutral-700 uppercase tracking-wider mb-1">
                    Topic Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Percentage"
                    value={formulaForm.topicName}
                    onChange={(e) => setFormulaForm({ 
                      ...formulaForm, 
                      topicName: e.target.value,
                      topicSlug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-')
                    })}
                    className="w-full p-2.5 rounded-2xl bg-neutral-50 border border-black/8 outline-none font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-neutral-700 uppercase tracking-wider mb-1">
                  Mathematical Expression
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Net % = a + b + (ab / 100)"
                  value={formulaForm.expression}
                  onChange={(e) => setFormulaForm({ ...formulaForm, expression: e.target.value })}
                  className="w-full p-2.5 rounded-2xl bg-neutral-50 border border-black/8 outline-none font-mono font-semibold"
                />
              </div>

              <div>
                <label className="block font-bold text-neutral-700 uppercase tracking-wider mb-1">
                  When to Use
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. When two consecutive discounts or markups occur"
                  value={formulaForm.whenToUse}
                  onChange={(e) => setFormulaForm({ ...formulaForm, whenToUse: e.target.value })}
                  className="w-full p-2.5 rounded-2xl bg-neutral-50 border border-black/8 outline-none font-medium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block font-bold text-neutral-700 uppercase tracking-wider mb-1">
                    Sample Question
                  </label>
                  <input
                    type="text"
                    placeholder="Brief example problem"
                    value={formulaForm.sampleQuestion}
                    onChange={(e) => setFormulaForm({ ...formulaForm, sampleQuestion: e.target.value })}
                    className="w-full p-2.5 rounded-2xl bg-neutral-50 border border-black/8 outline-none font-medium"
                  />
                </div>
                <div>
                  <label className="block font-bold text-neutral-700 uppercase tracking-wider mb-1">
                    Final Answer
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 28% discount"
                    value={formulaForm.sampleAnswer}
                    onChange={(e) => setFormulaForm({ ...formulaForm, sampleAnswer: e.target.value })}
                    className="w-full p-2.5 rounded-2xl bg-neutral-50 border border-black/8 outline-none font-medium"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full btn-samsung !text-xs !py-3 justify-center mt-2"
              >
                <span>Save Formula to Database</span>
              </button>
            </form>
          </div>
        )}

        {/* 4. ADD TOPIC TAB */}
        {activeAdminTab === 'add-topic' && (
          <div className="samsung-card p-6 sm:p-8 bg-white border border-black/8 max-w-2xl mx-auto space-y-6 animate-in fade-in">
            <h3 className="text-base font-bold text-black font-heading">
              Add New Topic to Curriculum
            </h3>

            <form onSubmit={handleCreateTopic} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-neutral-700 uppercase tracking-wider mb-1">
                    Topic Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Permutation and Combination"
                    value={topicForm.name}
                    onChange={(e) => setTopicForm({ 
                      ...topicForm, 
                      name: e.target.value,
                      slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-')
                    })}
                    className="w-full p-2.5 rounded-2xl bg-neutral-50 border border-black/8 outline-none font-medium"
                  />
                </div>

                <div>
                  <label className="block font-bold text-neutral-700 uppercase tracking-wider mb-1">
                    Slug
                  </label>
                  <input
                    type="text"
                    required
                    value={topicForm.slug}
                    onChange={(e) => setTopicForm({ ...topicForm, slug: e.target.value })}
                    className="w-full p-2.5 rounded-2xl bg-neutral-50 border border-black/8 outline-none font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-neutral-700 uppercase tracking-wider mb-1">
                    Category
                  </label>
                  <select
                    value={topicForm.category}
                    onChange={(e) => setTopicForm({ ...topicForm, category: e.target.value })}
                    className="w-full p-2.5 rounded-2xl bg-neutral-50 border border-black/8 outline-none font-medium"
                  >
                    <option value="Quantitative Aptitude">Quantitative Aptitude</option>
                    <option value="Logical Reasoning">Logical Reasoning</option>
                    <option value="Verbal Ability">Verbal Ability</option>
                    <option value="Data Interpretation">Data Interpretation</option>
                    <option value="Computer Aptitude">Computer Aptitude</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-neutral-700 uppercase tracking-wider mb-1">
                    Difficulty
                  </label>
                  <select
                    value={topicForm.difficulty}
                    onChange={(e) => setTopicForm({ ...topicForm, difficulty: e.target.value })}
                    className="w-full p-2.5 rounded-2xl bg-neutral-50 border border-black/8 outline-none font-medium"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-neutral-700 uppercase tracking-wider mb-1">
                    Est. Time
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 3.0 Hours"
                    value={topicForm.estimatedTime}
                    onChange={(e) => setTopicForm({ ...topicForm, estimatedTime: e.target.value })}
                    className="w-full p-2.5 rounded-2xl bg-neutral-50 border border-black/8 outline-none font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-neutral-700 uppercase tracking-wider mb-1">
                  Short Summary
                </label>
                <input
                  type="text"
                  required
                  placeholder="1-line overview of the topic"
                  value={topicForm.summary}
                  onChange={(e) => setTopicForm({ ...topicForm, summary: e.target.value })}
                  className="w-full p-2.5 rounded-2xl bg-neutral-50 border border-black/8 outline-none font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-neutral-700 uppercase tracking-wider mb-1">
                  Full Description
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Detailed explanation of the topic"
                  value={topicForm.description}
                  onChange={(e) => setTopicForm({ ...topicForm, description: e.target.value })}
                  className="w-full p-2.5 rounded-2xl bg-neutral-50 border border-black/8 outline-none font-medium"
                />
              </div>

              <button
                type="submit"
                className="w-full btn-samsung !text-xs !py-3 justify-center mt-2"
              >
                <span>Create Topic Module</span>
              </button>
            </form>
          </div>
        )}

      </div>

    </div>
  );
}

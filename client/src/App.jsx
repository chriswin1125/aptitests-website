import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import GlobalSearchModal from './components/GlobalSearchModal';
import AuthModal from './components/AuthModal';

import HomePage from './pages/HomePage';
import LearnPage from './pages/LearnPage';
import TopicDetailPage from './pages/TopicDetailPage';
import FormulaBookPage from './pages/FormulaBookPage';
import PracticePage from './pages/PracticePage';
import ExamsPage from './pages/ExamsPage';
import ExamDetailPage from './pages/ExamDetailPage';
import CompanyDetailPage from './pages/CompanyDetailPage';
import MockTestsPage from './pages/MockTestsPage';
import TestEnginePage from './pages/TestEnginePage';
import DailyChallengePage from './pages/DailyChallengePage';
import DashboardPage from './pages/DashboardPage';
import AdminPage from './pages/AdminPage';

function AppLayout() {
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const location = useLocation();

  // If in active test engine mode, hide standard navbar and footer to simulate clean full-screen CBT
  const isCbtActive = location.pathname.startsWith('/test/');

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F7F7] text-[#191919]">
      {!isCbtActive && <Navbar onOpenSearch={() => setSearchModalOpen(true)} />}

      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/learn" element={<LearnPage />} />
          <Route path="/learn/:slug" element={<TopicDetailPage />} />
          <Route path="/formulas" element={<FormulaBookPage />} />
          <Route path="/practice" element={<PracticePage />} />
          <Route path="/exams" element={<ExamsPage />} />
          <Route path="/exams/:slug" element={<ExamDetailPage />} />
          <Route path="/companies/:slug" element={<CompanyDetailPage />} />
          <Route path="/mock-tests" element={<MockTestsPage />} />
          <Route path="/test/:slug" element={<TestEnginePage />} />
          <Route path="/daily-challenge" element={<DailyChallengePage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="*" element={<HomePage />} />
        </Routes>
      </main>

      {!isCbtActive && <Footer />}

      {/* Global Modals */}
      <GlobalSearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
      />
      <AuthModal />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <AppLayout />
      </Router>
    </AuthProvider>
  );
}

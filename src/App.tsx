/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { SchoolProvider, useSchool } from './context/SchoolContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { DemoBanner } from './components/common/DemoBanner';

// Public Pages
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { AcademicsPage } from './pages/AcademicsPage';
import { FacultyPage } from './pages/FacultyPage';
import { AdmissionsPage } from './pages/AdmissionsPage';
import { NoticeBoardPage } from './pages/NoticeBoardPage';
import { EventsPage } from './pages/EventsPage';
import { ResultsPage } from './pages/ResultsPage';
import { GalleryPage } from './pages/GalleryPage';
import { DownloadsPage } from './pages/DownloadsPage';
import { ContactPage } from './pages/ContactPage';
import { PrincipalMessagePage } from './pages/PrincipalMessagePage';
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage';
import { TermsPage } from './pages/TermsPage';

// Admin Pages & Layout
import { AdminLayout } from './layouts/AdminLayout';
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminNoticesPage } from './pages/admin/AdminNoticesPage';
import { AdminTeachersPage } from './pages/admin/AdminTeachersPage';
import { AdminEventsPage } from './pages/admin/AdminEventsPage';
import { AdminGalleryPage } from './pages/admin/AdminGalleryPage';
import { AdminResultsPage } from './pages/admin/AdminResultsPage';
import { AdminDownloadsPage } from './pages/admin/AdminDownloadsPage';
import { AdminAdmissionsPage } from './pages/admin/AdminAdmissionsPage';
import { AdminSettingsPage } from './pages/admin/AdminSettingsPage';
import { AdminSecurityPage } from './pages/admin/AdminSecurityPage';

import { ArrowUp, Bell, AlertCircle } from 'lucide-react';
import { api } from './services/api';
import type { Notice } from './types';

function MainApp() {
  const { settings } = useSchool();
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  const [currentPage, setCurrentPage] = useState<string>('home');
  const [adminTab, setAdminTab] = useState<string>('dashboard');
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [urgentNotice, setUrgentNotice] = useState<Notice | null>(null);

  // Synchronize browser tab title
  useEffect(() => {
    const titles: Record<string, string> = {
      home: `${settings.school_name} | Official Website`,
      about: `About Us | ${settings.school_name}`,
      'principal-message': `Principal's Message | ${settings.school_name}`,
      academics: `Academics & Curriculum | ${settings.school_name}`,
      faculty: `Faculty & Staff | ${settings.school_name}`,
      admissions: `Admissions 2025-26 | ${settings.school_name}`,
      notices: `Notice Board & Circulars | ${settings.school_name}`,
      events: `Events & Celebrations | ${settings.school_name}`,
      results: `Results & Merit List | ${settings.school_name}`,
      gallery: `Photo Gallery | ${settings.school_name}`,
      downloads: `Downloads & Forms | ${settings.school_name}`,
      contact: `Contact Us | ${settings.school_name}`,
      'privacy-policy': `Privacy Policy | ${settings.school_name}`,
      terms: `Terms of Use | ${settings.school_name}`,
      admin: `Admin Portal | ${settings.school_name}`,
    };
    document.title = titles[currentPage] || `${settings.school_name} | Official Website`;
  }, [currentPage, settings.school_name]);

  // Back to top scroll listener
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fetch urgent/pinned notice for announcements ticker
  useEffect(() => {
    async function loadUrgentNotice() {
      try {
        const res = await api.notices.getAll({ limit: 1 });
        if (res.notices && res.notices.length > 0) {
          setUrgentNotice(res.notices[0]);
        }
      } catch (e) {
        // Silently handle if offline or backend cold start
      }
    }
    loadUrgentNotice();
  }, []);

  const navigateToPage = (page: string) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // --- ADMIN PORTAL ROUTE ---
  if (currentPage === 'admin' || currentPage === 'admin-login') {
    if (authLoading) {
      return (
        <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white p-4">
          <div className="w-10 h-10 border-4 border-amber-400 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-sm font-semibold tracking-wide">Loading Admin Session...</p>
        </div>
      );
    }

    if (!isAuthenticated) {
      return (
        <AdminLoginPage
          onBackToPublic={() => navigateToPage('home')}
          onLoginSuccess={() => setCurrentPage('admin')}
        />
      );
    }

    return (
      <AdminLayout
        currentTab={adminTab}
        setCurrentTab={setAdminTab}
        onExitToPublic={() => navigateToPage('home')}
      >
        {adminTab === 'dashboard' && <AdminDashboardPage onNavigateTab={setAdminTab} />}
        {adminTab === 'notices' && <AdminNoticesPage />}
        {adminTab === 'teachers' && <AdminTeachersPage />}
        {adminTab === 'events' && <AdminEventsPage />}
        {adminTab === 'gallery' && <AdminGalleryPage />}
        {adminTab === 'results' && <AdminResultsPage />}
        {adminTab === 'downloads' && <AdminDownloadsPage />}
        {adminTab === 'admissions' && <AdminAdmissionsPage />}
        {adminTab === 'settings' && <AdminSettingsPage />}
        {adminTab === 'security' && <AdminSecurityPage />}
      </AdminLayout>
    );
  }

  // --- PUBLIC WEBSITE ROUTE ---
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-amber-400 selection:text-slate-900 font-sans">
      <DemoBanner />

      {/* Urgent Notice Strip */}
      {urgentNotice && (
        <div className="bg-amber-500 text-blue-950 px-4 py-1.5 text-xs font-semibold flex items-center justify-between border-b border-amber-600/30">
          <div className="max-w-7xl mx-auto w-full flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 truncate">
              <span className="bg-blue-950 text-amber-400 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase shrink-0">
                Latest Notice
              </span>
              <span className="truncate font-medium">{urgentNotice.title}</span>
            </div>
            <button
              onClick={() => navigateToPage('notices')}
              className="text-xs font-bold underline hover:text-blue-900 shrink-0"
            >
              View Notice Board →
            </button>
          </div>
        </div>
      )}

      <Navbar currentPage={currentPage} setCurrentPage={navigateToPage} />

      {/* Main Page Routing */}
      <main className="flex-1">
        {currentPage === 'home' && <HomePage setCurrentPage={navigateToPage} />}
        {currentPage === 'about' && <AboutPage setCurrentPage={navigateToPage} />}
        {currentPage === 'principal-message' && <PrincipalMessagePage setCurrentPage={navigateToPage} />}
        {currentPage === 'academics' && <AcademicsPage />}
        {currentPage === 'faculty' && <FacultyPage />}
        {currentPage === 'admissions' && <AdmissionsPage />}
        {currentPage === 'notices' && <NoticeBoardPage />}
        {currentPage === 'events' && <EventsPage />}
        {currentPage === 'results' && <ResultsPage />}
        {currentPage === 'gallery' && <GalleryPage />}
        {currentPage === 'downloads' && <DownloadsPage />}
        {currentPage === 'contact' && <ContactPage />}
        {currentPage === 'privacy-policy' && <PrivacyPolicyPage />}
        {currentPage === 'terms' && <TermsPage />}
      </main>

      <Footer setCurrentPage={navigateToPage} />

      {/* Floating Back to Top Button */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          id="btn-scroll-top"
          aria-label="Scroll to top of page"
          className="fixed bottom-6 right-6 p-3 rounded-full bg-blue-900 hover:bg-blue-800 text-white shadow-lg transition-transform hover:scale-110 z-40 border border-blue-700"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}

export default function App() {
  return (
    <SchoolProvider>
      <AuthProvider>
        <MainApp />
      </AuthProvider>
    </SchoolProvider>
  );
}

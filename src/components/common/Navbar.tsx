import React, { useState, useEffect } from 'react';
import { Phone, Mail, MapPin, Lock, Menu, X, ChevronRight, GraduationCap } from 'lucide-react';
import { useSchool } from '../../context/SchoolContext';
import { useAuth } from '../../context/AuthContext';
import { PWAInstallButton } from './PWAInstallButton';

interface NavbarProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
}

export const navItems = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'academics', label: 'Academics' },
  { id: 'faculty', label: 'Faculty' },
  { id: 'admissions', label: 'Admissions' },
  { id: 'notices', label: 'Notice Board' },
  { id: 'events', label: 'Events' },
  { id: 'results', label: 'Results' },
  { id: 'gallery', label: 'Gallery' },
  { id: 'downloads', label: 'Downloads' },
  { id: 'contact', label: 'Contact' },
];

export const Navbar: React.FC<NavbarProps> = ({ currentPage, setCurrentPage }) => {
  const { settings } = useSchool();
  const { isAuthenticated } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (pageId: string) => {
    setCurrentPage(pageId);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="w-full z-40 relative">
      {/* Top Header Contact Bar */}
      <div className="bg-slate-900 text-slate-300 text-xs border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex flex-col md:flex-row items-center justify-between gap-2">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
            <a
              href={`tel:${settings.phone.replace(/[^0-9+]/g, '')}`}
              className="flex items-center gap-1.5 hover:text-amber-400 transition-colors"
              title="Call College Office"
            >
              <Phone className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>{settings.phone}</span>
            </a>
            <span className="hidden sm:inline text-slate-700">|</span>
            <a
              href={`mailto:${settings.email}`}
              className="flex items-center gap-1.5 hover:text-amber-400 transition-colors"
              title="Email College Office"
            >
              <Mail className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>{settings.email}</span>
            </a>
            <span className="hidden lg:inline text-slate-700">|</span>
            <span className="hidden lg:flex items-center gap-1.5 text-slate-400">
              <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>Hasanpur Road, Bhartal, Sirsi, District Sambhal, UP</span>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <PWAInstallButton />
            <button
              onClick={() => handleNavClick('admin')}
              id="btn-admin-access"
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                currentPage.startsWith('admin')
                  ? 'bg-amber-400 text-slate-950 font-semibold'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
              }`}
            >
              <Lock className="w-3 h-3 text-amber-400" />
              <span>{isAuthenticated ? 'Admin Portal' : 'Admin Login'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Sticky Navbar */}
      <nav
        className={`sticky top-0 w-full transition-all duration-200 z-30 bg-white border-b ${
          scrolled ? 'shadow-md border-slate-200' : 'border-slate-100'
        }`}
        aria-label="Main Navigation"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo & College Brand */}
            <button
              onClick={() => handleNavClick('home')}
              className="flex items-center gap-3 text-left group focus:outline-hidden"
              id="brand-logo"
            >
              <div className="w-12 h-12 rounded-xl bg-blue-950 border border-blue-900 flex items-center justify-center p-1 text-amber-400 shadow-sm shrink-0">
                <img
                  src="/icon.svg"
                  alt="Bhartal Inter College Crest"
                  className="w-full h-full object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-lg md:text-xl font-extrabold tracking-tight text-blue-950 uppercase leading-none font-serif">
                  {settings.school_name}
                </span>
                <span className="text-[11px] font-medium text-slate-500 mt-1 leading-tight flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 inline-block"></span>
                  Hasanpur Road, Bhartal, Sirsi (Sambhal, U.P.)
                </span>
              </div>
            </button>

            {/* Desktop Navigation Links */}
            <div className="hidden xl:flex items-center gap-1">
              {navItems.map(item => {
                const isActive = currentPage === item.id;
                return (
                  <button
                    key={item.id}
                    id={`nav-link-${item.id}`}
                    onClick={() => handleNavClick(item.id)}
                    className={`px-3 py-2 rounded-md text-xs font-semibold tracking-wide transition-all ${
                      isActive
                        ? 'bg-blue-900 text-white shadow-xs'
                        : 'text-slate-700 hover:text-blue-900 hover:bg-slate-100'
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>

            {/* Right Action: Admission Enquiry CTA & Mobile Hamburger */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleNavClick('admissions')}
                id="btn-nav-admissions"
                className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-lg bg-amber-500 hover:bg-amber-600 text-blue-950 transition-colors shadow-xs"
              >
                <GraduationCap className="w-4 h-4" />
                <span>Admissions</span>
              </button>

              {/* Mobile menu toggle button */}
              <button
                type="button"
                id="btn-mobile-menu-toggle"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="xl:hidden p-2 rounded-lg text-slate-700 hover:text-blue-900 hover:bg-slate-100 focus:outline-hidden focus:ring-2 focus:ring-blue-900"
                aria-expanded={mobileMenuOpen}
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div
            id="mobile-navigation-menu"
            className="xl:hidden bg-white border-b border-slate-200 shadow-xl transition-all"
          >
            <div className="px-4 pt-3 pb-6 space-y-1 max-h-[80vh] overflow-y-auto">
              <div className="p-3 mb-2 bg-slate-50 rounded-lg border border-slate-200">
                <p className="text-xs font-bold text-blue-950 uppercase">{settings.school_name}</p>
                <p className="text-[11px] text-slate-500">Official Web Portal • Sambhal, U.P.</p>
              </div>

              {navItems.map(item => {
                const isActive = currentPage === item.id;
                return (
                  <button
                    key={item.id}
                    id={`mobile-nav-link-${item.id}`}
                    onClick={() => handleNavClick(item.id)}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                      isActive
                        ? 'bg-blue-900 text-white'
                        : 'text-slate-800 hover:bg-slate-100 hover:text-blue-900'
                    }`}
                  >
                    <span>{item.label}</span>
                    <ChevronRight className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  </button>
                );
              })}

              <div className="pt-3 mt-3 border-t border-slate-200 space-y-2">
                <button
                  onClick={() => handleNavClick('admissions')}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-amber-500 hover:bg-amber-600 text-blue-950 font-bold text-sm"
                >
                  <GraduationCap className="w-4 h-4" />
                  <span>Admission Enquiry</span>
                </button>
                <button
                  onClick={() => handleNavClick('admin')}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-medium text-sm"
                >
                  <Lock className="w-4 h-4 text-amber-400" />
                  <span>Admin Panel</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

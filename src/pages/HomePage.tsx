import React, { useState, useEffect } from 'react';
import {
  GraduationCap,
  Bell,
  Calendar,
  Award,
  Download,
  Phone,
  Mail,
  MapPin,
  ChevronRight,
  BookOpen,
  Users,
  CheckCircle2,
  Clock,
  ArrowRight,
  Sparkles,
  School,
  ExternalLink,
  Eye,
  FileText
} from 'lucide-react';
import { useSchool } from '../context/SchoolContext';
import { api } from '../services/api';
import type { Notice, EventItem, GalleryImage } from '../types';

interface HomePageProps {
  setCurrentPage: (page: string) => void;
  setSelectedNotice?: (notice: Notice) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ setCurrentPage }) => {
  const { settings } = useSchool();
  const [latestNotices, setLatestNotices] = useState<Notice[]>([]);
  const [latestEvents, setLatestEvents] = useState<EventItem[]>([]);
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeNoticeModal, setActiveNoticeModal] = useState<Notice | null>(null);

  useEffect(() => {
    async function loadHomeData() {
      try {
        const [noticesRes, eventsRes, galleryRes] = await Promise.all([
          api.notices.getAll({ limit: 4 }),
          api.events.getAll({ limit: 3 }),
          api.gallery.getAll({}),
        ]);
        setLatestNotices(noticesRes.notices || []);
        setLatestEvents(eventsRes.events || []);
        setGalleryImages((galleryRes.images || []).slice(0, 6));
      } catch (err) {
        console.warn('Error loading homepage feed:', err);
      } finally {
        setLoading(false);
      }
    }
    loadHomeData();
  }, []);

  const navigateTo = (page: string) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="space-y-16 pb-16">
      {/* 1. HERO SECTION */}
      <section className="relative bg-gradient-to-b from-blue-950 via-slate-900 to-slate-950 text-white overflow-hidden py-16 md:py-24 border-b border-blue-900/50">
        {/* Subtle geometric background elements */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fbbf24_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-900/70 border border-blue-700/60 text-amber-300 text-xs font-semibold">
                <School className="w-3.5 h-3.5" />
                <span>Official Institutional Portal • Sambhal, Uttar Pradesh</span>
              </div>

              <div className="space-y-3">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white uppercase font-serif leading-tight">
                  {settings.school_name}
                </h1>
                <p className="text-sm sm:text-base text-amber-300 font-medium flex items-center justify-center lg:justify-start gap-1.5">
                  <MapPin className="w-4 h-4 shrink-0 text-amber-400" />
                  <span>{settings.address}</span>
                </p>
              </div>

              <p className="text-slate-300 text-sm sm:text-base max-w-2xl leading-relaxed">
                Welcome to Bhartal Inter College. Committed to fostering academic competence, personal discipline,
                and ethical values to empower our students for a brighter future.
              </p>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-3">
                <button
                  onClick={() => navigateTo('about')}
                  id="hero-btn-about"
                  className="px-5 py-3 rounded-lg bg-blue-800 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm transition shadow-sm flex items-center gap-2"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>About Our College</span>
                </button>

                <button
                  onClick={() => navigateTo('admissions')}
                  id="hero-btn-admissions"
                  className="px-5 py-3 rounded-lg bg-amber-500 hover:bg-amber-600 text-blue-950 font-bold text-xs sm:text-sm transition shadow-sm flex items-center gap-2"
                >
                  <GraduationCap className="w-4 h-4" />
                  <span>Admission Enquiry</span>
                </button>

                <button
                  onClick={() => navigateTo('notices')}
                  id="hero-btn-notices"
                  className="px-5 py-3 rounded-lg bg-slate-800/90 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs sm:text-sm transition flex items-center gap-2"
                >
                  <Bell className="w-4 h-4 text-amber-400" />
                  <span>Latest Notices</span>
                </button>
              </div>
            </div>

            {/* Right Card: College Campus Preview */}
            <div className="lg:col-span-5">
              <div className="relative rounded-2xl overflow-hidden border border-blue-800/60 bg-slate-900 shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&q=80&w=800"
                  alt="Bhartal Inter College Building Campus"
                  className="w-full h-64 sm:h-72 object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="p-5 bg-slate-900/95 border-t border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-amber-400 uppercase tracking-wide">Campus Overview</span>
                    <span className="text-slate-400 text-[11px] bg-slate-800 px-2 py-0.5 rounded">Hasanpur Road</span>
                  </div>
                  <p className="text-xs text-slate-300">
                    Spacious campus environment dedicated to disciplined learning and student growth.
                  </p>
                  <div className="pt-2 flex items-center gap-4 text-xs text-slate-400">
                    <span className="flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5 text-amber-400" /> {settings.phone}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-amber-400" /> 8:00 AM - 2:00 PM
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. QUICK INFORMATION CARDS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        <h2 className="sr-only">Quick Access Sections</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {[
            { id: 'admissions', label: 'Admissions', icon: GraduationCap, color: 'text-amber-500', bg: 'hover:border-amber-400' },
            { id: 'notices', label: 'Notice Board', icon: Bell, color: 'text-blue-600', bg: 'hover:border-blue-400' },
            { id: 'events', label: 'Events & News', icon: Calendar, color: 'text-emerald-600', bg: 'hover:border-emerald-400' },
            { id: 'results', label: 'Results', icon: Award, color: 'text-purple-600', bg: 'hover:border-purple-400' },
            { id: 'downloads', label: 'Downloads', icon: Download, color: 'text-rose-600', bg: 'hover:border-rose-400' },
            { id: 'contact', label: 'Contact Us', icon: Phone, color: 'text-cyan-600', bg: 'hover:border-cyan-400' },
          ].map(card => {
            const Icon = card.icon;
            return (
              <button
                key={card.id}
                id={`quick-info-${card.id}`}
                onClick={() => navigateTo(card.id)}
                className={`bg-white rounded-xl p-4 shadow-sm border border-slate-200 transition-all text-center flex flex-col items-center justify-center gap-2.5 group ${card.bg}`}
              >
                <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Icon className={`w-5 h-5 ${card.color}`} />
                </div>
                <span className="text-xs font-bold text-slate-800 tracking-tight">{card.label}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* 3. WELCOME & ABOUT INTRODUCTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl p-6 sm:p-10 border border-slate-200 shadow-xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-900 uppercase tracking-wider">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Introduction</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 font-serif">
                Welcome to Bhartal Inter College
              </h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                {settings.homepage_intro}
              </p>
              <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-700">
                <div className="flex items-start gap-2 bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Disciplined learning environment with personalized student attention</span>
                </div>
                <div className="flex items-start gap-2 bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Structured curriculum aligned with standard secondary education</span>
                </div>
              </div>
              <div className="pt-2">
                <button
                  onClick={() => navigateTo('about')}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-900 hover:text-blue-700"
                >
                  <span>Learn more about our institution</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="lg:col-span-4 bg-slate-50 p-6 rounded-xl border border-slate-200 space-y-3">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide border-b border-slate-200 pb-2">
                College Highlights
              </h3>
              <ul className="space-y-2.5 text-xs text-slate-600">
                <li className="flex items-center justify-between">
                  <span className="font-medium text-slate-800">Location:</span>
                  <span>Sirsi, Sambhal, UP</span>
                </li>
                <li className="flex items-center justify-between">
                  <span className="font-medium text-slate-800">Phone:</span>
                  <span>{settings.phone}</span>
                </li>
                <li className="flex items-center justify-between">
                  <span className="font-medium text-slate-800">Email:</span>
                  <span className="truncate max-w-[150px]">{settings.email}</span>
                </li>
                <li className="flex items-center justify-between">
                  <span className="font-medium text-slate-800">Timings:</span>
                  <span>{settings.office_hours?.timings || '8:00 AM - 2:00 PM'}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 4. STATISTICS SECTION (Configurable with Demo labels) */}
      <section className="bg-slate-900 text-white py-12 border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <h2 className="text-xs font-bold uppercase tracking-widest text-amber-400">Institutional Strength</h2>
            <p className="text-xl font-bold text-white mt-1 font-serif">College at a Glance</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {settings.statistics?.map(stat => (
              <div key={stat.id} className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-1">
                <div className="text-2xl sm:text-3xl font-extrabold text-amber-400 font-serif">
                  {stat.value}
                </div>
                <div className="text-xs font-medium text-slate-300">{stat.label}</div>
                {stat.isDemo && (
                  <span className="inline-block text-[10px] text-slate-400 bg-slate-900/80 px-1.5 py-0.5 rounded font-mono">
                    Demo Value
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. PRINCIPAL MESSAGE SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="grid grid-cols-1 md:grid-cols-12">
            <div className="md:col-span-4 bg-slate-100 flex flex-col items-center justify-center p-8 text-center border-b md:border-b-0 md:border-r border-slate-200">
              <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-full overflow-hidden border-4 border-white shadow-md mb-4 bg-slate-200">
                <img
                  src={settings.principal_photo || 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=600'}
                  alt={settings.principal_name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <h3 className="text-base font-bold text-slate-900">{settings.principal_name}</h3>
              <p className="text-xs font-medium text-blue-900 mt-0.5">{settings.principal_designation}</p>
              <span className="mt-2 text-[10px] font-mono text-slate-400 bg-slate-200 px-2 py-0.5 rounded">
                Configurable via Admin
              </span>
            </div>

            <div className="md:col-span-8 p-6 sm:p-10 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-900 uppercase tracking-wider">
                  <span>Leadership Message</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-serif">
                  Message from the Principal
                </h2>
                <div className="text-slate-600 text-sm leading-relaxed italic border-l-2 border-amber-500 pl-4 py-1">
                  "{settings.principal_message}"
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between flex-wrap gap-2">
                <button
                  onClick={() => navigateTo('principal-message')}
                  className="text-xs font-bold text-blue-900 hover:text-blue-700 flex items-center gap-1.5"
                >
                  <span>Read Full Principal's Address</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
                <span className="text-xs text-slate-400">Bhartal Inter College, Sambhal</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. WHY CHOOSE US */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-blue-900">Institutional Values</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 font-serif">Why Choose Bhartal Inter College</h2>
          <p className="text-xs sm:text-sm text-slate-600">
            Dedicated to providing students with strong academic foundations and ethical growth.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              title: 'Quality Education',
              desc: 'Rigorous academic guidance focused on conceptual understanding, syllabus coverage, and regular evaluations.',
              icon: BookOpen,
            },
            {
              title: 'Experienced Faculty',
              desc: 'Dedicated subject lecturers and teachers providing attentive instruction and mentoring for every learner.',
              icon: Users,
            },
            {
              title: 'Student Development',
              desc: 'Holistic emphasis on building character, confidence, civic responsibility, and communicative skills.',
              icon: Award,
            },
            {
              title: 'Academic Environment',
              desc: 'Peaceful, disciplined, and supportive campus atmosphere centered strictly on educational achievements.',
              icon: School,
            },
            {
              title: 'Discipline & Values',
              desc: 'Instilling daily punctuality, mutual respect, ethical conduct, and respect for our cultural heritage.',
              icon: CheckCircle2,
            },
            {
              title: 'Co-curricular Activities',
              desc: 'Opportunities for sports, cultural celebrations, debates, and annual exhibitions for balanced growth.',
              icon: Sparkles,
            },
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-3">
                <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-900 flex items-center justify-center">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900">{item.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 7. FACILITIES (Configurable cards) */}
      <section className="bg-slate-100 py-14 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-900">Infrastructure</span>
              <h2 className="text-2xl font-bold text-slate-900 font-serif mt-0.5">Campus Facilities</h2>
            </div>
            <span className="text-xs text-slate-500 bg-white px-3 py-1 rounded-full border border-slate-200">
              Only verified & enabled facilities are displayed
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {settings.facilities
              ?.filter(f => f.enabled !== false)
              .map(facility => (
                <div key={facility.id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-slate-900">{facility.title}</h3>
                    {facility.isDemo && (
                      <span className="text-[10px] text-amber-600 bg-amber-50 px-2 py-0.5 rounded font-mono">
                        Demo
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{facility.description}</p>
                </div>
              ))}
          </div>
        </div>
      </section>

      {/* 8. LATEST NOTICES & EVENTS (Side by Side) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Latest Notices (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-blue-900" />
                <h2 className="text-lg font-bold text-slate-900 font-serif">Latest Notices</h2>
              </div>
              <button
                onClick={() => navigateTo('notices')}
                className="text-xs font-bold text-blue-900 hover:text-blue-700 flex items-center gap-1"
              >
                <span>View All Notices</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {loading ? (
              <div className="p-8 text-center text-xs text-slate-500">Loading notices...</div>
            ) : latestNotices.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500 bg-white rounded-xl border border-slate-200">
                No notices published at this moment.
              </div>
            ) : (
              <div className="space-y-3">
                {latestNotices.map(notice => (
                  <div
                    key={notice.id}
                    className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:border-blue-300 transition-colors space-y-2"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-blue-900 bg-blue-50 px-2.5 py-0.5 rounded">
                        {notice.category || 'General'}
                      </span>
                      <span className="text-slate-500 text-[11px]">{notice.date}</span>
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 hover:text-blue-900 cursor-pointer" onClick={() => setActiveNoticeModal(notice)}>
                      {notice.title}
                    </h3>
                    <p className="text-xs text-slate-600 line-clamp-2">{notice.description}</p>
                    <div className="pt-2 flex items-center justify-between text-xs">
                      <button
                        onClick={() => setActiveNoticeModal(notice)}
                        className="font-semibold text-blue-900 hover:text-blue-700 flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Read Notice</span>
                      </button>
                      {notice.pdf_url && (
                        <a
                          href={notice.pdf_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>Attachment (PDF)</span>
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Latest Events (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-amber-600" />
                <h2 className="text-lg font-bold text-slate-900 font-serif">Recent & Upcoming Events</h2>
              </div>
              <button
                onClick={() => navigateTo('events')}
                className="text-xs font-bold text-blue-900 hover:text-blue-700 flex items-center gap-1"
              >
                <span>View All</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {loading ? (
              <div className="p-8 text-center text-xs text-slate-500">Loading events...</div>
            ) : latestEvents.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500 bg-white rounded-xl border border-slate-200">
                No events currently scheduled.
              </div>
            ) : (
              <div className="space-y-3">
                {latestEvents.map(event => (
                  <div
                    key={event.id}
                    className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex gap-3.5 items-start hover:border-amber-300 transition-colors"
                  >
                    <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0 bg-slate-100">
                      <img
                        src={event.image_url || 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&q=80&w=400'}
                        alt={event.title}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center gap-2 text-[11px] text-slate-500">
                        <span className="font-semibold text-amber-700">{event.date}</span>
                        {event.time && <span>• {event.time}</span>}
                      </div>
                      <h3 className="text-xs sm:text-sm font-bold text-slate-900 truncate">{event.title}</h3>
                      <p className="text-[11px] text-slate-600 line-clamp-1">{event.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 9. GALLERY PREVIEW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-900">Campus Visuals</span>
            <h2 className="text-xl font-bold text-slate-900 font-serif">Photo Gallery Preview</h2>
          </div>
          <button
            onClick={() => navigateTo('gallery')}
            className="text-xs font-bold text-blue-900 hover:text-blue-700 flex items-center gap-1"
          >
            <span>View Full Gallery</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {galleryImages.map((img, i) => (
            <div
              key={img.id || i}
              onClick={() => navigateTo('gallery')}
              className="group relative rounded-xl overflow-hidden aspect-square bg-slate-100 cursor-pointer shadow-xs border border-slate-200"
            >
              <img
                src={img.image_url}
                alt={img.caption || 'Bhartal Inter College'}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent opacity-0 group-hover:opacity-100 transition-opacity p-2.5 flex items-end">
                <span className="text-[11px] font-medium text-white line-clamp-1">{img.caption || 'Campus View'}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 10. FINAL CONTACT CALL-TO-ACTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-blue-950 rounded-2xl p-8 sm:p-12 text-white border border-blue-900 shadow-lg">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-3 text-center lg:text-left">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                Admissions & General Enquiries
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-white font-serif">
                Have a Question? Contact Bhartal Inter College.
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
                Our administration desk is ready to assist prospective students, parents, and visitors with all necessary
                guidance, admission eligibility, and campus details.
              </p>

              <div className="pt-3 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-slate-200">
                <a
                  href={`tel:${settings.phone.replace(/[^0-9+]/g, '')}`}
                  className="flex items-center gap-2 hover:text-amber-400 font-semibold"
                >
                  <Phone className="w-4 h-4 text-amber-400" />
                  <span>{settings.phone}</span>
                </a>
                <a href={`mailto:${settings.email}`} className="flex items-center gap-2 hover:text-amber-400 font-semibold">
                  <Mail className="w-4 h-4 text-amber-400" />
                  <span>{settings.email}</span>
                </a>
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3 justify-center">
              <button
                onClick={() => navigateTo('admissions')}
                id="cta-btn-admission-enquiry"
                className="w-full py-3 px-5 rounded-lg bg-amber-500 hover:bg-amber-600 text-blue-950 font-bold text-sm transition shadow-sm text-center"
              >
                Apply for Admission
              </button>
              <button
                onClick={() => navigateTo('contact')}
                id="cta-btn-contact"
                className="w-full py-3 px-5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-semibold text-sm transition border border-slate-700 text-center"
              >
                Get Directions & Map
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Notice Detail Modal */}
      {activeNoticeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="text-xs font-bold text-blue-900 bg-blue-50 px-2.5 py-0.5 rounded">
                {activeNoticeModal.category}
              </span>
              <span className="text-xs text-slate-500">{activeNoticeModal.date}</span>
            </div>

            <div>
              <h3 className="text-lg font-bold text-slate-900 font-serif">{activeNoticeModal.title}</h3>
              <p className="mt-3 text-sm text-slate-600 whitespace-pre-line leading-relaxed">
                {activeNoticeModal.description}
              </p>
            </div>

            {activeNoticeModal.pdf_url && (
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
                <span className="text-xs font-medium text-slate-700">Official Document</span>
                <a
                  href={activeNoticeModal.pdf_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-900 hover:underline"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Attachment</span>
                </a>
              </div>
            )}

            <button
              onClick={() => setActiveNoticeModal(null)}
              className="w-full py-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs transition"
            >
              Close Notice
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

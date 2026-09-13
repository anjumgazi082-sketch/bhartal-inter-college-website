import React from 'react';
import { Phone, Mail, MapPin, Clock, ShieldCheck, ChevronRight, Lock } from 'lucide-react';
import { useSchool } from '../../context/SchoolContext';

interface FooterProps {
  setCurrentPage: (page: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ setCurrentPage }) => {
  const { settings } = useSchool();

  const handleLink = (page: string) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-800" aria-label="Footer">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Column 1: School Identity */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-blue-900 border border-blue-800 flex items-center justify-center p-1 text-amber-400 shadow-sm shrink-0">
                <img
                  src="/icon.svg"
                  alt="Bhartal Inter College Crest"
                  className="w-full h-full object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white uppercase tracking-tight font-serif">
                  {settings.school_name}
                </h3>
                <p className="text-xs text-amber-400 font-medium">Sambhal, Uttar Pradesh</p>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Official institutional portal of Bhartal Inter College. Committed to delivering disciplined,
              value-oriented education, fostering character and academic excellence for students.
            </p>

            <div className="pt-2 text-xs text-slate-400 space-y-1">
              <p className="flex items-center gap-1.5 text-slate-300">
                <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>Office: {settings.office_hours?.timings || '08:00 AM - 02:00 PM'}</span>
              </p>
              <p className="text-[11px] text-slate-500 pl-5">
                {settings.office_hours?.days || 'Monday to Saturday'} (Closed Sundays & Gazetted Holidays)
              </p>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 pb-2 border-b border-slate-800">
              Navigation
            </h4>
            <ul className="space-y-2 text-xs">
              {[
                { id: 'about', label: 'About College' },
                { id: 'academics', label: 'Academic Curriculum' },
                { id: 'faculty', label: 'Faculty & Staff' },
                { id: 'admissions', label: 'Admissions & Enquiry' },
                { id: 'notices', label: 'Official Notice Board' },
                { id: 'events', label: 'Events & Functions' },
                { id: 'results', label: 'Examination Results' },
                { id: 'gallery', label: 'Photo Gallery' },
                { id: 'downloads', label: 'Documents & Downloads' },
                { id: 'contact', label: 'Contact Us' },
              ].map(link => (
                <li key={link.id}>
                  <button
                    onClick={() => handleLink(link.id)}
                    className="flex items-center gap-1.5 text-slate-400 hover:text-amber-400 transition-colors"
                  >
                    <ChevronRight className="w-3 h-3 text-slate-600" />
                    <span>{link.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Admissions & Information */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 pb-2 border-b border-slate-800">
              Admissions
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Admission enquiries for upcoming sessions are accepted online and offline at the college campus.
            </p>

            <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-lg space-y-2">
              <span className="text-[11px] font-semibold text-amber-400 uppercase tracking-wider block">
                Admission Desk
              </span>
              <p className="text-xs text-slate-300">
                Submit an online enquiry form or visit the college administrative office during working hours.
              </p>
              <button
                onClick={() => handleLink('admissions')}
                className="w-full mt-2 py-2 px-3 rounded text-xs font-bold bg-blue-900 hover:bg-blue-800 text-white transition-colors flex items-center justify-center gap-1.5"
              >
                <span>Enquire Online</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Column 4: Official Contact Information */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 pb-2 border-b border-slate-800">
              Official Contact
            </h4>
            <div className="space-y-2.5 text-xs text-slate-300">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>{settings.address}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <a
                  href={`tel:${settings.phone.replace(/[^0-9+]/g, '')}`}
                  className="hover:text-amber-400 transition-colors"
                >
                  {settings.phone}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <a href={`mailto:${settings.email}`} className="hover:text-amber-400 transition-colors break-all">
                  {settings.email}
                </a>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
              <button
                onClick={() => handleLink('admin')}
                id="btn-footer-admin"
                className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-amber-400 transition-colors"
              >
                <Lock className="w-3.5 h-3.5 text-slate-500" />
                <span>Admin Login</span>
              </button>
              <span className="text-[11px] text-emerald-400 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Verified
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Legal */}
        <div className="mt-12 pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© {currentYear} {settings.school_name}. All Rights Reserved.</p>
          <div className="flex items-center gap-4 text-xs">
            <button onClick={() => handleLink('privacy-policy')} className="hover:text-amber-400 transition-colors">
              Privacy Policy
            </button>
            <span>•</span>
            <button onClick={() => handleLink('terms')} className="hover:text-amber-400 transition-colors">
              Terms of Use
            </button>
            <span>•</span>
            <button onClick={() => handleLink('contact')} className="hover:text-amber-400 transition-colors">
              Feedback & Contact
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

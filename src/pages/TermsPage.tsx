import React from 'react';
import { BookOpen } from 'lucide-react';
import { useSchool } from '../context/SchoolContext';

export const TermsPage: React.FC = () => {
  const { settings } = useSchool();

  return (
    <div className="space-y-12 pb-16">
      <section className="bg-gradient-to-r from-blue-950 via-slate-900 to-blue-950 text-white py-14 border-b border-blue-900/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-2">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-widest">
            <BookOpen className="w-4 h-4" />
            <span>Institutional Policies</span>
          </div>
          <h1 className="text-3xl font-extrabold font-serif">Terms & Conditions of Use</h1>
          <p className="text-xs text-slate-300">Last updated: Academic Year {new Date().getFullYear()}</p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6 text-xs sm:text-sm text-slate-700 leading-relaxed">
          <h2 className="text-base font-bold text-slate-900 font-serif">1. Website Access</h2>
          <p>
            Welcome to the official institutional web portal of {settings.school_name}. By accessing and browsing this website,
            you agree to comply with and be bound by these terms of use.
          </p>

          <h2 className="text-base font-bold text-slate-900 font-serif">2. Official Communications & Notices</h2>
          <p>
            Official notices, results, examination timetables, and circulars published on this portal are for informational purposes.
            While every effort is made to maintain accuracy, physical notices and circulars signed by the Principal and displayed on the college campus notice board shall be authoritative.
          </p>

          <h2 className="text-base font-bold text-slate-900 font-serif">3. Admissions & Enquiries</h2>
          <p>
            Submission of an admission enquiry form through this website does not automatically guarantee admission. Final admission is subject
            to document verification, eligibility clearance, seat availability, and formal registration as per institutional rules.
          </p>

          <h2 className="text-base font-bold text-slate-900 font-serif">4. Intellectual Property</h2>
          <p>
            The content, logo, graphics, design, compilation, and other matters related to this website are protected under applicable copyrights
            and institutional rights of {settings.school_name}.
          </p>

          <h2 className="text-base font-bold text-slate-900 font-serif">5. Contact Information</h2>
          <p>
            For questions regarding institutional regulations, please visit the college campus or contact:
            <br />
            <strong>{settings.school_name}</strong>
            <br />
            {settings.address}
            <br />
            Phone: {settings.phone} | Email: {settings.email}
          </p>
        </div>
      </section>
    </div>
  );
};

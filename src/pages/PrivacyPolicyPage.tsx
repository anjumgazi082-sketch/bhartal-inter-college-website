import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { useSchool } from '../context/SchoolContext';

export const PrivacyPolicyPage: React.FC = () => {
  const { settings } = useSchool();

  return (
    <div className="space-y-12 pb-16">
      <section className="bg-gradient-to-r from-blue-950 via-slate-900 to-blue-950 text-white py-14 border-b border-blue-900/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-2">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-widest">
            <ShieldCheck className="w-4 h-4" />
            <span>Legal & Privacy</span>
          </div>
          <h1 className="text-3xl font-extrabold font-serif">Privacy Policy</h1>
          <p className="text-xs text-slate-300">Last updated: Academic Year {new Date().getFullYear()}</p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6 text-xs sm:text-sm text-slate-700 leading-relaxed">
          <h2 className="text-base font-bold text-slate-900 font-serif">1. Introduction</h2>
          <p>
            This Privacy Policy sets out how {settings.school_name}, situated at {settings.address}, collects, uses, and
            protects any information you provide when using our official website.
          </p>

          <h2 className="text-base font-bold text-slate-900 font-serif">2. Information We Collect</h2>
          <p>We may collect the following information when you submit admission enquiries or contact forms:</p>
          <ul className="list-disc list-inside space-y-1 text-slate-600 pl-2">
            <li>Student and Parent/Guardian full names</li>
            <li>Contact telephone numbers and email addresses</li>
            <li>Residential village/city address</li>
            <li>Class applying for and academic notes</li>
          </ul>

          <h2 className="text-base font-bold text-slate-900 font-serif">3. How We Use the Information</h2>
          <p>
            Information collected via this portal is used strictly for internal institutional communication, admission counseling,
            processing official school circulars, and responding to parental enquiries. We do not sell, rent, or distribute personal data to third parties.
          </p>

          <h2 className="text-base font-bold text-slate-900 font-serif">4. Data Security</h2>
          <p>
            We implement suitable physical, electronic, and administrative procedures to safeguard and secure information collected online.
          </p>

          <h2 className="text-base font-bold text-slate-900 font-serif">5. Contacting the College</h2>
          <p>
            If you have questions regarding this Privacy Policy, please contact our administrative desk:
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

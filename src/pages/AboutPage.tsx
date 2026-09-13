import React from 'react';
import { School, Target, Eye, BookOpen, Compass, Award, ShieldCheck, MapPin, Phone, Mail, ArrowRight } from 'lucide-react';
import { useSchool } from '../context/SchoolContext';

interface AboutPageProps {
  setCurrentPage: (page: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ setCurrentPage }) => {
  const { settings } = useSchool();

  return (
    <div className="space-y-12 pb-16">
      {/* Page Header */}
      <section className="bg-gradient-to-r from-blue-950 via-slate-900 to-blue-950 text-white py-14 border-b border-blue-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-widest">
            <School className="w-4 h-4" />
            <span>Institutional Profile</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-serif uppercase tracking-tight">
            About Bhartal Inter College
          </h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl">
            Established with the goal of bringing disciplined, quality secondary and intermediate education to students
            of Bhartal, Sirsi, and the Sambhal district.
          </p>
        </div>
      </section>

      {/* Main Introduction */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 space-y-4">
            <span className="text-xs font-bold text-blue-900 uppercase tracking-wider">Our Foundation</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 font-serif">
              A Tradition of Learning and Character
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Bhartal Inter College stands as a respected educational institution situated on Hasanpur Road in Bhartal,
              near Sirsi in Sambhal District, Uttar Pradesh. The college serves as an educational center committed to
              academic excellence, moral ethics, and civic responsibility.
            </p>
            <p className="text-sm text-slate-600 leading-relaxed">
              We believe every young student possesses unique potential that flourishes when given proper guidance,
              structured learning, and a supportive campus culture. Our academic programs are designed to instill strong
              subject foundations, analytical thinking, and lifelong values.
            </p>

            <div className="pt-2">
              <button
                onClick={() => setCurrentPage('principal-message')}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-900 hover:bg-blue-800 text-white font-semibold text-xs transition"
              >
                <span>Read Principal's Message</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4 shadow-xs">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide border-b border-slate-200 pb-2">
                Official Institutional Info
              </h3>
              <div className="space-y-3 text-xs">
                <div className="flex items-start gap-2.5">
                  <School className="w-4 h-4 text-blue-900 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-slate-800 block">Institution Name</span>
                    <span className="text-slate-600">{settings.school_name}</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-blue-900 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-slate-800 block">Campus Address</span>
                    <span className="text-slate-600">{settings.address}</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <Phone className="w-4 h-4 text-blue-900 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-slate-800 block">Telephone</span>
                    <span className="text-slate-600">{settings.phone}</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <Mail className="w-4 h-4 text-blue-900 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-slate-800 block">Email Address</span>
                    <span className="text-slate-600 break-all">{settings.email}</span>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-amber-50 rounded-lg border border-amber-200/60 text-[11px] text-amber-900 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0" />
                <span>Contact details verified from official institutional records.</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="bg-slate-100 py-14 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Vision */}
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-900 flex items-center justify-center">
                <Eye className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 font-serif">Our Vision</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                {settings.vision}
              </p>
            </div>

            {/* Mission */}
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 font-serif">Our Mission</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                {settings.mission}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Objectives & Values */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-blue-900">Guiding Principles</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 font-serif">Institutional Objectives</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              title: 'Academic Discipline',
              desc: 'Emphasizing rigorous daily attendance, syllabus completion, and structured study routines.',
              icon: BookOpen,
            },
            {
              title: 'Moral Integrity',
              desc: 'Instilling honesty, cultural respect, civic consciousness, and mutual empathy.',
              icon: Compass,
            },
            {
              title: 'Personal Development',
              desc: 'Fostering confidence, public expression, and leadership qualities in every student.',
              icon: Award,
            },
            {
              title: 'Community Contribution',
              desc: 'Inspiring students to serve their local community, region, and nation selflessly.',
              icon: Target,
            },
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-2">
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
    </div>
  );
};

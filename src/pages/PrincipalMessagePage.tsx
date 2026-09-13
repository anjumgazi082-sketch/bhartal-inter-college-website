import React from 'react';
import { Quote, Phone, Mail, Award, ArrowLeft, ShieldCheck } from 'lucide-react';
import { useSchool } from '../context/SchoolContext';

interface PrincipalMessagePageProps {
  setCurrentPage: (page: string) => void;
}

export const PrincipalMessagePage: React.FC<PrincipalMessagePageProps> = ({ setCurrentPage }) => {
  const { settings } = useSchool();

  return (
    <div className="space-y-12 pb-16">
      {/* Header */}
      <section className="bg-gradient-to-r from-blue-950 via-slate-900 to-blue-950 text-white py-14 border-b border-blue-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3">
          <button
            onClick={() => setCurrentPage('about')}
            className="inline-flex items-center gap-1.5 text-xs text-amber-400 hover:underline mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to About</span>
          </button>
          <div className="inline-flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-widest block">
            <span>Leadership Message</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-serif uppercase tracking-tight">
            From the Principal's Desk
          </h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl">
            A welcoming message to all students, parents, and community members from Bhartal Inter College leadership.
          </p>
        </div>
      </section>

      {/* Message Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12">
            {/* Principal Photo & Details Card */}
            <div className="lg:col-span-4 bg-slate-50 p-8 border-b lg:border-b-0 lg:border-r border-slate-200 flex flex-col items-center text-center">
              <div className="w-48 h-48 sm:w-56 sm:h-56 rounded-2xl overflow-hidden border-4 border-white shadow-lg mb-6 bg-slate-200">
                <img
                  src={settings.principal_photo || 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=600'}
                  alt={settings.principal_name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>

              <h2 className="text-xl font-bold text-slate-900 font-serif">{settings.principal_name}</h2>
              <p className="text-xs font-semibold text-blue-900 mt-1">{settings.principal_designation}</p>
              <p className="text-xs text-slate-500 mt-0.5">{settings.school_name}</p>

              <div className="mt-4 pt-4 border-t border-slate-200 w-full space-y-2 text-xs text-slate-600">
                <p className="flex items-center justify-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-blue-900" />
                  <span>{settings.phone}</span>
                </p>
                <p className="flex items-center justify-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-blue-900" />
                  <span className="truncate max-w-[200px]">{settings.email}</span>
                </p>
              </div>

              <div className="mt-6 p-3 bg-blue-50/70 rounded-lg border border-blue-100 text-[11px] text-blue-950 text-left">
                <span className="font-semibold block mb-1">Administrative Note:</span>
                This photo and message can be updated anytime in real-time through the secure Admin Panel under School Settings.
              </div>
            </div>

            {/* Full Letter Content */}
            <div className="lg:col-span-8 p-8 sm:p-12 space-y-6">
              <div className="flex items-center gap-3 text-amber-600">
                <Quote className="w-8 h-8 opacity-60" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Official Communication
                </span>
              </div>

              <div className="prose prose-slate max-w-none text-sm leading-relaxed text-slate-700 space-y-4">
                <p className="text-base font-medium text-slate-900">
                  Dear Students, Parents, Guardians, and Well-Wishers,
                </p>

                <p>
                  It gives me immense pleasure to welcome you to the official portal of <strong>Bhartal Inter College</strong>,
                  situated at Hasanpur Road, Bhartal, near Sirsi in Sambhal District. Education is not merely the acquisition of facts,
                  but the training of the mind to think, discern right from wrong, and act with integrity.
                </p>

                <blockquote className="p-4 bg-slate-50 border-l-4 border-blue-900 rounded-r-lg italic text-slate-800 text-sm my-4">
                  "{settings.principal_message}"
                </blockquote>

                <p>
                  At Bhartal Inter College, we strive every day to provide our pupils with a well-rounded academic experience.
                  Our faculty members are chosen not only for their academic qualifications, but for their commitment to mentoring,
                  patience, and love for teaching. We believe that discipline is the bridge between goals and accomplishment.
                </p>

                <p>
                  We encourage our parents and guardians to partner closely with us. Your active engagement and encouragement at home,
                  combined with our structured instruction at college, will help our children achieve their aspirations.
                </p>

                <p>
                  I invite you to explore our college website, review our notices, examination results, and academic programs.
                  Our administrative doors are always open to parents seeking guidance or clarification.
                </p>

                <div className="pt-6 border-t border-slate-200">
                  <p className="font-serif font-bold text-slate-900 text-base">{settings.principal_name}</p>
                  <p className="text-xs text-slate-500">{settings.principal_designation}</p>
                  <p className="text-xs text-slate-500">Bhartal Inter College, Sambhal</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

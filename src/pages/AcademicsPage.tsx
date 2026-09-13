import React from 'react';
import { BookOpen, GraduationCap, Calendar, CheckSquare, Layers, Clock, AlertCircle } from 'lucide-react';

export const AcademicsPage: React.FC = () => {
  return (
    <div className="space-y-12 pb-16">
      {/* Header */}
      <section className="bg-gradient-to-r from-blue-950 via-slate-900 to-blue-950 text-white py-14 border-b border-blue-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-widest">
            <GraduationCap className="w-4 h-4" />
            <span>Curriculum & Studies</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-serif uppercase tracking-tight">
            Academics at Bhartal Inter College
          </h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl">
            A structured curriculum providing secondary and senior secondary education, emphasizing subject mastery,
            conceptual clarity, and continuous evaluation.
          </p>
        </div>
      </section>

      {/* Classes & Curriculum Offered */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-900">Academic Sections</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 font-serif">Courses & Streams Offered</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Secondary / High School */}
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center gap-3 border-b border-slate-200 pb-3">
              <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-900 flex items-center justify-center font-bold">
                HS
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">High School (Class 9 & 10)</h3>
                <p className="text-xs text-slate-500">Secondary Education Curriculum</p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Provides foundational education across languages, sciences, mathematics, and social studies, preparing
              students thoroughly for board-level standards and critical reasoning.
            </p>

            <div className="space-y-2 text-xs">
              <span className="font-semibold text-slate-800 block">Core Subjects:</span>
              <ul className="grid grid-cols-2 gap-2 text-slate-600 list-disc list-inside">
                <li>Hindi Language & Literature</li>
                <li>English Core</li>
                <li>Mathematics</li>
                <li>Science (Physics, Chem, Bio)</li>
                <li>Social Science</li>
                <li>Moral & Physical Education</li>
              </ul>
            </div>
          </div>

          {/* Senior Secondary / Intermediate */}
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center gap-3 border-b border-slate-200 pb-3">
              <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
                INT
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Intermediate (Class 11 & 12)</h3>
                <p className="text-xs text-slate-500">Senior Secondary Education Streams</p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Specialized academic training across distinct streams enabling learners to pursue higher collegiate degrees,
              competitive examinations, and professional careers.
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <span className="font-semibold text-slate-800 block">Available Academic Streams:</span>
                <div className="mt-2 space-y-2">
                  <div className="p-2.5 rounded bg-slate-50 border border-slate-200">
                    <span className="font-bold text-blue-900">Science Stream:</span>
                    <span className="text-slate-600 ml-1.5">Physics, Chemistry, Mathematics / Biology, English, Hindi</span>
                  </div>
                  <div className="p-2.5 rounded bg-slate-50 border border-slate-200">
                    <span className="font-bold text-blue-900">Arts / Humanities Stream:</span>
                    <span className="text-slate-600 ml-1.5">History, Political Science, Geography, Economics, Hindi, English</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Teaching Methodology & Examination System */}
      <section className="bg-slate-50 py-14 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 text-xs font-bold text-blue-900 uppercase tracking-wider">
                <Layers className="w-4 h-4" />
                <span>Pedagogy</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 font-serif">Teaching Methodology</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Our faculty utilizes structured lesson plans combining textbook discussions, board explanations, practical lab demonstrations,
                and regular classroom problem-solving sessions.
              </p>
              <ul className="space-y-2 text-xs text-slate-700">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-900" />
                  <span>Emphasis on fundamental concepts and clear analytical thinking</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-900" />
                  <span>Doubt-clearing sessions and homework follow-ups</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-900" />
                  <span>Special attention to students needing additional reinforcement</span>
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 text-xs font-bold text-amber-700 uppercase tracking-wider">
                <CheckSquare className="w-4 h-4" />
                <span>Assessment</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 font-serif">Continuous Evaluation System</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                To track continuous student progress, the college conducts periodic unit tests, quarterly assessments, half-yearly exams,
                and pre-board simulations.
              </p>
              <div className="p-4 rounded-xl bg-white border border-slate-200 text-xs text-slate-700 space-y-2">
                <div className="flex items-center justify-between pb-1 border-b border-slate-100 font-semibold text-slate-800">
                  <span>Periodic Evaluation Schedule</span>
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                </div>
                <p>• Quarterly Examination: August - September</p>
                <p>• Half-Yearly Examination: November - December</p>
                <p>• Pre-Board / Annual Examination: February - March</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Attendance & Discipline Guidelines */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-6 sm:p-8 space-y-3">
          <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
            <AlertCircle className="w-5 h-5 text-amber-700" />
            <span>Attendance & Academic Discipline Code</span>
          </div>
          <p className="text-xs sm:text-sm text-amber-950/80 leading-relaxed">
            Students are required to maintain a minimum of 75% attendance during the academic year to be eligible to appear for
            annual and board examinations. Regular punctuality in official college uniform and respectful conduct on campus are strictly required.
          </p>
        </div>
      </section>
    </div>
  );
};

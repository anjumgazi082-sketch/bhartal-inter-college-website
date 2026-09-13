import React, { useState, useEffect } from 'react';
import { Users, Search, GraduationCap, BookOpen, Mail, Phone, ShieldCheck } from 'lucide-react';
import { api } from '../services/api';
import type { Teacher } from '../types';

export const FacultyPage: React.FC = () => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('All');

  useEffect(() => {
    async function loadTeachers() {
      try {
        const res = await api.teachers.getAll();
        setTeachers(res.teachers || []);
      } catch (err) {
        console.error('Error loading teachers:', err);
      } finally {
        setLoading(false);
      }
    }
    loadTeachers();
  }, []);

  const subjects = ['All', ...new Set(teachers.map(t => t.subject).filter(Boolean))];

  const filteredTeachers = teachers.filter(teacher => {
    const matchesSearch =
      teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.designation.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject = selectedSubject === 'All' || teacher.subject === selectedSubject;
    return matchesSearch && matchesSubject;
  });

  return (
    <div className="space-y-12 pb-16">
      {/* Header */}
      <section className="bg-gradient-to-r from-blue-950 via-slate-900 to-blue-950 text-white py-14 border-b border-blue-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-widest">
            <Users className="w-4 h-4" />
            <span>Academic Staff</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-serif uppercase tracking-tight">
            Our Faculty & Teachers
          </h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl">
            Meet the qualified and experienced educators guiding students with dedication, expertise, and moral values at Bhartal Inter College.
          </p>
        </div>
      </section>

      {/* Filter & Search Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Search */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search faculty by name or subject..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-900"
            />
          </div>

          {/* Subject Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
            <span className="text-xs font-semibold text-slate-500 mr-1 shrink-0">Subject:</span>
            {subjects.map(subj => (
              <button
                key={subj}
                onClick={() => setSelectedSubject(subj)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                  selectedSubject === subj
                    ? 'bg-blue-900 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {subj}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Teachers Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {loading ? (
          <div className="p-12 text-center text-xs text-slate-500">Loading faculty members...</div>
        ) : filteredTeachers.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-500 bg-white rounded-xl border border-slate-200">
            No faculty members matched your criteria.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredTeachers.map(teacher => (
              <div
                key={teacher.id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div>
                  <div className="aspect-square bg-slate-100 relative overflow-hidden">
                    <img
                      src={
                        teacher.photo_url ||
                        'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400'
                      }
                      alt={teacher.name}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-3 right-3 bg-blue-950/80 backdrop-blur-xs text-amber-300 px-2 py-0.5 rounded text-[10px] font-semibold">
                      {teacher.subject}
                    </div>
                  </div>

                  <div className="p-5 space-y-2">
                    <h3 className="text-base font-bold text-slate-900 leading-tight">{teacher.name}</h3>
                    <p className="text-xs font-semibold text-blue-900">{teacher.designation}</p>

                    {teacher.qualification && (
                      <div className="flex items-center gap-1.5 text-xs text-slate-500">
                        <GraduationCap className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{teacher.qualification}</span>
                      </div>
                    )}

                    {teacher.bio && (
                      <p className="text-xs text-slate-600 line-clamp-3 pt-1 border-t border-slate-100 leading-relaxed">
                        {teacher.bio}
                      </p>
                    )}
                  </div>
                </div>

                <div className="p-4 bg-slate-50 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between">
                  <span>Bhartal Inter College</span>
                  <span className="text-emerald-700 flex items-center gap-1 font-medium">
                    <ShieldCheck className="w-3 h-3" /> Active
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

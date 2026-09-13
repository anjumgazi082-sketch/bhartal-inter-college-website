import React, { useState, useEffect } from 'react';
import { Award, Search, Download, ExternalLink, Filter, Calendar, BookOpen, AlertCircle } from 'lucide-react';
import { api } from '../services/api';
import type { ResultItem } from '../types';

export const ResultsPage: React.FC = () => {
  const [results, setResults] = useState<ResultItem[]>([]);
  const [years, setYears] = useState<string[]>([]);
  const [classes, setClasses] = useState<string[]>([]);
  const [examinations, setExaminations] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedYear, setSelectedYear] = useState('All');
  const [selectedClass, setSelectedClass] = useState('All');
  const [selectedExam, setSelectedExam] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    async function loadResults() {
      try {
        const res = await api.results.getAll();
        setResults(res.results || []);
        setYears(['All', ...(res.years || [])]);
        setClasses(['All', ...(res.classes || [])]);
        setExaminations(['All', ...(res.examinations || [])]);
      } catch (err) {
        console.error('Failed to load results:', err);
      } finally {
        setLoading(false);
      }
    }
    loadResults();
  }, []);

  const filteredResults = results.filter(item => {
    const matchesYear = selectedYear === 'All' || item.academic_year === selectedYear;
    const matchesClass = selectedClass === 'All' || item.class_name === selectedClass;
    const matchesExam = selectedExam === 'All' || item.examination === selectedExam;
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesYear && matchesClass && matchesExam && matchesSearch;
  });

  return (
    <div className="space-y-12 pb-16">
      {/* Header */}
      <section className="bg-gradient-to-r from-blue-950 via-slate-900 to-blue-950 text-white py-14 border-b border-blue-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-widest">
            <Award className="w-4 h-4" />
            <span>Academic Performance</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-serif uppercase tracking-tight">
            Examination Results & Merit
          </h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl">
            Access term evaluation scorecards, merit lists, board examination outcomes, and official mark circulars.
          </p>
        </div>
      </section>

      {/* Filter Control Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search results by class or title..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-900"
              />
            </div>

            <span className="text-xs text-slate-500 font-medium self-end sm:self-center">
              Showing {filteredResults.length} publication{filteredResults.length === 1 ? '' : 's'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-100">
            {/* Academic Year */}
            <div>
              <label className="text-[11px] font-semibold text-slate-600 block mb-1">Academic Year</label>
              <select
                value={selectedYear}
                onChange={e => setSelectedYear(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-900"
              >
                {years.map(y => (
                  <option key={y} value={y}>
                    {y === 'All' ? 'All Academic Years' : y}
                  </option>
                ))}
              </select>
            </div>

            {/* Class */}
            <div>
              <label className="text-[11px] font-semibold text-slate-600 block mb-1">Class</label>
              <select
                value={selectedClass}
                onChange={e => setSelectedClass(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-900"
              >
                {classes.map(c => (
                  <option key={c} value={c}>
                    {c === 'All' ? 'All Classes' : c}
                  </option>
                ))}
              </select>
            </div>

            {/* Examination */}
            <div>
              <label className="text-[11px] font-semibold text-slate-600 block mb-1">Examination Term</label>
              <select
                value={selectedExam}
                onChange={e => setSelectedExam(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-900"
              >
                {examinations.map(e => (
                  <option key={e} value={e}>
                    {e === 'All' ? 'All Examinations' : e}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Results List */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {loading ? (
          <div className="p-12 text-center text-xs text-slate-500">Loading results...</div>
        ) : filteredResults.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-500 bg-white rounded-xl border border-slate-200 space-y-2">
            <Award className="w-8 h-8 text-slate-300 mx-auto" />
            <p className="font-semibold text-slate-700">No results found for selected filters</p>
            <p className="text-slate-400 text-[11px]">
              Try resetting the filters or searching for another term.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredResults.map(result => (
              <div
                key={result.id}
                className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:border-purple-300 transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-purple-900 bg-purple-50 px-2.5 py-0.5 rounded">
                      {result.class_name}
                    </span>
                    <span className="text-slate-500 font-medium">Session: {result.academic_year}</span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 font-serif leading-tight">
                    {result.title}
                  </h3>

                  <div className="flex items-center gap-2 text-xs text-amber-700 font-semibold">
                    <Award className="w-3.5 h-3.5" />
                    <span>{result.examination}</span>
                  </div>

                  {result.description && (
                    <p className="text-xs text-slate-600 leading-relaxed pt-1">
                      {result.description}
                    </p>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  {result.pdf_url ? (
                    <a
                      href={result.pdf_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 font-bold text-purple-900 hover:text-purple-700"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download Scorecard / PDF</span>
                    </a>
                  ) : (
                    <span className="text-slate-400 text-[11px]">Physical scorecard issued at campus</span>
                  )}

                  {result.external_url && (
                    <a
                      href={result.external_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-slate-600 hover:text-purple-900"
                    >
                      <span>Check Online</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

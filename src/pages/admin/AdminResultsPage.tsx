import React, { useState, useEffect } from 'react';
import { Award, Plus, Edit2, Trash2, Search, X, Download, ExternalLink, FileText } from 'lucide-react';
import { api } from '../../services/api';
import type { ResultItem } from '../../types';

export const AdminResultsPage: React.FC = () => {
  const [results, setResults] = useState<ResultItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState('all');
  const [selectedClass, setSelectedClass] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const [modalOpen, setModalOpen] = useState(false);
  const [editingResult, setEditingResult] = useState<ResultItem | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    academic_year: '2023-2024',
    class_name: 'Class 12 (Intermediate)',
    examination: 'UP Board Annual Examination',
    description: '',
    pdf_url: '',
    external_url: '',
    is_published: 1,
  });

  const loadResults = async () => {
    setLoading(true);
    try {
      const res = await api.results.getAll({ all: true });
      setResults(res.results || []);
    } catch (err) {
      console.error('Failed to load results:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadResults();
  }, []);

  const openCreateModal = () => {
    setEditingResult(null);
    setFormData({
      title: '',
      academic_year: '2023-2024',
      class_name: 'Class 12 (Intermediate)',
      examination: 'UP Board Annual Examination',
      description: '',
      pdf_url: '',
      external_url: '',
      is_published: 1,
    });
    setModalOpen(true);
  };

  const openEditModal = (item: ResultItem) => {
    setEditingResult(item);
    setFormData({
      title: item.title,
      academic_year: item.academic_year,
      class_name: item.class_name,
      examination: item.examination,
      description: item.description || '',
      pdf_url: item.pdf_url || '',
      external_url: item.external_url || '',
      is_published: item.is_published,
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        pdf_url: formData.pdf_url || null,
        external_url: formData.external_url || null,
      };
      if (editingResult) {
        await api.results.update(editingResult.id, payload);
      } else {
        await api.results.create(payload);
      }
      setModalOpen(false);
      loadResults();
    } catch (err) {
      console.error('Save failed:', err);
      alert('Failed to save result record.');
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Delete this result record?')) {
      try {
        await api.results.delete(id);
        loadResults();
      } catch (err) {
        console.error('Delete failed:', err);
      }
    }
  };

  const filteredResults = results.filter(r => {
    const matchesSearch =
      r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.examination.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (r.description && r.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesYear = selectedYear === 'all' || r.academic_year === selectedYear;
    const matchesClass = selectedClass === 'all' || r.class_name === selectedClass;
    return matchesSearch && matchesYear && matchesClass;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 font-serif">Board & School Results Management</h2>
          <p className="text-xs text-slate-500">
            Publish UP Board results, examination gazettes, merit achievements, and download links.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          id="btn-add-result"
          className="px-4 py-2.5 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs flex items-center gap-1.5 transition shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Add Result Record</span>
        </button>
      </div>

      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-wrap gap-3 items-center justify-between">
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search result title, exam..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-900"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <select
            value={selectedYear}
            onChange={e => setSelectedYear(e.target.value)}
            className="text-xs px-3 py-2 rounded-lg border border-slate-200 focus:outline-hidden"
          >
            <option value="all">All Academic Years</option>
            <option value="2023-2024">2023-2024</option>
            <option value="2022-2023">2022-2023</option>
            <option value="2021-2022">2021-2022</option>
          </select>

          <select
            value={selectedClass}
            onChange={e => setSelectedClass(e.target.value)}
            className="text-xs px-3 py-2 rounded-lg border border-slate-200 focus:outline-hidden"
          >
            <option value="all">All Classes</option>
            <option value="Class 12 (Intermediate)">Class 12 (Intermediate)</option>
            <option value="Class 10 (High School)">Class 10 (High School)</option>
            <option value="Class 11">Class 11</option>
            <option value="Class 9">Class 9</option>
          </select>

          <span className="text-xs text-slate-500 font-semibold">{filteredResults.length} Entries</span>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-slate-500">Loading results...</div>
        ) : filteredResults.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-500">No results found matching filters.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-semibold">
                <tr>
                  <th className="px-5 py-3">Title / Exam</th>
                  <th className="px-5 py-3">Class & Session</th>
                  <th className="px-5 py-3">Description</th>
                  <th className="px-5 py-3">PDF / Portal</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredResults.map(res => (
                  <tr key={res.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-3.5">
                      <p className="font-bold text-slate-900">{res.title}</p>
                      <p className="text-[10px] text-slate-400">{res.examination}</p>
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <span className="font-semibold text-blue-900 block">{res.class_name}</span>
                      <span className="text-[10px] text-slate-500">Session {res.academic_year}</span>
                    </td>
                    <td className="px-5 py-3.5 text-slate-600 max-w-xs truncate">
                      {res.description || '—'}
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap space-x-1">
                      {res.pdf_url && (
                        <a
                          href={res.pdf_url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-blue-50 text-blue-800 text-[10px] font-semibold hover:bg-blue-100"
                        >
                          <FileText className="w-3 h-3" />
                          <span>PDF</span>
                        </a>
                      )}
                      {res.external_url && (
                        <a
                          href={res.external_url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-50 text-amber-800 text-[10px] font-semibold hover:bg-amber-100"
                        >
                          <ExternalLink className="w-3 h-3" />
                          <span>Portal</span>
                        </a>
                      )}
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full ${
                          res.is_published ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        {res.is_published ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap text-right space-x-2">
                      <button
                        onClick={() => openEditModal(res)}
                        className="p-1.5 rounded-lg text-slate-600 hover:text-blue-900 hover:bg-slate-100"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(res.id)}
                        className="p-1.5 rounded-lg text-rose-600 hover:text-rose-800 hover:bg-rose-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">
                {editingResult ? 'Edit Result Record' : 'Add Result Record'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Result Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Class 12 Science Toppers & Merit Roll 2023-2024"
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Academic Session *</label>
                  <input
                    type="text"
                    required
                    placeholder="2023-2024"
                    value={formData.academic_year}
                    onChange={e => setFormData({ ...formData, academic_year: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-900"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Class / Standard *</label>
                  <select
                    value={formData.class_name}
                    onChange={e => setFormData({ ...formData, class_name: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-hidden"
                  >
                    <option value="Class 12 (Intermediate)">Class 12 (Intermediate)</option>
                    <option value="Class 10 (High School)">Class 10 (High School)</option>
                    <option value="Class 11">Class 11</option>
                    <option value="Class 9">Class 9</option>
                    <option value="Class 6-8 (Junior)">Class 6-8 (Junior)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Examination Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. UP Board High School / Intermediate Examination"
                  value={formData.examination}
                  onChange={e => setFormData({ ...formData, examination: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Description / Summary of Results</label>
                <textarea
                  rows={3}
                  placeholder="Total students appeared, pass percentage, subject-wise highlights..."
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-hidden resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">PDF Gazette URL</label>
                  <input
                    type="text"
                    placeholder="https://.../result.pdf"
                    value={formData.pdf_url}
                    onChange={e => setFormData({ ...formData, pdf_url: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-hidden text-[11px]"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Official Board Check URL</label>
                  <input
                    type="text"
                    placeholder="https://upmsp.edu.in"
                    value={formData.external_url}
                    onChange={e => setFormData({ ...formData, external_url: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-hidden text-[11px]"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="res_is_published"
                  checked={formData.is_published === 1}
                  onChange={e => setFormData({ ...formData, is_published: e.target.checked ? 1 : 0 })}
                  className="rounded text-blue-900 focus:ring-blue-900"
                />
                <label htmlFor="res_is_published" className="font-semibold text-slate-700 cursor-pointer">
                  Publish on website
                </label>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-blue-900 hover:bg-blue-800 text-white font-bold"
                >
                  {editingResult ? 'Update Result' : 'Save Result Record'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

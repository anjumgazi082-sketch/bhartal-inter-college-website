import React, { useState, useEffect } from 'react';
import { Download, Plus, Edit2, Trash2, Search, FileText, Upload, X } from 'lucide-react';
import { api } from '../../services/api';
import type { DownloadItem } from '../../types';

export const AdminDownloadsPage: React.FC = () => {
  const [downloads, setDownloads] = useState<DownloadItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const [modalOpen, setModalOpen] = useState(false);
  const [editingDownload, setEditingDownload] = useState<DownloadItem | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    category: 'Admission Forms',
    file_url: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    is_published: 1,
  });

  const [uploading, setUploading] = useState(false);

  const loadDownloads = async () => {
    setLoading(true);
    try {
      const res = await api.downloads.getAll();
      setDownloads(res.downloads || []);
    } catch (err) {
      console.error('Failed to load downloads:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDownloads();
  }, []);

  const openCreateModal = () => {
    setEditingDownload(null);
    setFormData({
      title: '',
      category: 'Admission Forms',
      file_url: '',
      description: '',
      date: new Date().toISOString().split('T')[0],
      is_published: 1,
    });
    setModalOpen(true);
  };

  const openEditModal = (d: DownloadItem) => {
    setEditingDownload(d);
    setFormData({
      title: d.title,
      category: d.category,
      file_url: d.file_url,
      description: d.description || '',
      date: d.date,
      is_published: d.is_published,
    });
    setModalOpen(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const dataUrl = reader.result as string;
        const res = await api.upload.file(file.name, dataUrl);
        if (res.success && res.fileUrl) {
          setFormData(prev => ({ ...prev, file_url: res.fileUrl }));
        }
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error('Upload failed:', err);
      alert('Upload failed.');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.file_url) {
      alert('Please upload or specify a document URL');
      return;
    }

    try {
      if (editingDownload) {
        await api.downloads.update(editingDownload.id, formData);
      } else {
        await api.downloads.create(formData);
      }
      setModalOpen(false);
      loadDownloads();
    } catch (err) {
      console.error('Save failed:', err);
      alert('Failed to save document.');
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Delete this download file?')) {
      try {
        await api.downloads.delete(id);
        loadDownloads();
      } catch (err) {
        console.error('Delete failed:', err);
      }
    }
  };

  const filteredDownloads = downloads.filter(
    d =>
      d.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 font-serif">Downloads & Forms Management</h2>
          <p className="text-xs text-slate-500">
            Provide downloadable PDF admission forms, syllabi, holiday lists, and college circulars.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          id="btn-add-download"
          className="px-4 py-2.5 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs flex items-center gap-1.5 transition shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Upload New File</span>
        </button>
      </div>

      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search downloads..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-900"
          />
        </div>
        <span className="text-xs text-slate-500 font-semibold">{filteredDownloads.length} Documents</span>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-slate-500">Loading documents...</div>
        ) : filteredDownloads.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-500">No documents found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-semibold">
                <tr>
                  <th className="px-5 py-3">Date</th>
                  <th className="px-5 py-3">Document Title</th>
                  <th className="px-5 py-3">Category</th>
                  <th className="px-5 py-3">File Link</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredDownloads.map(d => (
                  <tr key={d.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-3.5 whitespace-nowrap text-slate-500">{d.date}</td>
                    <td className="px-5 py-3.5 max-w-md">
                      <p className="font-bold text-slate-900">{d.title}</p>
                      {d.description && (
                        <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{d.description}</p>
                      )}
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <span className="bg-rose-50 text-rose-800 px-2.5 py-0.5 rounded font-semibold text-[11px]">
                        {d.category}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <a
                        href={d.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-900 hover:underline flex items-center gap-1 font-semibold text-[11px]"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>View / Download</span>
                      </a>
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap text-right space-x-2">
                      <button
                        onClick={() => openEditModal(d)}
                        className="p-1.5 rounded-lg text-slate-600 hover:text-blue-900 hover:bg-slate-100"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(d.id)}
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

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">
                {editingDownload ? 'Edit Document' : 'Upload New Download File'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Document Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Class 9 & 10 Admission Application Form 2025"
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-900"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white"
                  >
                    <option value="Admission Forms">Admission Forms</option>
                    <option value="Syllabus">Curriculum & Syllabus</option>
                    <option value="Timetables">Exam Schedules & Timetable</option>
                    <option value="Academic Calendar">Academic Calendar</option>
                    <option value="Circulars">Administrative Circulars</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Date</label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={e => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-900"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Brief Description</label>
                <textarea
                  rows={3}
                  placeholder="Notes or instructions for students downloading this file..."
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 resize-none"
                />
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <label className="font-semibold text-slate-700 block text-xs">File Upload *</label>
                <input
                  type="file"
                  onChange={handleFileUpload}
                  className="text-xs text-slate-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-900 file:text-white"
                />
                {uploading && <span className="text-xs text-blue-900">Uploading file...</span>}
                <input
                  type="text"
                  placeholder="Or enter direct file URL"
                  value={formData.file_url}
                  onChange={e => setFormData({ ...formData, file_url: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-[11px]"
                />
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
                  {editingDownload ? 'Update Document' : 'Save Document'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

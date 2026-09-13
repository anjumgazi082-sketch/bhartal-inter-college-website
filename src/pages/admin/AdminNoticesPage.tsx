import React, { useState, useEffect } from 'react';
import { Bell, Plus, Edit2, Trash2, Search, CheckCircle2, XCircle, FileText, Upload, Download, X } from 'lucide-react';
import { api } from '../../services/api';
import type { Notice } from '../../types';

export const AdminNoticesPage: React.FC = () => {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const [modalOpen, setModalOpen] = useState(false);
  const [editingNotice, setEditingNotice] = useState<Notice | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    category: 'General',
    description: '',
    date: new Date().toISOString().split('T')[0],
    pdf_url: '',
    is_published: 1,
  });

  const [uploading, setUploading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const loadNotices = async () => {
    setLoading(true);
    try {
      const res = await api.notices.getAll({ all: true });
      setNotices(res.notices || []);
    } catch (err) {
      console.error('Failed to load notices:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotices();
  }, []);

  const openCreateModal = () => {
    setEditingNotice(null);
    setFormData({
      title: '',
      category: 'General',
      description: '',
      date: new Date().toISOString().split('T')[0],
      pdf_url: '',
      is_published: 1,
    });
    setModalOpen(true);
  };

  const openEditModal = (notice: Notice) => {
    setEditingNotice(notice);
    setFormData({
      title: notice.title,
      category: notice.category,
      description: notice.description,
      date: notice.date,
      pdf_url: notice.pdf_url || '',
      is_published: notice.is_published,
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
          setFormData(prev => ({ ...prev, pdf_url: res.fileUrl }));
          setStatusMessage('Document uploaded successfully!');
          setTimeout(() => setStatusMessage(null), 3000);
        }
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error('Upload failed:', err);
      alert('Upload failed. Please ensure file is under 10MB.');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingNotice) {
        await api.notices.update(editingNotice.id, formData);
      } else {
        await api.notices.create(formData);
      }
      setModalOpen(false);
      loadNotices();
    } catch (err) {
      console.error('Save failed:', err);
      alert('Failed to save notice. Please check all fields.');
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to permanently delete this notice?')) {
      try {
        await api.notices.delete(id);
        loadNotices();
      } catch (err) {
        console.error('Delete failed:', err);
        alert('Could not delete notice.');
      }
    }
  };

  const togglePublished = async (notice: Notice) => {
    try {
      await api.notices.update(notice.id, {
        is_published: notice.is_published === 1 ? 0 : 1,
      });
      loadNotices();
    } catch (err) {
      console.error('Toggle status failed:', err);
    }
  };

  const filteredNotices = notices.filter(
    n =>
      n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      n.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 font-serif">Notice Board Management</h2>
          <p className="text-xs text-slate-500">
            Publish circulars, announcements, and holiday notices to the college website.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          id="btn-add-notice"
          className="px-4 py-2.5 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs flex items-center gap-1.5 transition shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Post New Notice</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search notices..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-900"
          />
        </div>
        <span className="text-xs text-slate-500 font-semibold">{filteredNotices.length} Notices</span>
      </div>

      {/* Notices Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-slate-500">Loading notices...</div>
        ) : filteredNotices.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-500">No notices found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-semibold">
                <tr>
                  <th className="px-5 py-3">Date</th>
                  <th className="px-5 py-3">Title & Summary</th>
                  <th className="px-5 py-3">Category</th>
                  <th className="px-5 py-3">Attachment</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredNotices.map(notice => (
                  <tr key={notice.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-3.5 whitespace-nowrap text-slate-500 font-medium">
                      {notice.date}
                    </td>
                    <td className="px-5 py-3.5 max-w-md">
                      <p className="font-bold text-slate-900 leading-tight">{notice.title}</p>
                      <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{notice.description}</p>
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <span className="bg-blue-50 text-blue-900 px-2 py-0.5 rounded font-semibold text-[11px]">
                        {notice.category}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      {notice.pdf_url ? (
                        <a
                          href={notice.pdf_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-emerald-700 hover:underline flex items-center gap-1 text-[11px] font-semibold"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>PDF Attached</span>
                        </a>
                      ) : (
                        <span className="text-slate-400 text-[11px]">None</span>
                      )}
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <button
                        onClick={() => togglePublished(notice)}
                        className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full ${
                          notice.is_published
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {notice.is_published ? (
                          <>
                            <CheckCircle2 className="w-3 h-3" /> Published
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3 h-3" /> Draft
                          </>
                        )}
                      </button>
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap text-right space-x-2">
                      <button
                        onClick={() => openEditModal(notice)}
                        className="p-1.5 rounded-lg text-slate-600 hover:text-blue-900 hover:bg-slate-100"
                        title="Edit Notice"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(notice.id)}
                        className="p-1.5 rounded-lg text-rose-600 hover:text-rose-800 hover:bg-rose-50"
                        title="Delete Notice"
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

      {/* Create / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">
                {editingNotice ? 'Edit Notice' : 'Create New Notice'}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {statusMessage && (
              <div className="p-2.5 rounded-lg bg-emerald-50 text-emerald-800 text-xs font-semibold">
                {statusMessage}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Notice Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Annual Sports Meet 2025 Schedule"
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
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-900"
                  >
                    <option value="General">General Announcement</option>
                    <option value="Admissions">Admissions</option>
                    <option value="Examinations">Examinations</option>
                    <option value="Events">Events & Celebrations</option>
                    <option value="Holidays">Holidays & Vacations</option>
                    <option value="Staff">Faculty / Staff</option>
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
                <label className="font-semibold text-slate-700 block mb-1">Description / Content *</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Full text of the notice, guidelines, dates, and instructions..."
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-900 resize-none"
                />
              </div>

              {/* PDF Document Upload */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <label className="font-semibold text-slate-700 block text-xs">
                  Attach Official Document / PDF
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx,image/*"
                    onChange={handleFileUpload}
                    className="text-xs text-slate-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-900 file:text-white hover:file:bg-blue-800"
                  />
                  {uploading && <span className="text-xs text-blue-900 font-medium">Uploading...</span>}
                </div>
                {formData.pdf_url && (
                  <p className="text-[11px] text-emerald-700 truncate">
                    Attached file: <strong>{formData.pdf_url}</strong>
                  </p>
                )}
              </div>

              {/* Publish Toggle */}
              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="notice_is_published"
                  checked={formData.is_published === 1}
                  onChange={e => setFormData({ ...formData, is_published: e.target.checked ? 1 : 0 })}
                  className="rounded text-blue-900 focus:ring-blue-900"
                />
                <label htmlFor="notice_is_published" className="font-semibold text-slate-700 cursor-pointer">
                  Publish to website immediately
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
                  {editingNotice ? 'Update Notice' : 'Publish Notice'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

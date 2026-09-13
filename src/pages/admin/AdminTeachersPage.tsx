import React, { useState, useEffect } from 'react';
import { Users, Plus, Edit2, Trash2, Search, CheckCircle2, XCircle, Upload, X } from 'lucide-react';
import { api } from '../../services/api';
import type { Teacher } from '../../types';

export const AdminTeachersPage: React.FC = () => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const [modalOpen, setModalOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    subject: '',
    qualification: '',
    designation: 'Faculty Member',
    bio: '',
    photo_url: '',
    display_order: 0,
    is_active: 1,
  });

  const [uploading, setUploading] = useState(false);

  const loadTeachers = async () => {
    setLoading(true);
    try {
      const res = await api.teachers.getAll({ all: true });
      setTeachers(res.teachers || []);
    } catch (err) {
      console.error('Failed to load teachers:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTeachers();
  }, []);

  const openCreateModal = () => {
    setEditingTeacher(null);
    setFormData({
      name: '',
      subject: '',
      qualification: '',
      designation: 'Faculty Member',
      bio: '',
      photo_url: '',
      display_order: teachers.length + 1,
      is_active: 1,
    });
    setModalOpen(true);
  };

  const openEditModal = (teacher: Teacher) => {
    setEditingTeacher(teacher);
    setFormData({
      name: teacher.name,
      subject: teacher.subject,
      qualification: teacher.qualification,
      designation: teacher.designation,
      bio: teacher.bio,
      photo_url: teacher.photo_url,
      display_order: teacher.display_order,
      is_active: teacher.is_active,
    });
    setModalOpen(true);
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const dataUrl = reader.result as string;
        const res = await api.upload.file(file.name, dataUrl);
        if (res.success && res.fileUrl) {
          setFormData(prev => ({ ...prev, photo_url: res.fileUrl }));
        }
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error('Photo upload error:', err);
      alert('Photo upload failed. Please verify format.');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingTeacher) {
        await api.teachers.update(editingTeacher.id, formData);
      } else {
        await api.teachers.create(formData);
      }
      setModalOpen(false);
      loadTeachers();
    } catch (err) {
      console.error('Teacher save failed:', err);
      alert('Failed to save teacher details.');
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Delete this faculty member profile?')) {
      try {
        await api.teachers.delete(id);
        loadTeachers();
      } catch (err) {
        console.error('Delete failed:', err);
      }
    }
  };

  const filteredTeachers = teachers.filter(
    t =>
      t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 font-serif">Faculty & Staff Management</h2>
          <p className="text-xs text-slate-500">
            Manage teacher profiles, designations, educational qualifications, and photos.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          id="btn-add-teacher"
          className="px-4 py-2.5 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs flex items-center gap-1.5 transition shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Add Faculty Member</span>
        </button>
      </div>

      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search faculty..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-900"
          />
        </div>
        <span className="text-xs text-slate-500 font-semibold">{filteredTeachers.length} Faculty Members</span>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-slate-500">Loading faculty list...</div>
        ) : filteredTeachers.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-500">No faculty members found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-semibold">
                <tr>
                  <th className="px-5 py-3">Photo & Name</th>
                  <th className="px-5 py-3">Subject / Dept</th>
                  <th className="px-5 py-3">Designation</th>
                  <th className="px-5 py-3">Qualification</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredTeachers.map(t => (
                  <tr key={t.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <img
                          src={
                            t.photo_url ||
                            'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200'
                          }
                          alt={t.name}
                          className="w-10 h-10 rounded-full object-cover border border-slate-200"
                          referrerPolicy="no-referrer"
                        />
                        <div>
                          <p className="font-bold text-slate-900">{t.name}</p>
                          <p className="text-[10px] text-slate-400">Order: {t.display_order}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap font-semibold text-blue-900">
                      {t.subject}
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap text-slate-700">{t.designation}</td>
                    <td className="px-5 py-3.5 whitespace-nowrap text-slate-500">{t.qualification || '—'}</td>
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full ${
                          t.is_active ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        {t.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap text-right space-x-2">
                      <button
                        onClick={() => openEditModal(t)}
                        className="p-1.5 rounded-lg text-slate-600 hover:text-blue-900 hover:bg-slate-100"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(t.id)}
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
                {editingTeacher ? 'Edit Faculty Profile' : 'Add New Faculty Member'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Teacher Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Chandra"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-900"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Subject / Department *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Mathematics, Physics, Hindi"
                    value={formData.subject}
                    onChange={e => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Designation</label>
                  <input
                    type="text"
                    placeholder="e.g. Senior Lecturer, Assistant Teacher"
                    value={formData.designation}
                    onChange={e => setFormData({ ...formData, designation: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-900"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Qualification</label>
                  <input
                    type="text"
                    placeholder="e.g. M.Sc, B.Ed"
                    value={formData.qualification}
                    onChange={e => setFormData({ ...formData, qualification: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-900"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Biography / Experience</label>
                <textarea
                  rows={3}
                  placeholder="Teaching background, years of experience, achievements..."
                  value={formData.bio}
                  onChange={e => setFormData({ ...formData, bio: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-900 resize-none"
                />
              </div>

              {/* Photo Upload & Preview */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <label className="font-semibold text-slate-700 block text-xs">Faculty Photo</label>
                <div className="flex items-center gap-3">
                  {formData.photo_url && (
                    <img
                      src={formData.photo_url}
                      alt="Preview"
                      className="w-12 h-12 rounded-full object-cover border border-slate-300"
                    />
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="text-xs text-slate-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-900 file:text-white"
                  />
                  {uploading && <span className="text-xs text-blue-900">Uploading...</span>}
                </div>
                <input
                  type="text"
                  placeholder="Or enter image URL"
                  value={formData.photo_url}
                  onChange={e => setFormData({ ...formData, photo_url: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-[11px]"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="teacher_is_active"
                    checked={formData.is_active === 1}
                    onChange={e => setFormData({ ...formData, is_active: e.target.checked ? 1 : 0 })}
                    className="rounded text-blue-900 focus:ring-blue-900"
                  />
                  <label htmlFor="teacher_is_active" className="font-semibold text-slate-700 cursor-pointer">
                    Active on website
                  </label>
                </div>

                <div className="flex items-center gap-2">
                  <label className="font-semibold text-slate-700">Display Order:</label>
                  <input
                    type="number"
                    value={formData.display_order}
                    onChange={e => setFormData({ ...formData, display_order: Number(e.target.value) })}
                    className="w-16 px-2 py-1 rounded border border-slate-200 text-center"
                  />
                </div>
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
                  {editingTeacher ? 'Update Profile' : 'Save Faculty Member'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

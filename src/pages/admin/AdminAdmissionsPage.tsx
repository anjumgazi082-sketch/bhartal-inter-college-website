import React, { useState, useEffect } from 'react';
import { GraduationCap, Search, Phone, Mail, MapPin, Calendar, CheckCircle2, Clock, Trash2 } from 'lucide-react';
import { api } from '../../services/api';
import type { AdmissionEnquiry } from '../../types';

export const AdminAdmissionsPage: React.FC = () => {
  const [enquiries, setEnquiries] = useState<AdmissionEnquiry[]>([]);
  const [counts, setCounts] = useState({ total: 0, new: 0, contacted: 0, closed: 0 });
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const [selectedEnquiry, setSelectedEnquiry] = useState<AdmissionEnquiry | null>(null);
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState('new');

  const loadEnquiries = async () => {
    setLoading(true);
    try {
      const res = await api.admissions.getAllAdmin({
        status: statusFilter === 'all' ? undefined : statusFilter,
        search: searchTerm || undefined,
      });
      setEnquiries(res.enquiries || []);
      setCounts(res.counts || { total: 0, new: 0, contacted: 0, closed: 0 });
    } catch (err) {
      console.error('Failed to load enquiries:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEnquiries();
  }, [statusFilter]);

  const handleUpdateStatus = async (id: number, newStatus: string, updatedNotes?: string) => {
    try {
      await api.admissions.updateStatus(id, {
        status: newStatus,
        notes: updatedNotes !== undefined ? updatedNotes : notes,
      });
      loadEnquiries();
      if (selectedEnquiry && selectedEnquiry.id === id) {
        setSelectedEnquiry(prev => (prev ? { ...prev, status: newStatus, notes: updatedNotes || prev.notes } : null));
      }
    } catch (err) {
      console.error('Update status failed:', err);
      alert('Failed to update enquiry status.');
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Delete this admission enquiry record?')) {
      try {
        await api.admissions.delete(id);
        if (selectedEnquiry?.id === id) setSelectedEnquiry(null);
        loadEnquiries();
      } catch (err) {
        console.error('Delete enquiry failed:', err);
      }
    }
  };

  const openDetailModal = (enquiry: AdmissionEnquiry) => {
    setSelectedEnquiry(enquiry);
    setStatus(enquiry.status);
    setNotes(enquiry.notes || '');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 font-serif">Admission Enquiries Management</h2>
          <p className="text-xs text-slate-500">
            Track inquiries submitted through the online admission portal. Contact parents and manage admissions.
          </p>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div
          onClick={() => setStatusFilter('all')}
          className={`cursor-pointer p-4 rounded-xl border transition ${
            statusFilter === 'all'
              ? 'border-blue-900 bg-blue-50 text-blue-900 shadow-xs'
              : 'border-slate-200 bg-white text-slate-700'
          }`}
        >
          <span className="text-[11px] font-semibold uppercase">Total Applications</span>
          <p className="text-2xl font-bold mt-1">{counts.total}</p>
        </div>

        <div
          onClick={() => setStatusFilter('new')}
          className={`cursor-pointer p-4 rounded-xl border transition ${
            statusFilter === 'new'
              ? 'border-amber-600 bg-amber-50 text-amber-900 shadow-xs'
              : 'border-slate-200 bg-white text-slate-700'
          }`}
        >
          <span className="text-[11px] font-semibold uppercase">New Enquiries</span>
          <p className="text-2xl font-bold mt-1 text-amber-600">{counts.new}</p>
        </div>

        <div
          onClick={() => setStatusFilter('contacted')}
          className={`cursor-pointer p-4 rounded-xl border transition ${
            statusFilter === 'contacted'
              ? 'border-blue-600 bg-blue-50 text-blue-900 shadow-xs'
              : 'border-slate-200 bg-white text-slate-700'
          }`}
        >
          <span className="text-[11px] font-semibold uppercase">In Discussion / Contacted</span>
          <p className="text-2xl font-bold mt-1 text-blue-600">{counts.contacted}</p>
        </div>

        <div
          onClick={() => setStatusFilter('closed')}
          className={`cursor-pointer p-4 rounded-xl border transition ${
            statusFilter === 'closed'
              ? 'border-emerald-600 bg-emerald-50 text-emerald-900 shadow-xs'
              : 'border-slate-200 bg-white text-slate-700'
          }`}
        >
          <span className="text-[11px] font-semibold uppercase">Enrolled / Closed</span>
          <p className="text-2xl font-bold mt-1 text-emerald-600">{counts.closed}</p>
        </div>
      </div>

      {/* Filter / Search */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between gap-4">
        <div className="relative w-full max-w-sm">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search student, parent, or phone..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && loadEnquiries()}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-900"
          />
        </div>

        <button
          onClick={loadEnquiries}
          className="px-3.5 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold"
        >
          Filter / Refresh
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-slate-500">Loading inquiries...</div>
        ) : enquiries.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-500">No admission enquiries found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-semibold">
                <tr>
                  <th className="px-5 py-3">Student Name</th>
                  <th className="px-5 py-3">Class Applying</th>
                  <th className="px-5 py-3">Parent Name</th>
                  <th className="px-5 py-3">Phone & Email</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">Date</th>
                  <th className="px-5 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {enquiries.map(enq => (
                  <tr key={enq.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-3.5 font-bold text-slate-900 whitespace-nowrap">
                      {enq.student_name}
                      {enq.dob && <span className="block text-[10px] text-slate-400 font-normal">DOB: {enq.dob}</span>}
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <span className="font-semibold text-blue-900 bg-blue-50 px-2 py-0.5 rounded text-[11px]">
                        {enq.class_applying}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap text-slate-700">{enq.parent_name}</td>
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <div className="font-mono text-slate-900">{enq.phone}</div>
                      {enq.email && <div className="text-[10px] text-slate-400">{enq.email}</div>}
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          enq.status === 'new'
                            ? 'bg-amber-100 text-amber-800'
                            : enq.status === 'contacted'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {enq.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap text-slate-400 text-[11px]">
                      {new Date(enq.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap text-right space-x-2">
                      <button
                        onClick={() => openDetailModal(enq)}
                        className="px-2.5 py-1 rounded-md bg-blue-50 text-blue-900 font-semibold hover:bg-blue-100 text-[11px]"
                      >
                        Review
                      </button>
                      <button
                        onClick={() => handleDelete(enq.id)}
                        className="p-1 rounded-md text-rose-600 hover:bg-rose-50"
                        title="Delete application"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Review Modal */}
      {selectedEnquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">Enquiry #{selectedEnquiry.id}</h3>
                <p className="text-[11px] text-slate-400">
                  Submitted on {new Date(selectedEnquiry.created_at).toLocaleString()}
                </p>
              </div>
              <button onClick={() => setSelectedEnquiry(null)} className="p-1 text-slate-400 hover:text-slate-600">
                ✕
              </button>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Student Name</span>
                  <p className="font-bold text-sm text-slate-900">{selectedEnquiry.student_name}</p>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Class Applying</span>
                  <p className="font-bold text-blue-900">{selectedEnquiry.class_applying}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Parent / Guardian</span>
                  <p className="font-semibold text-slate-800">{selectedEnquiry.parent_name}</p>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Contact Phone</span>
                  <a href={`tel:${selectedEnquiry.phone}`} className="font-bold text-blue-900 underline">
                    {selectedEnquiry.phone}
                  </a>
                </div>
              </div>

              {selectedEnquiry.email && (
                <div className="pt-2 border-t border-slate-200">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Email Address</span>
                  <p className="text-slate-700">{selectedEnquiry.email}</p>
                </div>
              )}

              {selectedEnquiry.address && (
                <div className="pt-2 border-t border-slate-200">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Residential Address</span>
                  <p className="text-slate-700">{selectedEnquiry.address}</p>
                </div>
              )}

              {selectedEnquiry.message && (
                <div className="pt-2 border-t border-slate-200">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Additional Query / Remarks</span>
                  <p className="text-slate-700 italic">&quot;{selectedEnquiry.message}&quot;</p>
                </div>
              )}
            </div>

            <div className="space-y-3 pt-2">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Status Update</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['new', 'contacted', 'closed'] as const).map(st => (
                    <button
                      type="button"
                      key={st}
                      onClick={() => setStatus(st)}
                      className={`py-2 rounded-lg font-bold uppercase text-[10px] transition border ${
                        status === st
                          ? 'bg-blue-900 text-white border-blue-900'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Staff / Admission Officer Notes</label>
                <textarea
                  rows={3}
                  placeholder="Record conversation summary, documents verified, admission decision..."
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-900"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setSelectedEnquiry(null)}
                className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => handleUpdateStatus(selectedEnquiry.id, status, notes)}
                className="px-5 py-2 rounded-lg bg-blue-900 hover:bg-blue-800 text-white font-bold"
              >
                Save Notes & Status
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

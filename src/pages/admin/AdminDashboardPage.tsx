import React, { useState, useEffect } from 'react';
import {
  Bell,
  Users,
  Calendar,
  Image as ImageIcon,
  Award,
  Download,
  GraduationCap,
  PlusCircle,
  Clock,
  ChevronRight,
  ShieldCheck,
  ArrowUpRight,
  FileText,
} from 'lucide-react';
import { api } from '../../services/api';
import type { DashboardMetrics, Notice, AdmissionEnquiry } from '../../types';

interface AdminDashboardPageProps {
  onNavigateTab: (tab: string) => void;
}

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({ onNavigateTab }) => {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [recentNotices, setRecentNotices] = useState<Notice[]>([]);
  const [recentEnquiries, setRecentEnquiries] = useState<AdmissionEnquiry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const res = await api.stats.get();
        setMetrics(res.metrics);
        setRecentNotices(res.recentNotices || []);
        setRecentEnquiries(res.recentEnquiries || []);
      } catch (err) {
        console.error('Failed to load admin stats:', err);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-blue-950 p-6 sm:p-8 rounded-2xl text-white border border-blue-900 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">
              Live School Management
            </span>
          </div>
          <h2 className="text-2xl font-bold font-serif">Administrative Command Center</h2>
          <p className="text-xs text-slate-300 max-w-xl">
            Control all public content, faculty profiles, notices, results, gallery albums, and admissions in real-time.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-stretch sm:self-auto">
          <button
            onClick={() => onNavigateTab('notices')}
            className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Post Notice</span>
          </button>
          <button
            onClick={() => onNavigateTab('settings')}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs flex items-center gap-1.5 transition border border-slate-700"
          >
            <span>School Settings</span>
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Notices Published', count: metrics?.totalNotices ?? '-', icon: Bell, tab: 'notices', color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Faculty Members', count: metrics?.totalTeachers ?? '-', icon: Users, tab: 'teachers', color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'Events & News', count: metrics?.totalEvents ?? '-', icon: Calendar, tab: 'events', color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Gallery Images', count: metrics?.totalGalleryImages ?? '-', icon: ImageIcon, tab: 'gallery', color: 'text-purple-600', bg: 'bg-purple-50' },
          { label: 'Downloads & Circulars', count: metrics?.totalDownloads ?? '-', icon: Download, tab: 'downloads', color: 'text-rose-600', bg: 'bg-rose-50' },
          { label: 'Published Results', count: metrics?.totalResults ?? '-', icon: Award, tab: 'results', color: 'text-cyan-600', bg: 'bg-cyan-50' },
          { label: 'Total Enquiries', count: metrics?.totalAdmissions ?? '-', icon: GraduationCap, tab: 'admissions', color: 'text-indigo-600', bg: 'bg-indigo-50' },
          { label: 'Pending Enquiries', count: metrics?.newAdmissions ?? 0, icon: Clock, tab: 'admissions', color: 'text-amber-600', bg: 'bg-amber-100', highlight: true },
        ].map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              onClick={() => onNavigateTab(card.tab)}
              className={`p-5 rounded-2xl border transition-all cursor-pointer bg-white shadow-xs hover:shadow-md flex flex-col justify-between space-y-3 ${
                card.highlight ? 'border-amber-300 ring-2 ring-amber-100' : 'border-slate-200 hover:border-blue-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className={`w-9 h-9 rounded-xl ${card.bg} ${card.color} flex items-center justify-center`}>
                  <Icon className="w-5 h-5" />
                </div>
                <ArrowUpRight className="w-4 h-4 text-slate-300" />
              </div>
              <div>
                <div className="text-2xl font-extrabold text-slate-900 font-serif">
                  {loading ? '...' : card.count}
                </div>
                <div className="text-xs font-semibold text-slate-500 mt-0.5">{card.label}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Two-Column Activity Feeds */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Recent Admission Enquiries */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-blue-900" />
              <h3 className="font-bold text-slate-900 text-sm">Recent Admission Enquiries</h3>
            </div>
            <button
              onClick={() => onNavigateTab('admissions')}
              className="text-xs font-bold text-blue-900 hover:text-blue-700 flex items-center gap-1"
            >
              <span>View All</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {loading ? (
            <div className="p-8 text-center text-xs text-slate-400">Loading enquiries...</div>
          ) : recentEnquiries.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400">No enquiries submitted yet.</div>
          ) : (
            <div className="space-y-2.5">
              {recentEnquiries.map(item => (
                <div
                  key={item.id}
                  onClick={() => onNavigateTab('admissions')}
                  className="p-3.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors flex items-center justify-between cursor-pointer"
                >
                  <div className="space-y-0.5">
                    <p className="text-xs font-bold text-slate-900">{item.student_name}</p>
                    <p className="text-[11px] text-slate-500">
                      Applying for: <strong>{item.class_applying}</strong> • Phone: {item.phone}
                    </p>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase ${
                      item.status === 'New'
                        ? 'bg-amber-100 text-amber-800'
                        : item.status === 'Contacted'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Notices */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-blue-900" />
              <h3 className="font-bold text-slate-900 text-sm">Latest Notices</h3>
            </div>
            <button
              onClick={() => onNavigateTab('notices')}
              className="text-xs font-bold text-blue-900 hover:text-blue-700 flex items-center gap-1"
            >
              <span>Manage</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {loading ? (
            <div className="p-8 text-center text-xs text-slate-400">Loading notices...</div>
          ) : recentNotices.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400">No notices recorded.</div>
          ) : (
            <div className="space-y-2.5">
              {recentNotices.map(notice => (
                <div
                  key={notice.id}
                  onClick={() => onNavigateTab('notices')}
                  className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors cursor-pointer space-y-1"
                >
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="font-semibold text-blue-900 bg-blue-50 px-2 py-0.5 rounded">
                      {notice.category}
                    </span>
                    <span className="text-slate-400">{notice.date}</span>
                  </div>
                  <p className="text-xs font-bold text-slate-900 truncate">{notice.title}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

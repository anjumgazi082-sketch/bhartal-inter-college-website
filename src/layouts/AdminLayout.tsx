import React, { useState } from 'react';
import {
  LayoutDashboard,
  Bell,
  Users,
  Calendar,
  Image as ImageIcon,
  Award,
  Download,
  GraduationCap,
  Settings,
  Lock,
  LogOut,
  ExternalLink,
  Menu,
  X,
  School,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useSchool } from '../context/SchoolContext';

interface AdminLayoutProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  onExitToPublic: () => void;
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  currentTab,
  setCurrentTab,
  onExitToPublic,
  children,
}) => {
  const { user, logout } = useAuth();
  const { settings } = useSchool();
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'notices', label: 'Notice Board', icon: Bell },
    { id: 'teachers', label: 'Faculty & Staff', icon: Users },
    { id: 'events', label: 'Events & News', icon: Calendar },
    { id: 'gallery', label: 'Photo Gallery', icon: ImageIcon },
    { id: 'results', label: 'Results & Merit', icon: Award },
    { id: 'downloads', label: 'Downloads & Circulars', icon: Download },
    { id: 'admissions', label: 'Admission Enquiries', icon: GraduationCap },
    { id: 'settings', label: 'School Settings', icon: Settings },
    { id: 'security', label: 'Change Password', icon: Lock },
  ];

  const handleMenuClick = (tabId: string) => {
    setCurrentTab(tabId);
    setMobileDrawerOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row text-slate-900">
      {/* Mobile Top Header */}
      <div className="md:hidden bg-slate-900 text-white px-4 py-3 flex items-center justify-between border-b border-slate-800 sticky top-0 z-30">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-900 flex items-center justify-center p-0.5 text-amber-400">
            <School className="w-5 h-5" />
          </div>
          <div>
            <span className="font-bold text-xs block leading-tight">Admin Console</span>
            <span className="text-[10px] text-slate-400 block">{settings.school_name}</span>
          </div>
        </div>

        <button
          onClick={() => setMobileDrawerOpen(!mobileDrawerOpen)}
          className="p-1.5 rounded-lg bg-slate-800 text-slate-200"
          aria-label="Toggle Admin Menu"
        >
          {mobileDrawerOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Sidebar Navigation (Desktop) */}
      <aside
        className={`w-64 bg-slate-900 text-slate-200 border-r border-slate-800 flex flex-col justify-between shrink-0 transition-transform duration-200 fixed inset-y-0 left-0 z-40 md:static ${
          mobileDrawerOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="p-4 space-y-6">
          {/* Logo / School Brand */}
          <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
            <div className="w-10 h-10 rounded-xl bg-blue-900 border border-blue-800 flex items-center justify-center text-amber-400 shrink-0">
              <School className="w-6 h-6" />
            </div>
            <div className="min-w-0">
              <h2 className="text-sm font-bold text-white uppercase tracking-tight truncate">
                {settings.school_name}
              </h2>
              <span className="text-[10px] text-amber-400 font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> Admin Portal
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1 text-xs font-semibold">
            {menuItems.map(item => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`admin-tab-${item.id}`}
                  onClick={() => handleMenuClick(item.id)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-colors text-left ${
                    isActive
                      ? 'bg-blue-800 text-white shadow-xs font-bold'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
                  <span className="flex-1">{item.label}</span>
                  {isActive && <ChevronRight className="w-3.5 h-3.5 text-white" />}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-800 space-y-2 text-xs">
          <button
            onClick={onExitToPublic}
            className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition font-medium"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>View Public Website</span>
          </button>

          <div className="flex items-center justify-between pt-2 px-1 text-slate-400 text-[11px]">
            <span>User: <strong>{user?.name || 'Administrator'}</strong></span>
            <button
              onClick={logout}
              title="Logout from Admin Panel"
              className="text-rose-400 hover:text-rose-300 flex items-center gap-1 font-semibold"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Desktop Top Bar */}
        <header className="hidden md:flex items-center justify-between px-8 py-4 bg-white border-b border-slate-200 sticky top-0 z-20 shadow-xs">
          <div>
            <h1 className="text-lg font-bold text-slate-900 capitalize">
              {currentTab === 'dashboard' ? 'Overview & Statistics' : currentTab.replace('-', ' ')}
            </h1>
            <p className="text-xs text-slate-500">
              Manage Bhartal Inter College portal content & records
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onExitToPublic}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 transition"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Preview Website</span>
            </button>
            <button
              onClick={logout}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-xs font-semibold text-rose-700 transition"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </header>

        {/* Tab Content */}
        <div className="p-4 sm:p-6 lg:p-8 flex-1">{children}</div>
      </main>
    </div>
  );
};

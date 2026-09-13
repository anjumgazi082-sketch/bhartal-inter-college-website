import React, { useState, useEffect } from 'react';
import { Settings, Save, CheckCircle, RefreshCw, Upload, Building, Phone, Mail, Clock, BookOpen, Award, Share2 } from 'lucide-react';
import { useSchool } from '../../context/SchoolContext';
import { api } from '../../services/api';
import type { SchoolSettings } from '../../types';

export const AdminSettingsPage: React.FC = () => {
  const { settings, refreshSettings, updateSettings } = useSchool();
  const [formData, setFormData] = useState<SchoolSettings>(settings);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState<'general' | 'principal' | 'academic' | 'facilities' | 'social'>('general');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    setFormData(settings);
  }, [settings]);

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
          setFormData(prev => ({ ...prev, principal_photo: res.fileUrl }));
        }
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error('Upload failed:', err);
      alert('Photo upload failed.');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSavedSuccess(false);
    try {
      const ok = await updateSettings(formData);
      if (ok) {
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 3000);
      } else {
        alert('Failed to save school settings.');
      }
    } catch (err) {
      console.error('Save settings error:', err);
      alert('Error updating settings.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 font-serif">School Settings & Configuration</h2>
          <p className="text-xs text-slate-500">
            Control institutional contact data, Principal&apos;s desk message, vision, facilities, and social profiles.
          </p>
        </div>

        <button
          onClick={handleSubmit}
          id="btn-save-settings"
          disabled={saving}
          className="px-5 py-2.5 rounded-xl bg-blue-900 hover:bg-blue-800 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-1.5 transition shadow-sm"
        >
          {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          <span>{saving ? 'Saving Changes...' : 'Save All Settings'}</span>
        </button>
      </div>

      {savedSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl flex items-center gap-2 text-xs font-semibold animate-in fade-in">
          <CheckCircle className="w-4 h-4 text-emerald-600" />
          <span>School configuration updated successfully and published across the website.</span>
        </div>
      )}

      {/* Sub tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto text-xs font-bold">
        {[
          { id: 'general', label: 'General & Contact', icon: Building },
          { id: 'principal', label: "Principal's Desk", icon: Award },
          { id: 'academic', label: 'Vision & Hours', icon: BookOpen },
          { id: 'facilities', label: 'Facilities', icon: Settings },
          { id: 'social', label: 'Social Handles', icon: Share2 },
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg transition whitespace-nowrap ${
                isActive
                  ? 'bg-blue-900 text-white'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* GENERAL & CONTACT */}
        {activeSubTab === 'general' && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4 text-xs">
            <h3 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-2">
              Official Institutional Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">School Name *</label>
                <input
                  type="text"
                  required
                  value={formData.school_name}
                  onChange={e => setFormData({ ...formData, school_name: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-900 font-bold"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Tagline / Motto</label>
                <input
                  type="text"
                  value={formData.tagline}
                  onChange={e => setFormData({ ...formData, tagline: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Official Address *</label>
              <input
                type="text"
                required
                value={formData.address}
                onChange={e => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-hidden"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Official Phone *</label>
                <input
                  type="text"
                  required
                  value={formData.phone}
                  onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-hidden font-mono"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Official Email *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Homepage Introduction Summary</label>
              <textarea
                rows={3}
                value={formData.homepage_intro}
                onChange={e => setFormData({ ...formData, homepage_intro: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-hidden resize-none"
              />
            </div>
          </div>
        )}

        {/* PRINCIPAL'S DESK */}
        {activeSubTab === 'principal' && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4 text-xs">
            <h3 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-2">
              Principal&apos;s Profile & Message
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Principal Name</label>
                <input
                  type="text"
                  value={formData.principal_name}
                  onChange={e => setFormData({ ...formData, principal_name: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Designation</label>
                <input
                  type="text"
                  value={formData.principal_designation}
                  onChange={e => setFormData({ ...formData, principal_designation: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-hidden"
                />
              </div>
            </div>

            {/* Photo */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <label className="font-semibold text-slate-700 block">Principal Portrait Photo</label>
              <div className="flex items-center gap-4">
                <img
                  src={formData.principal_photo}
                  alt="Principal"
                  className="w-16 h-16 rounded-full object-cover border border-slate-300"
                />
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="text-xs text-slate-500 file:mr-2 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-900 file:text-white"
                  />
                  {uploading && <p className="text-xs text-blue-900 mt-1">Uploading photo...</p>}
                </div>
              </div>
              <input
                type="text"
                placeholder="Or paste direct image URL"
                value={formData.principal_photo}
                onChange={e => setFormData({ ...formData, principal_photo: e.target.value })}
                className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-[11px]"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Principal&apos;s Official Message</label>
              <textarea
                rows={6}
                value={formData.principal_message}
                onChange={e => setFormData({ ...formData, principal_message: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-hidden"
              />
              <p className="text-[10px] text-slate-400 mt-1">
                This message appears prominently on the homepage and the Principal&apos;s Desk page.
              </p>
            </div>
          </div>
        )}

        {/* VISION & HOURS */}
        {activeSubTab === 'academic' && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4 text-xs">
            <h3 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-2">
              Vision, Mission & Administrative Timings
            </h3>

            <div className="space-y-3">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Institutional Vision</label>
                <textarea
                  rows={3}
                  value={formData.vision}
                  onChange={e => setFormData({ ...formData, vision: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Institutional Mission</label>
                <textarea
                  rows={3}
                  value={formData.mission}
                  onChange={e => setFormData({ ...formData, mission: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-hidden"
                />
              </div>
            </div>

            <h4 className="font-bold text-slate-900 text-xs pt-4 border-t border-slate-100">
              School Office & Working Hours
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Working Days</label>
                <input
                  type="text"
                  value={formData.office_hours?.days || ''}
                  onChange={e =>
                    setFormData({
                      ...formData,
                      office_hours: { ...formData.office_hours, days: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Operating Hours</label>
                <input
                  type="text"
                  value={formData.office_hours?.timings || ''}
                  onChange={e =>
                    setFormData({
                      ...formData,
                      office_hours: { ...formData.office_hours, timings: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Holidays / Closed</label>
                <input
                  type="text"
                  value={formData.office_hours?.closed || ''}
                  onChange={e =>
                    setFormData({
                      ...formData,
                      office_hours: { ...formData.office_hours, closed: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-hidden"
                />
              </div>
            </div>
          </div>
        )}

        {/* FACILITIES */}
        {activeSubTab === 'facilities' && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4 text-xs">
            <h3 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-2">
              Campus Facilities & Infrastructure Features
            </h3>
            <p className="text-slate-500 text-[11px]">
              Toggle which facilities appear on the website and adjust descriptions.
            </p>

            <div className="space-y-3">
              {(formData.facilities || []).map((fac, idx) => (
                <div key={fac.id} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id={`fac_${fac.id}`}
                        checked={fac.enabled}
                        onChange={e => {
                          const updated = [...formData.facilities];
                          updated[idx] = { ...fac, enabled: e.target.checked };
                          setFormData({ ...formData, facilities: updated });
                        }}
                        className="rounded text-blue-900 focus:ring-blue-900"
                      />
                      <label htmlFor={`fac_${fac.id}`} className="font-bold text-slate-800 cursor-pointer">
                        {fac.title}
                      </label>
                    </div>
                    {fac.isDemo && (
                      <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-semibold">
                        Demo Label
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={fac.title}
                      onChange={e => {
                        const updated = [...formData.facilities];
                        updated[idx] = { ...fac, title: e.target.value };
                        setFormData({ ...formData, facilities: updated });
                      }}
                      className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white font-semibold"
                    />
                    <input
                      type="text"
                      value={fac.description}
                      onChange={e => {
                        const updated = [...formData.facilities];
                        updated[idx] = { ...fac, description: e.target.value };
                        setFormData({ ...formData, facilities: updated });
                      }}
                      className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 text-[11px]"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SOCIAL LINKS */}
        {activeSubTab === 'social' && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4 text-xs">
            <h3 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-2">
              Social Media Handles
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Facebook URL</label>
                <input
                  type="url"
                  placeholder="https://facebook.com/..."
                  value={formData.social_links?.facebook || ''}
                  onChange={e =>
                    setFormData({
                      ...formData,
                      social_links: { ...formData.social_links, facebook: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Twitter / X URL</label>
                <input
                  type="url"
                  placeholder="https://x.com/..."
                  value={formData.social_links?.twitter || ''}
                  onChange={e =>
                    setFormData({
                      ...formData,
                      social_links: { ...formData.social_links, twitter: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">YouTube Channel URL</label>
                <input
                  type="url"
                  placeholder="https://youtube.com/..."
                  value={formData.social_links?.youtube || ''}
                  onChange={e =>
                    setFormData({
                      ...formData,
                      social_links: { ...formData.social_links, youtube: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Instagram URL</label>
                <input
                  type="url"
                  placeholder="https://instagram.com/..."
                  value={formData.social_links?.instagram || ''}
                  onChange={e =>
                    setFormData({
                      ...formData,
                      social_links: { ...formData.social_links, instagram: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-hidden"
                />
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 rounded-xl bg-blue-900 hover:bg-blue-800 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-1.5 transition shadow-sm"
          >
            {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>{saving ? 'Saving...' : 'Save Settings'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

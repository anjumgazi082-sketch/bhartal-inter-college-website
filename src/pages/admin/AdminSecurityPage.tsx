import React, { useState } from 'react';
import { Lock, Key, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';
import { api } from '../../services/api';

export const AdminSecurityPage: React.FC = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg(null);
    setErrorMsg(null);

    if (newPassword.length < 6) {
      setErrorMsg('New password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMsg('New password and confirmation do not match.');
      return;
    }

    setLoading(true);
    try {
      const res = await api.auth.changePassword({
        currentPassword,
        newPassword,
      });
      if (res.success) {
        setSuccessMsg(res.message || 'Administrator password changed successfully!');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setErrorMsg('Failed to change password.');
      }
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Error changing password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-xl">
      <div>
        <h2 className="text-xl font-bold text-slate-900 font-serif">Security & Password Management</h2>
        <p className="text-xs text-slate-500">
          Update the administrator authentication credentials to protect college administrative access.
        </p>
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <Lock className="w-5 h-5 text-blue-900" />
          <h3 className="text-base font-bold text-slate-900">Change Admin Password</h3>
        </div>

        {successMsg && (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {errorMsg && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 text-xs flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-rose-700 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleChangePassword} className="space-y-4 text-xs">
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Current Password *</label>
            <input
              type="password"
              required
              placeholder="Enter current password (default: admin@bhartal123)"
              value={currentPassword}
              onChange={e => setCurrentPassword(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-900"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">New Password *</label>
            <input
              type="password"
              required
              placeholder="Enter strong new password (min. 6 chars)"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-900"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Confirm New Password *</label>
            <input
              type="password"
              required
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-900"
            />
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600 flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>
              Passphrases should be kept confidential. Never share admin credentials over unverified channels.
            </span>
          </div>

          <button
            type="submit"
            disabled={loading}
            id="btn-update-password"
            className="w-full py-3 px-4 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs transition shadow-sm disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <Key className="w-4 h-4" />
            <span>{loading ? 'Updating Password...' : 'Update Password'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};

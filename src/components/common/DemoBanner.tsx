import React, { useState } from 'react';
import { Info, X, ShieldCheck } from 'lucide-react';

export const DemoBanner: React.FC = () => {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <aside aria-label="Official verification notice" className="bg-gradient-to-r from-blue-950 via-slate-900 to-blue-950 text-slate-200 border-b border-blue-900/60 px-4 py-2 text-xs relative">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 rounded-full bg-emerald-400 shrink-0 animate-pulse" />
          <p className="font-medium text-slate-100 flex items-center gap-1.5 flex-wrap">
            <span className="text-amber-400 font-semibold">[Official Portal]</span>
            Bhartal Inter College, Hasanpur Road, Bhartal, Sirsi, District Sambhal.
            <span className="text-slate-400 text-[11px] hidden md:inline">
              (Items marked <span className="bg-amber-500/20 text-amber-300 px-1 py-0.5 rounded font-mono text-[10px]">Demo</span> are editable placeholders customizable in Admin Panel)
            </span>
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-2 py-0.5 rounded">
            <ShieldCheck className="w-3 h-3" />
            Verified Contact Details
          </span>
          <button
            onClick={() => setDismissed(true)}
            className="text-slate-400 hover:text-white p-0.5 rounded"
            title="Dismiss notice"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
};

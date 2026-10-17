'use client';

import React from 'react';
import Link from 'next/link';
import { Code2, ArrowLeft, ShieldAlert } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <header className="w-full bg-slate-950/90 border-b border-slate-800/80 px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center">
            <Code2 className="w-4 h-4 text-emerald-400 stroke-[2.5]" />
          </div>
          <span className="font-bold text-sm tracking-tight text-slate-100">
            BuildCheck <span className="text-[10px] text-slate-500 font-normal uppercase">Enterprise</span>
          </span>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center space-y-5 shadow-2xl">
          <div className="w-12 h-12 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center mx-auto text-amber-400">
            <ShieldAlert className="w-6 h-6" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-bold">
              HTTP 404 • Resource Not Found
            </span>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-100 tracking-tight">
              Sandbox Route Unreachable
            </h1>
            <p className="text-xs text-slate-400 leading-relaxed">
              The requested trial specification or candidate dossier endpoint does not exist or has been archived per data retention protocols.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] font-mono text-slate-500">
            ERR_ROUTE_NOT_FOUND: target_node = null
          </div>

          <div className="pt-2">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Return to BuildCheck Home</span>
            </Link>
          </div>
        </div>
      </main>

      <footer className="border-t border-slate-900 py-4 px-6 text-center text-xs text-slate-600 font-mono">
        BuildCheck Enterprise • Verified Engineering Work Trials
      </footer>
    </div>
  );
}

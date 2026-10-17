'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { Code2, RotateCcw, ShieldAlert, ArrowLeft } from 'lucide-react';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('BuildCheck Runtime Error:', error);
  }, [error]);

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
          <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mx-auto text-rose-400">
            <ShieldAlert className="w-6 h-6" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-mono uppercase tracking-wider text-rose-400 font-bold">
              Runtime Circuit Breaker Active
            </span>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-100 tracking-tight">
              Execution Error Intercepted
            </h1>
            <p className="text-xs text-slate-400 leading-relaxed">
              An unexpected exception was caught in the telemetry stream. The isolated sandbox state has been preserved.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] font-mono text-rose-400 text-left overflow-x-auto max-h-24">
            {error.message || 'Unknown runtime error occurred.'}
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={() => reset()}
              className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retry Session</span>
            </button>

            <Link
              href="/"
              className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-300 font-semibold text-xs border border-slate-800 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return Home</span>
            </Link>
          </div>
        </div>
      </main>

      <footer className="border-t border-slate-900 py-4 px-6 text-center text-xs text-slate-600 font-mono">
        BuildCheck Enterprise • Deterministic Sandbox Architecture
      </footer>
    </div>
  );
}

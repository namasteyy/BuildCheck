'use client';

import React, { useState } from 'react';
import {
  PlacementDrive,
  PlacementApplication,
  EnterpriseTab,
} from '../../types';
import {
  Building2,
  Briefcase,
  Users,
  CheckCircle2,
  Plus,
  Clock,
  FileCode,
  Award,
  Sparkles,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';

interface CompanyDrivesViewProps {
  drives: PlacementDrive[];
  applications: PlacementApplication[];
  onNavigateTab: (tab: EnterpriseTab) => void;
  onSelectCandidateForReview: (app: PlacementApplication) => void;
}

export const CompanyDrivesView: React.FC<CompanyDrivesViewProps> = ({
  drives,
  applications,
  onNavigateTab,
  onSelectCandidateForReview,
}) => {
  const { showToast } = useToast();
  const [selectedDriveId, setSelectedDriveId] = useState<string>(drives[0]?.id || 'drive-1');

  const selectedDrive = drives.find((d) => d.id === selectedDriveId) || drives[0];
  const driveApplications = applications.filter((app) => app.driveId === selectedDrive?.id);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold text-base">
            <Briefcase className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-100">
                Campus Placement Drives &amp; Work Trials
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                Razorpay Labs &bull; IIIT Delhi
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Active campus drives with integrated 90-minute BuildCheck sandboxed coding trials and RazorpayX escrow.
            </p>
          </div>
        </div>

        <button
          onClick={() => onNavigateTab('scoper')}
          className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors cursor-pointer flex items-center gap-2 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Scope New Drive with AI</span>
        </button>
      </div>

      {/* Main Grid: Left Drives List, Right Applicants for Selected Drive */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Drives List (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono px-1">
            Active Placement Drives ({drives.length})
          </h3>

          <div className="space-y-2.5">
            {drives.map((drive) => {
              const isSelected = drive.id === selectedDrive?.id;
              const appCount = applications.filter((a) => a.driveId === drive.id).length;

              return (
                <div
                  key={drive.id}
                  onClick={() => setSelectedDriveId(drive.id)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-slate-900 border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.08)]'
                      : 'bg-slate-950 border-slate-800 hover:border-slate-700/80'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-xs font-bold text-slate-100 block leading-snug">
                        {drive.roleTitle}
                      </span>
                      <span className="text-[11px] text-emerald-400 font-mono block mt-0.5">
                        {drive.stipendOrPackage}
                      </span>
                    </div>

                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800 shrink-0">
                      {appCount} Applicants
                    </span>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-slate-850 flex items-center justify-between text-[11px] text-slate-500">
                    <span>Cutoff: CGPA {drive.criteriaCgpa}</span>
                    <span className="text-emerald-400 font-medium font-mono">₹{drive.trialStipend.toLocaleString('en-IN')} Stipend</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Applicants & EVS Submissions (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
          <div className="p-5 border-b border-slate-800 flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-100">
                  {selectedDrive?.roleTitle}
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  {selectedDrive?.status}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Criteria: Min CGPA {selectedDrive?.criteriaCgpa} &bull; Branches: {selectedDrive?.criteriaBranches.join(', ')}
              </p>
            </div>

            <div className="text-right shrink-0">
              <span className="text-[10px] text-slate-500 uppercase block font-mono">Work Trial</span>
              <span className="text-xs font-bold text-emerald-400 font-mono">₹{selectedDrive?.trialStipend.toLocaleString('en-IN')} Escrow</span>
            </div>
          </div>

          {/* Applicants Table */}
          <div className="p-5 space-y-3">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">
              Student Submissions ({driveApplications.length})
            </h4>

            {driveApplications.length === 0 ? (
              <div className="p-6 rounded-xl bg-slate-950 border border-slate-800 text-center text-xs text-slate-500">
                No students have submitted work trials for this drive yet.
              </div>
            ) : (
              <div className="space-y-2.5">
                {driveApplications.map((app) => (
                  <div
                    key={app.id}
                    className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:border-slate-700 transition-colors"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-100 text-xs sm:text-sm">
                          {app.studentName}
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">
                          ({app.studentRollNo})
                        </span>
                        <span className="text-[10px] font-mono font-bold px-2 py-0.2 rounded bg-slate-900 text-emerald-400 border border-slate-800">
                          CGPA: {app.studentCgpa}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1">
                        {app.studentDepartment} &bull; Applied: {app.dateApplied}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      {app.evsScore ? (
                        <div className="text-right font-mono">
                          <span className="text-xs font-bold text-emerald-400 block">
                            EVS: {app.evsScore}/100
                          </span>
                          <span className="text-[10px] text-slate-500">
                            {app.testPassRate}
                          </span>
                        </div>
                      ) : (
                        <span className="text-xs text-amber-400 font-mono">
                          In Sandbox
                        </span>
                      )}

                      <button
                        onClick={() => {
                          onSelectCandidateForReview(app);
                          onNavigateTab('sandbox');
                        }}
                        className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors cursor-pointer flex items-center gap-1"
                      >
                        <span>Review Dossier</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

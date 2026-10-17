'use client';

import React, { useState } from 'react';
import {
  PlacementDrive,
  PlacementApplication,
  StudentPlacementProfile,
} from '../../types';
import {
  Building2,
  CheckCircle2,
  Clock,
  GraduationCap,
  FileCode,
  Award,
  Filter,
  Search,
  ExternalLink,
  ShieldCheck,
  Play,
  Briefcase,
  AlertCircle,
  User,
  Sparkles,
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';

interface StudentDrivesViewProps {
  student: StudentPlacementProfile;
  drives: PlacementDrive[];
  applications: PlacementApplication[];
  onApplyAndLaunchTrial: (drive: PlacementDrive) => void;
  onOpenExistingTrial: (challengeKey: 'reconcile' | 'rate_limiter' | 'janitor') => void;
}

export const StudentDrivesView: React.FC<StudentDrivesViewProps> = ({
  student,
  drives,
  applications,
  onApplyAndLaunchTrial,
  onOpenExistingTrial,
}) => {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<'drives' | 'applied' | 'profile'>('drives');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBranch, setSelectedBranch] = useState<string>('ALL');

  // Filter approved drives
  const approvedDrives = drives.filter((d) => d.status === 'Approved');

  const filteredDrives = approvedDrives.filter((drive) => {
    const matchesSearch =
      drive.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      drive.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      drive.roleTitle.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesBranch =
      selectedBranch === 'ALL' || drive.criteriaBranches.includes(selectedBranch);
    return matchesSearch && matchesBranch;
  });

  const getApplicationForDrive = (driveId: string) => {
    return applications.find(
      (app) => app.driveId === driveId && app.studentId === student.id
    );
  };

  const isStudentEligible = (drive: PlacementDrive) => {
    return student.cgpa >= drive.criteriaCgpa;
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Student Welcome & Placement Status Banner */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold text-base">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-lg font-bold text-slate-100">{student.name}</h2>
              <span className="text-xs text-slate-400 font-mono">({student.rollNo})</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold font-mono bg-slate-800 text-slate-300 border border-slate-700">
                CGPA: {student.cgpa}
              </span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                student.status === 'Placed'
                  ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                  : 'bg-blue-500/15 text-blue-300 border border-blue-500/30'
              }`}>
                {student.status === 'Placed' ? `Placed at ${student.placedCompany}` : 'Campus Placements Active'}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              {student.department} &bull; B.Tech &apos;26 &bull; IIIT Delhi Placement Cell
            </p>
          </div>
        </div>

        {/* Quick Nav Tabs */}
        <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 w-full md:w-auto">
          <button
            onClick={() => setActiveTab('drives')}
            className={`flex-1 md:flex-initial px-4 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer flex items-center justify-center gap-2 ${
              activeTab === 'drives'
                ? 'bg-emerald-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>Placement Drives ({approvedDrives.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('applied')}
            className={`flex-1 md:flex-initial px-4 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer flex items-center justify-center gap-2 ${
              activeTab === 'applied'
                ? 'bg-emerald-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>My Applications ({applications.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex-1 md:flex-initial px-4 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer flex items-center justify-center gap-2 ${
              activeTab === 'profile'
                ? 'bg-emerald-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>My Profile</span>
          </button>
        </div>
      </div>

      {/* TAB 1: PLACEMENT DRIVES */}
      {activeTab === 'drives' && (
        <div className="space-y-4">
          {/* Search & Filters */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-900 border border-slate-800 p-4 rounded-xl">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search company, role or skills..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-emerald-500/50"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
              <span className="text-[11px] text-slate-400 flex items-center gap-1 shrink-0">
                <Filter className="w-3 h-3" /> Branch:
              </span>
              {['ALL', 'CSE', 'ECE', 'IT', 'AI/DS'].map((b) => (
                <button
                  key={b}
                  onClick={() => setSelectedBranch(b)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono font-medium transition-colors cursor-pointer shrink-0 ${
                    selectedBranch === b
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-slate-200'
                  }`}
                >
                  {b}
                </button>
              ))}
            </div>
          </div>

          {/* Drives Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredDrives.map((drive) => {
              const existingApp = getApplicationForDrive(drive.id);
              const eligible = isStudentEligible(drive);

              return (
                <div
                  key={drive.id}
                  className="rounded-2xl bg-slate-900 border border-slate-800 p-5 flex flex-col justify-between space-y-4 hover:border-slate-700/80 transition-all"
                >
                  <div className="space-y-3">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                            <Building2 className="w-3.5 h-3.5" />
                            {drive.companyName}
                          </span>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                            {drive.criteriaDegree} &apos;{drive.criteriaYear.toString().slice(-2)}
                          </span>
                        </div>
                        <h3 className="text-sm font-bold text-slate-100 mt-1 leading-snug">
                          {drive.roleTitle}
                        </h3>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-[10px] text-slate-500 uppercase block font-mono">
                          Stipend / Package
                        </span>
                        <span className="text-xs font-bold text-emerald-400 font-mono">
                          {drive.stipendOrPackage}
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
                      {drive.description}
                    </p>

                    {/* Criteria & Badges */}
                    <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                      <div className="p-2 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
                        <span className="text-slate-400">Min CGPA:</span>
                        <span className={`font-mono font-bold ${eligible ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {drive.criteriaCgpa} {eligible ? '(Eligible)' : '(Ineligible)'}
                        </span>
                      </div>
                      <div className="p-2 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
                        <span className="text-slate-400">Branches:</span>
                        <span className="font-mono text-slate-200 truncate ml-1">
                          {drive.criteriaBranches.join(', ')}
                        </span>
                      </div>
                    </div>

                    {/* Attached BuildCheck Challenge */}
                    <div className="p-2.5 rounded-xl bg-emerald-950/20 border border-emerald-500/20 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 min-w-0">
                        <FileCode className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span className="text-slate-200 font-medium truncate">
                          Trial: {drive.associatedChallengeTitle}
                        </span>
                      </div>
                      <span className="text-emerald-400 font-bold font-mono text-[11px] shrink-0 ml-2">
                        ₹{drive.trialStipend.toLocaleString('en-IN')} Stipend
                      </span>
                    </div>
                  </div>

                  {/* Footer Actions */}
                  <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-1.5 text-slate-500 font-mono text-[11px]">
                      <Clock className="w-3.5 h-3.5" />
                      <span>Deadline: {drive.deadline}</span>
                    </div>

                    {existingApp ? (
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                          {existingApp.status}
                        </span>
                        <button
                          onClick={() => onOpenExistingTrial(drive.challengeKey)}
                          className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium transition-colors cursor-pointer flex items-center gap-1"
                        >
                          <Play className="w-3 h-3 fill-current text-emerald-400" />
                          <span>Open Trial</span>
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          if (!eligible) {
                            showToast('Eligibility Alert', `Requires min CGPA of ${drive.criteriaCgpa}. Your CGPA is ${student.cgpa}.`, 'warn');
                            return;
                          }
                          onApplyAndLaunchTrial(drive);
                        }}
                        disabled={!eligible}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
                          eligible
                            ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950'
                            : 'bg-slate-800 text-slate-500 cursor-not-allowed opacity-60'
                        }`}
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Apply &amp; Launch Trial (₹{drive.trialStipend.toLocaleString('en-IN')})</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: MY APPLICATIONS */}
      {activeTab === 'applied' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Placement Drive Applications &amp; Work Trials</span>
            </h3>
            <span className="text-xs text-slate-400 font-mono">
              {applications.length} Drives Applied
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800 font-mono">
                <tr>
                  <th className="px-5 py-3">Company &amp; Role</th>
                  <th className="px-5 py-3">Applied Date</th>
                  <th className="px-5 py-3">Work Trial Telemetry</th>
                  <th className="px-5 py-3">Application Status</th>
                  <th className="px-5 py-3 text-right">Trial Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {applications.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-850/50 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="font-bold text-slate-100">{app.companyName}</div>
                      <div className="text-[11px] text-slate-400">{app.roleTitle}</div>
                    </td>
                    <td className="px-5 py-3.5 font-mono text-slate-400">
                      {app.dateApplied}
                    </td>
                    <td className="px-5 py-3.5">
                      {app.evsScore ? (
                        <div>
                          <span className="font-bold font-mono text-emerald-400">
                            EVS: {app.evsScore}/100
                          </span>
                          <span className="text-[10px] text-slate-400 block">
                            {app.testPassRate}
                          </span>
                        </div>
                      ) : (
                        <span className="text-slate-500 font-mono text-[11px]">
                          Pending submission
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold inline-flex items-center gap-1.5 ${
                        app.status === 'Offer Extended'
                          ? 'bg-blue-500/15 text-blue-300 border border-blue-500/30'
                          : app.status === 'Verified (100% Passed)'
                          ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                          : 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                      }`}>
                        <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                        {app.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <button
                        onClick={() => onOpenExistingTrial('reconcile')}
                        className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs transition-colors cursor-pointer inline-flex items-center gap-1.5"
                      >
                        <Play className="w-3 h-3 fill-current text-emerald-400" />
                        <span>Launch Sandbox</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: STUDENT PROFILE */}
      {activeTab === 'profile' && (
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-base font-bold text-slate-100">
                Official Placement Profile
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Verified academic records synced with IIIT Delhi Academic Registry.
              </p>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Verified Student
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-slate-400 text-[11px] block uppercase font-mono">Full Name</span>
              <span className="font-bold text-slate-100 text-sm">{student.name}</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-slate-400 text-[11px] block uppercase font-mono">Roll Number</span>
              <span className="font-bold text-slate-100 text-sm font-mono">{student.rollNo}</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-slate-400 text-[11px] block uppercase font-mono">Department &amp; Degree</span>
              <span className="font-bold text-slate-100 text-sm">{student.department} ({student.degree})</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-slate-400 text-[11px] block uppercase font-mono">Cumulative GPA</span>
              <span className="font-bold text-emerald-400 text-sm font-mono">{student.cgpa} / 10.0</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-slate-400 text-[11px] block uppercase font-mono">Institutional Email</span>
              <span className="font-bold text-slate-100 font-mono">{student.email}</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-slate-400 text-[11px] block uppercase font-mono">Verified Resume</span>
              <a
                href={student.resumeLink}
                target="_blank"
                rel="noreferrer"
                className="text-emerald-400 hover:text-emerald-300 font-medium inline-flex items-center gap-1.5"
              >
                <span>View Stored PDF Resume</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <span className="text-slate-400 text-[11px] block uppercase font-mono">Verified Engineering Competencies</span>
            <div className="flex flex-wrap gap-2">
              {student.skills.map((skill) => (
                <span
                  key={skill}
                  className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-200 font-mono"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

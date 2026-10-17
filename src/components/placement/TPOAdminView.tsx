'use client';

import React, { useState } from 'react';
import {
  PlacementDrive,
  CompanyPlacementProfile,
  StudentPlacementProfile,
  TPOPlacementStats,
} from '../../types';
import {
  Building2,
  CheckCircle2,
  XCircle,
  GraduationCap,
  Users,
  Briefcase,
  TrendingUp,
  Download,
  Search,
  Filter,
  Check,
  Award,
  ShieldCheck,
  FileText,
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';

interface TPOAdminViewProps {
  stats: TPOPlacementStats;
  drives: PlacementDrive[];
  students: StudentPlacementProfile[];
  companies: CompanyPlacementProfile[];
  onApproveDrive: (driveId: string) => void;
  onRejectDrive: (driveId: string) => void;
  onApproveCompany: (companyId: string) => void;
}

export const TPOAdminView: React.FC<TPOAdminViewProps> = ({
  stats,
  drives,
  students,
  companies,
  onApproveDrive,
  onRejectDrive,
  onApproveCompany,
}) => {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<'overview' | 'drives' | 'companies' | 'roster'>('overview');
  const [studentSearch, setStudentSearch] = useState('');
  const [branchFilter, setBranchFilter] = useState('ALL');

  const pendingDrives = drives.filter((d) => d.status === 'Pending');
  const pendingCompanies = companies.filter((c) => c.status === 'Pending');

  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(studentSearch.toLowerCase()) ||
      s.rollNo.includes(studentSearch) ||
      s.department.toLowerCase().includes(studentSearch.toLowerCase());
    const matchesBranch =
      branchFilter === 'ALL' ||
      s.department.toLowerCase().includes(branchFilter.toLowerCase());
    return matchesSearch && matchesBranch;
  });

  const handleExportCSV = () => {
    const headers = 'RollNo,Name,Department,CGPA,Status,PlacedCompany,Package\n';
    const rows = students
      .map(
        (s) =>
          `"${s.rollNo}","${s.name}","${s.department}",${s.cgpa},"${s.status}","${
            s.placedCompany || 'N/A'
          }","${s.packageOffered || 'N/A'}"`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `IIITD_Placement_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Report Exported', 'Downloaded IIIT Delhi campus placement CSV report.', 'success');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* TPO Header Banner */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 font-bold text-base">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-100">
                Training &amp; Placement Office (TPO) Console
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono bg-blue-500/10 text-blue-300 border border-blue-500/30">
                IIIT Delhi &bull; 2025-26 Season
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Admin: <strong>Dr. Rajesh Sharma</strong> &bull; Head of Placements &amp; Corporate Relations
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <button
            onClick={handleExportCSV}
            className="w-full md:w-auto px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 font-semibold text-xs border border-slate-700 transition-colors cursor-pointer flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4 text-emerald-400" />
            <span>Export Placement Report (CSV)</span>
          </button>
        </div>
      </div>

      {/* 4 Stat KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-[11px] text-slate-400 uppercase font-mono block">Placement Rate</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-emerald-400 font-mono">
              {stats.placementRatePct}%
            </span>
            <span className="text-[11px] text-slate-500">
              ({stats.placedStudents}/{stats.totalStudents} Students)
            </span>
          </div>
          <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden mt-2">
            <div
              className="bg-emerald-400 h-full rounded-full"
              style={{ width: `${stats.placementRatePct}%` }}
            ></div>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-[11px] text-slate-400 uppercase font-mono block">Average Package</span>
          <span className="text-2xl font-bold text-slate-100 font-mono">
            {stats.averagePackage}
          </span>
          <span className="text-[11px] text-slate-500 block">
            Highest: <strong className="text-emerald-400 font-mono">{stats.highestPackage}</strong>
          </span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-[11px] text-slate-400 uppercase font-mono block">Registered Companies</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-100 font-mono">
              {companies.length}
            </span>
            {pendingCompanies.length > 0 && (
              <span className="text-[10px] text-amber-400 font-mono bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 font-bold">
                {pendingCompanies.length} Pending
              </span>
            )}
          </div>
          <span className="text-[11px] text-slate-500 block">
            {stats.activeDrives} Active Drives Approved
          </span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-[11px] text-slate-400 uppercase font-mono block">Work Trial Stipends</span>
          <span className="text-2xl font-bold text-emerald-400 font-mono">
            ₹{stats.totalStipendDisbursed.toLocaleString('en-IN')}
          </span>
          <span className="text-[11px] text-slate-500 block">
            RazorpayX Direct-to-Student Payouts
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer flex items-center gap-2 ${
            activeTab === 'overview'
              ? 'bg-slate-800 text-slate-100 border border-slate-700'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <TrendingUp className="w-3.5 h-3.5" />
          <span>Dashboard Overview</span>
        </button>

        <button
          onClick={() => setActiveTab('drives')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer flex items-center gap-2 ${
            activeTab === 'drives'
              ? 'bg-slate-800 text-slate-100 border border-slate-700'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Briefcase className="w-3.5 h-3.5" />
          <span>Drive Approvals</span>
          {pendingDrives.length > 0 && (
            <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-amber-500 text-slate-950 font-bold">
              {pendingDrives.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('companies')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer flex items-center gap-2 ${
            activeTab === 'companies'
              ? 'bg-slate-800 text-slate-100 border border-slate-700'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Building2 className="w-3.5 h-3.5" />
          <span>Company Partners</span>
          {pendingCompanies.length > 0 && (
            <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-amber-500 text-slate-950 font-bold">
              {pendingCompanies.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('roster')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer flex items-center gap-2 ${
            activeTab === 'roster'
              ? 'bg-slate-800 text-slate-100 border border-slate-700'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Batch Student Roster ({students.length})</span>
        </button>
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Pending Actions */}
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-amber-400" />
                  <span>Pending Placement Drive Approvals</span>
                </h3>
                <span className="text-xs text-slate-400 font-mono">
                  {pendingDrives.length} Pending
                </span>
              </div>

              {pendingDrives.length === 0 ? (
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 text-center text-xs text-slate-500">
                  All submitted placement drives are approved.
                </div>
              ) : (
                pendingDrives.map((drive) => (
                  <div
                    key={drive.id}
                    className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-100 text-xs sm:text-sm">
                          {drive.companyName} &bull; {drive.roleTitle}
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 font-bold">
                          PENDING_APPROVAL
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1">
                        Package: <strong className="text-slate-200">{drive.stipendOrPackage}</strong> &bull; Min CGPA: {drive.criteriaCgpa} &bull; Deadline: {drive.deadline}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => onApproveDrive(drive.id)}
                        className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors cursor-pointer flex items-center gap-1"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Approve Drive</span>
                      </button>
                      <button
                        onClick={() => onRejectDrive(drive.id)}
                        className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-rose-950/40 text-slate-400 hover:text-rose-400 border border-slate-800 text-xs transition-colors cursor-pointer"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Active Drives Summary */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
              <h3 className="text-sm font-bold text-slate-100">
                Live Approved Placement Drives ({drives.filter((d) => d.status === 'Approved').length})
              </h3>
              <div className="space-y-2">
                {drives.filter((d) => d.status === 'Approved').slice(0, 3).map((drive) => (
                  <div
                    key={drive.id}
                    className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-bold text-slate-200">{drive.companyName}</span>
                      <span className="text-slate-400 block text-[11px]">{drive.roleTitle}</span>
                    </div>
                    <div className="text-right font-mono">
                      <span className="text-emerald-400 font-bold">{drive.stipendOrPackage}</span>
                      <span className="text-[10px] text-slate-500 block">{drive.applicantsCount} Applicants</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Placement Statistics by Branch */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-emerald-400" />
                <span>Departmental Placement Highlights</span>
              </h3>

              <div className="space-y-3 text-xs">
                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-slate-300 font-medium">Computer Science (CSE)</span>
                    <span className="font-mono text-emerald-400 font-bold">88.4% Placed</span>
                  </div>
                  <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden">
                    <div className="bg-emerald-400 h-full w-[88.4%]"></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-slate-300 font-medium">Artificial Intelligence &amp; Data (AI/DS)</span>
                    <span className="font-mono text-emerald-400 font-bold">82.1% Placed</span>
                  </div>
                  <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden">
                    <div className="bg-emerald-400 h-full w-[82.1%]"></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-slate-300 font-medium">Electronics &amp; Communication (ECE)</span>
                    <span className="font-mono text-emerald-400 font-bold">71.0% Placed</span>
                  </div>
                  <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden">
                    <div className="bg-emerald-400 h-full w-[71%]"></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-slate-300 font-medium">CS &amp; Applied Mathematics (CSAM)</span>
                    <span className="font-mono text-emerald-400 font-bold">76.5% Placed</span>
                  </div>
                  <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden">
                    <div className="bg-emerald-400 h-full w-[76.5%]"></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/20 space-y-2 text-xs">
              <div className="flex items-center gap-2 font-bold text-emerald-400">
                <ShieldCheck className="w-4 h-4" />
                <span>BuildCheck Verified Placement Protocol</span>
              </div>
              <p className="text-slate-400 leading-relaxed text-[11px]">
                Students participate in 90-minute sandboxed work trials with zero LeetCode trivia. RazorpayX automatically disburses guaranteed trial stipends directly into verified student bank accounts.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: DRIVE APPROVALS */}
      {activeTab === 'drives' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-100">
              All Placement Drives Management ({drives.length})
            </h3>
          </div>

          <div className="space-y-3">
            {drives.map((drive) => (
              <div
                key={drive.id}
                className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-slate-100 text-sm">
                      {drive.companyName} &bull; {drive.roleTitle}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                      drive.status === 'Approved'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    }`}>
                      {drive.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Stipend: <strong className="text-slate-200">{drive.stipendOrPackage}</strong> &bull; Cutoff CGPA: {drive.criteriaCgpa} &bull; Branches: {drive.criteriaBranches.join(', ')}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Associated Work Trial: {drive.associatedChallengeTitle} (₹{drive.trialStipend.toLocaleString('en-IN')} Stipend)
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {drive.status === 'Pending' ? (
                    <>
                      <button
                        onClick={() => onApproveDrive(drive.id)}
                        className="px-3.5 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors cursor-pointer"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => onRejectDrive(drive.id)}
                        className="px-3.5 py-1.5 rounded-lg bg-slate-900 text-rose-400 hover:bg-rose-950/40 border border-slate-800 text-xs transition-colors cursor-pointer"
                      >
                        Reject
                      </button>
                    </>
                  ) : (
                    <span className="text-xs text-emerald-400 font-mono">
                      Live to Students &bull; {drive.applicantsCount} Applied
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: COMPANIES */}
      {activeTab === 'companies' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <h3 className="text-sm font-bold text-slate-100">
            Registered Corporate Recruiters ({companies.length})
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {companies.map((comp) => (
              <div
                key={comp.id}
                className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-100 text-sm">{comp.name}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                      comp.status === 'Approved'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    }`}>
                      {comp.status}
                    </span>
                  </div>
                  <span className="text-xs text-emerald-400 font-mono block">{comp.industry}</span>
                  <p className="text-xs text-slate-400 line-clamp-2">{comp.description}</p>
                </div>

                <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs text-slate-500">
                  <span>{comp.contactEmail}</span>
                  {comp.status === 'Pending' && (
                    <button
                      onClick={() => onApproveCompany(comp.id)}
                      className="px-3 py-1 rounded bg-emerald-500 text-slate-950 font-bold text-xs cursor-pointer hover:bg-emerald-400"
                    >
                      Verify Company
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: BATCH ROSTER */}
      {activeTab === 'roster' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden space-y-0">
          <div className="p-4 border-b border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search student by name or roll..."
                value={studentSearch}
                onChange={(e) => setStudentSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-mono">Total Roster: {filteredStudents.length}</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800 font-mono">
                <tr>
                  <th className="px-5 py-3">Roll No &amp; Student</th>
                  <th className="px-5 py-3">Department</th>
                  <th className="px-5 py-3">CGPA</th>
                  <th className="px-5 py-3">Placement Status</th>
                  <th className="px-5 py-3 text-right">Offer Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {filteredStudents.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-850/50 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="font-bold text-slate-100">{s.name}</div>
                      <span className="text-[11px] font-mono text-slate-400">{s.rollNo}</span>
                    </td>
                    <td className="px-5 py-3.5 text-slate-300">
                      {s.department}
                    </td>
                    <td className="px-5 py-3.5 font-mono font-bold text-emerald-400">
                      {s.cgpa}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                        s.status === 'Placed'
                          ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                          : s.status === 'In-Trial'
                          ? 'bg-blue-500/15 text-blue-300 border border-blue-500/30'
                          : 'bg-slate-800 text-slate-400 border border-slate-700'
                      }`}>
                        {s.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right font-mono">
                      {s.placedCompany ? (
                        <div>
                          <span className="font-bold text-slate-200">{s.placedCompany}</span>
                          <span className="text-[10px] text-emerald-400 block">{s.packageOffered}</span>
                        </div>
                      ) : (
                        <span className="text-slate-500 text-[11px]">Active in Pipeline</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

'use client';

import React, { useState } from 'react';
import {
  Building2,
  User,
  X,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Lock,
  Code2,
  Briefcase,
  CheckCircle2,
  GraduationCap,
  Award,
} from 'lucide-react';
import { CANDIDATE_PROFILES } from '@/data/mockData';

interface AccessGatewayModalProps {
  isOpen: boolean;
  initialRole?: 'recruiter' | 'candidate' | 'tpo_admin';
  onClose: () => void;
  onSelectRole: (role: 'recruiter' | 'candidate' | 'tpo_admin', candidateId?: string, orgName?: string) => void;
}

const RECRUITER_ORGS = [
  { name: 'Razorpay Labs', email: 'aditya.rao@razorpay.com', focus: 'Core Payments & Settlements', escrow: 150000 },
  { name: 'Swiggy Core Infra', email: 'vikram.m@swiggy.in', focus: 'Distributed Real-Time Systems', escrow: 250000 },
  { name: 'Zerodha Tech', email: 'infra.lead@zerodha.tech', focus: 'Low-Latency FinTech & SRE', escrow: 180000 },
];

export const AccessGatewayModal: React.FC<AccessGatewayModalProps> = ({
  isOpen,
  initialRole = 'recruiter',
  onClose,
  onSelectRole,
}) => {
  const [activeTab, setActiveTab] = useState<'recruiter' | 'candidate' | 'tpo_admin'>(initialRole);
  const [selectedOrg, setSelectedOrg] = useState(RECRUITER_ORGS[0]);
  const [workEmail, setWorkEmail] = useState(RECRUITER_ORGS[0].email);
  const [tokenInput, setTokenInput] = useState('inv_8x92fa1');
  const [selectedCandId, setSelectedCandId] = useState('cand-1');

  React.useEffect(() => {
    if (initialRole) {
      setActiveTab(initialRole);
    }
  }, [initialRole, isOpen]);

  if (!isOpen) return null;

  const handleRecruiterSubmit = () => {
    onSelectRole('recruiter', undefined, selectedOrg.name);
  };

  const handleCandidateSubmit = (candId?: string) => {
    const id = candId || selectedCandId;
    onSelectRole('candidate', id, undefined);
  };

  const handleTPOSubmit = () => {
    onSelectRole('tpo_admin', undefined, undefined);
  };

  const handleTokenChange = (token: string) => {
    setTokenInput(token);
    const t = token.toLowerCase();
    if (t.includes('priya') || t.includes('k8s') || t.includes('cloud')) {
      setSelectedCandId('cand-2');
    } else if (t.includes('aarav') || t.includes('sys') || t.includes('go')) {
      setSelectedCandId('cand-3');
    } else if (t.includes('ananya') || t.includes('apm') || t.includes('pm')) {
      setSelectedCandId('cand-4');
    } else {
      setSelectedCandId('cand-1');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-100 p-1.5 rounded-lg bg-slate-850 hover:bg-slate-800 transition-colors z-10 cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="p-6 bg-slate-950/80 border-b border-slate-800 space-y-1.5">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center">
              <Code2 className="w-3.5 h-3.5 text-emerald-400 stroke-[2.5]" />
            </div>
            <span className="text-xs font-bold text-slate-100 uppercase tracking-wider font-mono">
              BuildCheck Access Gateway
            </span>
          </div>
          <h2 className="text-lg font-bold text-slate-100 tracking-tight">
            Sign In to Your Workspace
          </h2>
          <p className="text-xs text-slate-400">
            Select your role or use 1-click verified intern &amp; recruiter demo presets to enter.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="p-2 bg-slate-950 border-b border-slate-800 flex items-center gap-1.5">
          <button
            onClick={() => setActiveTab('recruiter')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'recruiter'
                ? 'bg-slate-800 text-slate-100 border border-slate-700 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Building2 className={`w-3.5 h-3.5 ${activeTab === 'recruiter' ? 'text-emerald-400' : 'text-slate-400'}`} />
            <span>Recruiter</span>
          </button>

          <button
            onClick={() => setActiveTab('candidate')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'candidate'
                ? 'bg-slate-800 text-slate-100 border border-slate-700 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <GraduationCap className={`w-3.5 h-3.5 ${activeTab === 'candidate' ? 'text-emerald-400' : 'text-slate-400'}`} />
            <span>Student</span>
          </button>

          <button
            onClick={() => setActiveTab('tpo_admin')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'tpo_admin'
                ? 'bg-slate-800 text-slate-100 border border-slate-700 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Award className={`w-3.5 h-3.5 ${activeTab === 'tpo_admin' ? 'text-blue-400' : 'text-slate-400'}`} />
            <span>TPO Admin</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 space-y-5">
          {activeTab === 'recruiter' ? (
            /* Recruiter Login Flow */
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="space-y-1.5">
                <label className="text-xs text-slate-400 font-semibold">
                  Select Organization Preset:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {RECRUITER_ORGS.map((org) => (
                    <button
                      key={org.name}
                      type="button"
                      onClick={() => {
                        setSelectedOrg(org);
                        setWorkEmail(org.email);
                      }}
                      className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                        selectedOrg.name === org.name
                          ? 'bg-slate-800 border-emerald-500/50 text-slate-100 shadow-sm'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <span className="font-bold text-xs block truncate">{org.name}</span>
                      <span className="text-[10px] text-emerald-400 font-mono block mt-0.5">₹{(org.escrow / 1000).toLocaleString('en-IN')}k Escrow</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-slate-400 font-semibold">
                  Corporate Work Email:
                </label>
                <input
                  type="email"
                  value={workEmail}
                  onChange={(e) => setWorkEmail(e.target.value)}
                  placeholder="aditya.rao@razorpay.com"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-slate-700 font-mono"
                />
              </div>

              <button
                onClick={handleRecruiterSubmit}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors cursor-pointer"
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>Launch Recruiter Portal ({selectedOrg.name}) &rarr;</span>
              </button>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>RazorpayX Escrow Pre-Funding Active &bull; Fast-Track Placement Evaluation</span>
              </div>
            </div>
          ) : activeTab === 'candidate' ? (
            /* Candidate Intern Login Flow */
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="space-y-1.5">
                <label className="text-xs text-slate-400 font-semibold">
                  Select Candidate Internship Trial Profile:
                </label>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {CANDIDATE_PROFILES.map((cand) => (
                    <button
                      key={cand.id}
                      type="button"
                      onClick={() => {
                        setSelectedCandId(cand.id);
                        setTokenInput(cand.id === 'cand-1' ? 'inv_8x92fa1' : `inv_${cand.id}`);
                      }}
                      className={`w-full p-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                        selectedCandId === cand.id
                          ? 'bg-slate-800 border-emerald-500/50 text-slate-100 shadow-sm'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-7 h-7 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-[11px] font-bold text-emerald-400 shrink-0">
                          {cand.avatar}
                        </div>
                        <div className="truncate">
                          <span className="font-bold text-xs text-slate-200 block truncate">{cand.name}</span>
                          <span className="text-[10px] text-slate-500 block truncate">{cand.role} &bull; {cand.education.split('•')[1]?.trim() || cand.education}</span>
                        </div>
                      </div>
                      <span className="text-xs font-mono font-bold text-emerald-400 shrink-0 ml-2">
                        ₹{cand.bounty.toLocaleString('en-IN')} Stipend
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-slate-400 font-semibold">
                  Trial Invite Token / Magic Link:
                </label>
                <input
                  type="text"
                  value={tokenInput}
                  onChange={(e) => handleTokenChange(e.target.value)}
                  placeholder="inv_8x92fa1"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 font-mono placeholder:text-slate-600 focus:outline-none focus:border-slate-700"
                />
              </div>

              <button
                onClick={() => handleCandidateSubmit()}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors cursor-pointer"
              >
                <Briefcase className="w-3.5 h-3.5" />
                <span>Enter 90-Min Internship Work Trial &rarr;</span>
              </button>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>₹2,500 - ₹4,000 Trial Stipend Guaranteed Upon Verified Test Pass</span>
              </div>
            </div>
          ) : (
            /* TPO Admin Login Flow */
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-100">
                  <Building2 className="w-4 h-4 text-blue-400" />
                  <span>IIIT Delhi Training &amp; Placement Cell</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Authorized access for Placement Officers to approve company recruitment drives, verify recruiter credentials, track student placement percentages, and export batch reports.
                </p>
                <div className="pt-2 border-t border-slate-850 flex items-center justify-between text-[11px] text-slate-500 font-mono">
                  <span>Officer: Dr. Rajesh Sharma</span>
                  <span className="text-emerald-400">Head of TPO</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-slate-400 font-semibold">
                  Institutional Email:
                </label>
                <input
                  type="email"
                  readOnly
                  value="tpo.head@iiitd.ac.in"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-300 font-mono focus:outline-none"
                />
              </div>

              <button
                onClick={handleTPOSubmit}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-blue-500 hover:bg-blue-400 text-slate-950 font-bold text-xs transition-colors cursor-pointer"
              >
                <Award className="w-3.5 h-3.5" />
                <span>Launch TPO Admin Console &rarr;</span>
              </button>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-blue-400 shrink-0" />
                <span>Institutional Placement Cell Authorization &bull; 2025-26 Batch</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

'use client';

import React, { useState } from 'react';
import {
  ShieldCheck,
  Award,
  CheckCircle2,
  DollarSign,
  FileCheck,
  Download,
  ExternalLink,
  Lock,
  Building2,
  Calendar,
  Sparkles,
  Check,
} from 'lucide-react';
import { CandidateProfile } from '../../types';

interface EscrowSettlementViewProps {
  candidate: CandidateProfile;
  escrowDisbursed: boolean;
  onDisburseEscrow: () => void;
}

export const EscrowSettlementView: React.FC<EscrowSettlementViewProps> = ({
  candidate,
  escrowDisbursed,
  onDisburseEscrow,
}) => {
  const [showOfferDoc, setShowOfferDoc] = useState(escrowDisbursed);

  const handleDisburse = () => {
    onDisburseEscrow();
    setShowOfferDoc(true);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-emerald-400">
            <ShieldCheck className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-100 tracking-tight">
              Dual-Sided Escrow &amp; Fast-Track Offer Desk
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Automated dual-sided escrow settlement: upon passing deterministic test gates, trial compensation is released via Stripe Connect.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="text-right">
            <span className="text-[10px] text-slate-400 uppercase font-mono block">Escrow Vault</span>
            <span className="text-xs font-bold text-emerald-400 font-mono">
              {escrowDisbursed ? 'Bounty Disbursed' : '$1,200 Locked (4 Trials)'}
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid: Escrow Details & Offer Letter */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Escrow Disbursement Action (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <Award className="w-4 h-4 text-emerald-400" />
              <span>Candidate Settlement</span>
            </h3>
            <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              100% Passed
            </span>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-950 border border-slate-800">
              <div className="w-10 h-10 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center font-bold text-emerald-400 text-xs">
                {candidate.avatar}
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-100">{candidate.name}</h4>
                <p className="text-xs text-slate-400">{candidate.role} &bull; {candidate.handle}</p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Trial Compensation:</span>
                <span className="text-emerald-400 font-bold font-mono">${candidate.bounty}.00 USD</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Escrow Provider:</span>
                <span className="text-slate-300">Stripe Connect #ESC-9812-STP</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Deliverable Verification:</span>
                <span className="text-emerald-400 font-mono">18/18 Tests Passed (P99 1.42ms)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Disbursement Status:</span>
                <span className={escrowDisbursed ? 'text-emerald-400 font-bold' : 'text-amber-400 font-semibold'}>
                  {escrowDisbursed ? 'RELEASED TO CANDIDATE' : 'READY FOR RELEASE'}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={handleDisburse}
            disabled={escrowDisbursed}
            className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-xs transition-colors cursor-pointer ${
              escrowDisbursed
                ? 'bg-slate-800 text-emerald-400 border border-slate-700'
                : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950'
            }`}
          >
            {escrowDisbursed ? (
              <>
                <Check className="w-4 h-4 stroke-[3]" />
                <span>$150 Bounty Disbursed &amp; Offer Extended</span>
              </>
            ) : (
              <>
                <DollarSign className="w-4 h-4 stroke-[2.5]" />
                <span>Release $150 Escrow Bounty &amp; Extend Offer</span>
              </>
            )}
          </button>
        </div>

        {/* Right Column: Formal Offer Letter Document Preview (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-emerald-400" />
              <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                Formal Fast-Track Offer Package
              </h3>
            </div>
            <span className="text-[11px] font-mono text-slate-400">
              Ref: VF-OFFER-2026-9812
            </span>
          </div>

          {/* Letter Container */}
          <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 font-sans space-y-4 text-xs leading-relaxed">
            <div className="flex items-start justify-between border-b border-slate-800 pb-3">
              <div>
                <h4 className="font-bold text-sm text-slate-100">
                  Stripe Labs &bull; Core Payments Engineering
                </h4>
                <p className="text-[11px] text-slate-400">Autonomous Talent Verification Protocol</p>
              </div>
              <div className="text-right">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  OFFICIAL OFFER EXTENDED
                </span>
              </div>
            </div>

            <p>
              Dear <strong>{candidate.name}</strong>,
            </p>
            <p>
              Following your successful completion of the <strong>{candidate.taskName}</strong> sprint (18/18 automated test suites passed, zero security vulnerabilities, and 96/100 composite Senior Staff EVS score), we are pleased to extend a formal fast-track offer to join our engineering organization.
            </p>

            <div className="grid grid-cols-2 gap-3 p-3 rounded-lg bg-slate-900 border border-slate-800 text-xs">
              <div>
                <span className="text-[10px] text-slate-500 uppercase block">Position</span>
                <span className="font-bold text-slate-200">{candidate.role}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase block">Compensation</span>
                <span className="font-bold text-emerald-400">$48.00 / hour ($100k base)</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase block">Trial Bounty</span>
                <span className="font-bold text-slate-200 font-mono">$150.00 USD (Disbursed)</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase block">Start Date</span>
                <span className="font-bold text-slate-200">Flexible (Summer 2026)</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
              <span className="font-mono">SHA-256: 7f81a4b92c...01</span>
              <span className="text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>DocuSign Verified</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

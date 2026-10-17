'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import {
  FileCode,
  Play,
  RotateCcw,
  Sparkles,
  CheckCircle,
  Copy,
  Check,
  Terminal,
  FileText,
  ShieldAlert,
} from 'lucide-react';
import { RoleConfig, RoleType } from '../types';

// Dynamically import Monaco Editor to avoid SSR hydration issues in Next.js App Router
const Editor = dynamic(() => import('@monaco-editor/react'), {
  ssr: false,
  loading: () => (
    <div className="flex flex-col items-center justify-center h-full bg-slate-950 text-slate-400 text-xs font-mono space-y-2">
      <div className="w-5 h-5 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin"></div>
      <span>Initializing Monaco Editor...</span>
    </div>
  ),
});

interface WorkspacePanelProps {
  role: RoleConfig;
  activeRole: RoleType;
  onRunTest: (code: string) => void;
  isRunningTest: boolean;
}

const STARTER_CODE: Record<RoleType, {
  filename: string;
  topBarTitle: string;
  language: string;
  buttonLabel: string;
  buttonColorClass: string;
  buttonHoverClass: string;
  buttonLoadingClass: string;
  code: string;
}> = {
  swe: {
    filename: 'solution.py',
    topBarTitle: 'Sandboxed Workspace (solution.py)',
    language: 'python',
    buttonLabel: 'Run PyTest Suite & Submit',
    buttonColorClass: 'bg-emerald-500 text-slate-950 shadow-[0_0_15px_rgba(52,211,153,0.35)]',
    buttonHoverClass: 'hover:bg-emerald-400',
    buttonLoadingClass: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40',
    code: `def reconcile_invoices(invoices, payments):
    # TODO: Match invoice IDs where payment amount equals invoice amount
    matched_ids = []
    for inv in invoices:
        for pay in payments:
            if inv['id'] == pay['id'] and inv['amt'] == pay['paid']:
                matched_ids.append(inv['id'])
    return matched_ids
`,
  },
  pm: {
    filename: 'feature_spec.md',
    topBarTitle: 'PRD Workspace (feature_spec.md)',
    language: 'markdown',
    buttonLabel: 'Run AI Logic Rubric',
    buttonColorClass: 'bg-blue-500 text-white shadow-[0_0_15px_rgba(59,130,246,0.35)]',
    buttonHoverClass: 'hover:bg-blue-400',
    buttonLoadingClass: 'bg-blue-500/20 text-blue-300 border border-blue-500/40',
    code: `# Feature Specification: Autonomous Work-to-Match Protocol

## 1. Executive Summary & Problem
Enable enterprise hiring managers to evaluate candidates through automated, reproducible sandboxed work challenges rather than traditional resume screening.

## 2. User Stories
- **As a Technical Recruiter**, I want candidate work submissions to be scored automatically against role benchmarks so that our time-to-offer decreases by 60%.
- **As an Engineering Manager**, I want sandboxed chaos test results and pgvector embedding similarity so that I can evaluate true technical depth with zero bias.
- **As a Candidate**, I want an interactive, realistic developer environment so that I can demonstrate practical engineering skills.

## 3. Acceptance Criteria (Given / When / Then)
### Scenario 1: Automated Test Suite Execution
- **Given** a candidate has submitted their code in the sandboxed workspace,
- **When** the candidate clicks "Run PyTest Suite & Submit",
- **Then** the isolated sandbox executes within 3 seconds, returns pass/fail status, and computes vector distance.

### Scenario 2: JIT Environment Provisioning
- **Given** an enterprise evaluator views a candidate profile,
- **When** switching candidate sprint roles,
- **Then** the editor environment updates dynamically with specific role starter templates and language syntax highlighting.

## 4. Edge Cases & Resilience
- **Timeout Handling**: Terminate code execution if runtime exceeds 5,000ms.
- **Infinite Loop Protection**: Resource limits (1 CPU, 256MB RAM) enforced per container.
- **Tamper Evidence**: Hash candidate code submissions with SHA-256 upon verification.
`,
  },
  devops: {
    filename: 'deploy.yml',
    topBarTitle: 'CI/CD Pipeline Workspace (deploy.yml)',
    language: 'yaml',
    buttonLabel: 'Run Container Linter & Build',
    buttonColorClass: 'bg-amber-500 text-slate-950 shadow-[0_0_15px_rgba(245,158,11,0.35)]',
    buttonHoverClass: 'hover:bg-amber-400',
    buttonLoadingClass: 'bg-amber-500/20 text-amber-300 border border-amber-500/40',
    code: `name: Production Multi-Stage Build & Security Scan

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

env:
  REGISTRY: ghcr.io
  IMAGE_NAME: ventureforge/enterprise-worker

jobs:
  build-and-scan:
    name: Build Multi-Stage Container & Audit
    runs-on: ubuntu-latest
    permissions:
      contents: read
      security-events: write

    steps:
      - name: Checkout Code Repository
        uses: actions/checkout@v4

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3

      - name: Build Multi-Stage Docker Image
        uses: docker/build-push-action@v5
        with:
          context: .
          file: ./Dockerfile
          push: false
          tags: \${{ env.REGISTRY }}/\${{ env.IMAGE_NAME }}:\${{ github.sha }}
          load: true
          cache-from: type=gha
          cache-to: type=gha,mode=max

      - name: Run Trivy Vulnerability Scanner
        uses: aquasecurity/trivy-action@master
        with:
          image-ref: \${{ env.REGISTRY }}/\${{ env.IMAGE_NAME }}:\${{ github.sha }}
          format: 'table'
          exit-code: '1'
          ignore-unfixed: true
          vuln-type: 'os,library'
          severity: 'CRITICAL,HIGH'
`,
  },
};

export const WorkspacePanel: React.FC<WorkspacePanelProps> = ({
  role,
  activeRole,
  onRunTest,
  isRunningTest,
}) => {
  const [editorCodes, setEditorCodes] = useState<Record<RoleType, string>>({
    swe: STARTER_CODE.swe.code,
    pm: STARTER_CODE.pm.code,
    devops: STARTER_CODE.devops.code,
  });
  const [copied, setCopied] = useState(false);

  const currentConfig = STARTER_CODE[activeRole] || STARTER_CODE.swe;
  const currentCode = editorCodes[activeRole] ?? currentConfig.code;

  const handleCodeChange = (newVal: string | undefined) => {
    if (newVal !== undefined) {
      setEditorCodes((prev) => ({
        ...prev,
        [activeRole]: newVal,
      }));
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(currentCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="h-[620px] flex flex-col bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl shadow-slate-950/60">
      {/* Top Bar */}
      <div className="px-4 py-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between gap-3">
        {/* Left: Title & File Badge */}
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-300">
            {activeRole === 'swe' && <Terminal className="w-4 h-4 text-emerald-400" />}
            {activeRole === 'pm' && <FileText className="w-4 h-4 text-blue-400" />}
            {activeRole === 'devops' && <ShieldAlert className="w-4 h-4 text-amber-400" />}
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-100 flex items-center gap-2">
              <span>{currentConfig.topBarTitle}</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 font-mono">
                {currentConfig.language}
              </span>
            </h3>
            <p className="text-[11px] text-slate-400 truncate max-w-xs">
              {role.sprintName}
            </p>
          </div>
        </div>

        {/* Right: Dynamic Role Action Button */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 text-xs text-slate-400 hover:text-slate-200 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-lg transition-colors cursor-pointer"
            title="Copy current workspace code"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy</span>
              </>
            )}
          </button>

          <button
            onClick={() => onRunTest(currentCode)}
            disabled={isRunningTest}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              isRunningTest
                ? `${currentConfig.buttonLoadingClass} cursor-wait animate-pulse`
                : `${currentConfig.buttonColorClass} ${currentConfig.buttonHoverClass}`
            }`}
          >
            {isRunningTest ? (
              <>
                <RotateCcw className="w-3.5 h-3.5 animate-spin" />
                <span>Executing...</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>{currentConfig.buttonLabel}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Monaco Editor Container */}
      <div className="flex-1 min-h-0 bg-slate-950 relative">
        <Editor
          key={activeRole}
          height="100%"
          language={currentConfig.language}
          defaultLanguage={currentConfig.language}
          value={currentCode}
          onChange={handleCodeChange}
          theme="vs-dark"
          options={{
            fontSize: 12.5,
            fontFamily: 'var(--font-mono), monospace',
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            lineNumbers: 'on',
            renderLineHighlight: 'all',
            padding: { top: 12, bottom: 12 },
            automaticLayout: true,
            tabSize: 4,
            bracketPairColorization: { enabled: true },
            lineDecorationsWidth: 10,
            lineNumbersMinChars: 3,
          }}
          loading={
            <div className="flex flex-col items-center justify-center h-full bg-slate-950 text-slate-400 text-xs font-mono space-y-2">
              <div className="w-5 h-5 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin"></div>
              <span>Loading Monaco Editor...</span>
            </div>
          }
        />
      </div>

      {/* Verification Metrics Bar */}
      <div className="p-2.5 bg-slate-900 border-t border-slate-800">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {role?.metrics?.map((metric: any, i: number) => (
            <div
              key={i}
              className="px-2.5 py-1.5 rounded-lg bg-slate-950/80 border border-slate-800 flex items-center justify-between"
            >
              <div className="flex flex-col truncate pr-1">
                <span className="text-[10px] text-slate-400 uppercase tracking-wide truncate">
                  {metric.label}
                </span>
                <span className="text-xs font-bold text-slate-100 truncate">
                  {metric.value}
                </span>
              </div>
              <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

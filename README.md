# VentureForge Enterprise

**Autonomous Work-to-Match Protocol**

An enterprise candidate evaluation and telemetry platform powered by pgvector semantic similarity matching and automated sandboxed work-sample verification.

## Features

- **Enterprise Header**:
  - Brand header with live protocol indicators.
  - Interactive Role Switcher Tabs for Candidate Sprints:
    - *Backend Engineering Intern* (Golang / Redis / Concurrency)
    - *Product Management Intern* (Multi-Tenant Governance PRD / RBAC)
    - *DevOps / Infra Intern* (Terraform IaC / Kubernetes Ephemeral Clusters)
  - Candidate Match Pill: `Candidate: Leo M. (CS '26)` alongside glowing badge `94% Vector Match (pgvector)`.
- **2-Column Enterprise Layout (~620px height)**:
  - **Left Column**: Workspace Panel featuring active sprint work samples, code/spec tabs, and automated verification benchmarks.
  - **Right Column**: Live Sandbox Terminal & Telemetry Panel with interactive CLI and pgvector dimensional breakdown.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS (Dark Slate Palette: `bg-slate-950`, `surface slate-900`, `border slate-800`, `text-slate-100`, `emerald-400` accent)
- **Icons**: Lucide React
- **Language**: TypeScript

## Getting Started

```bash
# Install dependencies
npm install

# Start local development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

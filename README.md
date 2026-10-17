# BuildCheck & Campus Placement Portal

**Unified Work-Trial Matching Protocol & Campus Placement Platform**

BuildCheck is an institutional engineering hiring platform that unifies **Campus Placement Drives** with **Deterministic Sandboxed Work Trials**. It eliminates resume filtering and leetcode trivia in favor of 90-minute real-world engineering trials backed by **₹3,000 RazorpayX escrow stipends**.

---

## 🏛️ Unified Architecture

This project brings together the institutional workflows of the **Placement Portal Application** (IIIT Delhi Training & Placement Cell) and **BuildCheck's Autonomous Work Trial Protocol**:

### 1. Institute TPO Admin Console (IIIT Delhi)
- **Batch Placement Analytics**: Real-time KPI dashboard tracking batch placement rate (91.8%), highest package (₹54 LPA), and average package (₹21.6 LPA).
- **Drives Approval Desk**: Verification and approval/rejection queue for company recruitment drives (e.g., Groww, Razorpay Labs, Swiggy).
- **Company Accreditation**: Verification of recruiting partner credentials and compliance.
- **Student Roster & CSV Export**: Searchable roster of students, branch, CGPA, placement status, and 1-click placement report CSV export.

### 2. Student Campus Placement Portal
- **Drive Browser**: Real-time listing of active placement drives filtered by branch (CSE, ECE, IT, AI/DS) and minimum CGPA criteria.
- **Apply & Launch Work Trial**: 1-click application that immediately boots an isolated 90-minute coding trial sandbox.
- **My Applications**: Application tracking with live test pass rates, EVS scores, and stipend settlement confirmations.

### 3. Recruiter Enterprise Console
- **Campus Drives Tab**: Placement drive creation and applicant tracking.
- **Evaluation Dossier**: Real-time evaluation with deterministic Engineering Verification Score (EVS), Git diffs, and keystroke telemetry.
- **RazorpayX Escrow Desk**: Pre-funded escrow vaults that automatically release stipends to candidates upon passing test gates.

### 4. Cloned Placement Portal
- The original full-stack Placement Portal codebase is preserved in [`/placement-portal`](./placement-portal), containing the Flask backend, SQLite/SQLAlchemy models, Celery tasks, and Vue.js frontend.

---

## 🛠️ Tech Stack

- **Frontend & App Framework**: Next.js 16 (Turbopack, App Router)
- **Styling**: Tailwind CSS (Tailored Dark & Bright Mode with Glassmorphism)
- **Code Editor**: Monaco VS-Dark Editor integration
- **Sandbox Execution**: Python 3.10 Piston Container Runner API
- **Icons**: Lucide React
- **Language**: TypeScript & Python
- **Sub-repository**: Flask, SQLite, Celery, Vue.js (`/placement-portal`)

---

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to access the platform. Use the top navigation bar to switch between **Student**, **Recruiter**, and **TPO Admin** personas.

---

## 🧪 Production Build

```bash
npm run build
```
Builds cleanly with 0 TypeScript and Turbopack compilation errors.

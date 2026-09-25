# AnumatiOne (अनुमतिOne)
### Next-Generation Industrial Clearance & Compliance Operating System
**Smart India Hackathon 2024 | Problem Statement ID: 26130**  
**Organization:** Government of Maharashtra (Maharashtra State Innovation Society / Industries Dept / MAITRI)

---

## 🏛️ Executive Summary

**AnumatiOne** transforms Maharashtra's **MAITRI** (Maharashtra Industry, Trade and Investment Facilitation Cell) single-window portal from a passive document collector into an active, parallel approval optimizer. 

Under the **Maharashtra Right to Services (RTS) Act 2015**, AnumatiOne cuts statutory industrial clearance makespans from **240 days down to 78 days** (a **67.5% reduction**) through **Adversarial Path Optimization (DAG Concurrency)**, **Zero-Query AI Pre-Scrutiny**, and cross-departmental **MahaVault** document reuse.

---

## ⚡ The Three Core Pillars (SIH 26130 Aligned)

| Pillar | Problem Solved | AnumatiOne Innovation |
|---|---|---|
| **1. Streamlining Approvals** | Multi-department sequential dependency traps (MIDC → MPCB → DISH → MSEDCL → Fire) taking 240+ days | **Adversarial Path Optimizer (DAG Solver)** with Minimax Concurrency, scheduling 4 execution lanes simultaneously with automated Deemed Approvals under RTS Sec 4(1). |
| **2. Streamlining Compliance** | Repetitive annual filings, arbitrary notices, and fragmented site inspections | **Continuous Statutory Returns Calendar** (MPCB Form V, DISH Form 27), AI-powered NLP notice simplifier, and **Multi-Department Joint Site Visit Scheduler** (DISH + Fire + MPCB in a single 48h slot). |
| **3. Access to Support Services** | Industrialists unaware of state fiscal subsidies and taluka-specific benefits | **PSI 2019 / 2024 Incentive Calculator** with dynamic Zone A–D+ SGST reimbursement, stamp duty exemption, and power tariff subventions matched to project capital. |

---

## 🧠 Key Technical Innovations

1. **Adversarial Regulatory Digital Twin (DAG & Monte Carlo):**  
   Simulates all 11 state clearances, department friction points, and probabilistic delay distributions (log-normal Monte Carlo, $N=5,000$ iterations) before the entrepreneur submits a single document or spends capital.
2. **Zero-Query AI Pre-Scrutiny Audit:**  
   Pre-validates land titles, 27-prefix Maharashtra GSTIN, 10-character PAN, Udyam MSME numbers, and Zero Liquid Discharge (ZLD) mass balance equations before submission to prevent query ping-pong.
3. **MahaVault Inter-Departmental Scrutiny Shield (RTS Sec 3(2)):**  
   Once a foundational document (e.g. Registered MIDC Lease Deed) is validated by one department, it is locked in the DigiLocker MahaVault. Sister departments are legally barred from re-demanding physical verification.
4. **Statutory Two-Tier RTS Act 2015 Appeal Escalator:**  
   If an officer exceeds the statutory SLA timeline or issues arbitrary queries, industrialists can instantly auto-generate and file a **Section 18 First Appeal** or **Section 19 Second Appeal** (with ₹250/day officer penalty calculations under Section 19(8)).

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js >= 18.17.0
- npm >= 9.0.0

### Installation & Run

```bash
# 1. Install dependencies
npm install

# 2. Run the Next.js development server
npm run dev --workspace=apps/web

# 3. Open in browser
http://localhost:3000
```

### Running the Test Suite

```bash
# Run all 39 unit tests
npm test --workspace=apps/web
```

### Production Build

```bash
npm run build --workspace=apps/web
```

---

## 🗺️ Portal Navigation & Live Demo Routes

- **Landing Page (`/`):** Hero clearance comparator (240 vs 78 days), 4-stage lifecycle explorer, and 1-click persona scenario launcher.
- **KYA Wizard (`/portal/kya`):** Know Your Approvals — dynamic discovery of all required clearances and 11 state support schemes.
- **CAF Apply (`/portal/apply`):** Single-window Common Application Form with industrialist authentication and real-time AI Pre-Scrutiny.
- **Applications Sentinel (`/portal/applications`):** Live statutory countdown clocks, AI query responder, and digital clearance certificate vault.
- **Compliance Hub (`/portal/compliance`):** Statutory returns calendar (MPCB Form V, DISH Form 27) and NLP legal notice simplifier.
- **Incentives Navigator (`/portal/incentives`):** PSI 2019 Zone A–D+ fiscal calculator with 1-click entitlement claim.
- **Journey Map (`/portal/journey`):** Interactive D3.js parallel DAG visualizer with 4 Digital Twin scenario modes and friction shock injector.
- **What-If Policy Sandbox (`/portal/what-if`):** Comparative multi-scenario parameter modeling.
- **Officer Cockpit (`/officer`):** Priority scrutiny queue sorted by AI risk score and SLA deadline, with joint inspection scheduler.
- **RTS Legal Appeals (`/portal/grievances`):** Two-tier statutory appeal docket with auto-generated Form 1 legal memorandums.
- **EODB Dashboard (`/admin`):** State-wide macro Ease of Doing Business analytics and deemed approval metrics.

---

## 👥 Authors
Developed for **Smart India Hackathon 2024** by Team **AnumatiOne**.

# FieldDesk Advisor Hub

FieldDesk Advisor Hub is a creative, advisor-first web application for FPO officers, agronomists, and extension teams to manage farmer portfolios, generate soil-based recommendations, and track field outcomes.

## Vision

Instead of building directly for every farmer, FieldDesk equips the advisor with a decision cockpit:
- Prioritize the right farmers each day
- Convert soil test data into cost-optimized fertilizer plans
- Share actionable WhatsApp advisories in local context
- Measure recommendation outcomes and seasonal impact

## Team

- Naveen Raj B
- Arshiya Nasirin M
- Kabilan M
- Meganathan R
- Latchana S

## Product Modules

### 1) Intro and Story Experience
- Animated onboarding shown on every fresh app load
- Individual animated team member cards with roles
- Running real-world scenario animation
- One-click navigation from intro to key modules

### 2) Command Center (`/portfolio`)
- Creative KPI dashboard
- Priority queue with risk flags (green/yellow/red)
- Village health board and cost trend visuals
- WhatsApp dispatch workflow
- Open-Meteo weather integration for irrigation advisories

### 3) Portfolio Live (`/portfolio-live`)
- Filter and search farmer portfolio
- Add farmer workflow
- Status update controls and priority panel
- Demo/Live mode support

### 4) Farmer 360 View (`/farmer/:id`)
- Creative, easy-to-scan farmer intelligence layout
- Full profile details and editable metadata
- Crop playbook guidance, cluster context, and action prompts
- Soil history timeline and recommendation timeline
- Quick actions: soil test, recommendation, copy/call/reminder

### 5) Soil Intelligence (`/farmer/:id/soil`)
- Soil test input for N, P, K, pH, EC, organic matter
- Recommendation generation with cost optimization
- Cost comparison and expected yield range
- WhatsApp message generation and copy flow

### 6) Advisor Intelligence (`/insights`)
- Portfolio-level metrics
- Village health breakdown
- CSV export for pilot reporting
- POC validation snapshot

## Routing Overview

- `/` -> Intro flow
- `/portfolio` -> FPO Command Center
- `/portfolio-live` -> Portfolio dashboard
- `/insights` -> Advisor intelligence view
- `/farmer/:id` -> Farmer detail
- `/farmer/:id/soil` -> Soil intelligence and recommendation

## Data Modes

Global toggle in header:
- `Demo Data`: Uses local mock dataset and local interactions
- `Live Data`: Uses backend API endpoints

Default mode is `demo`.

## Mock Dataset Coverage

Current demo data includes:
- 12 farmers
- 12 soil tests
- 10 recommendations
- Multi-village distribution with mixed crop and risk status
- Timeline-ready timestamps for realistic simulation

## API Integration Surface

Frontend API client supports:
- Auth: register, login, current user
- Farmers: list, create, update, status update, priority list
- Soil: create test, latest test, test history
- Recommendations: generate, list by farmer, get by id, WhatsApp message, sent/confirm flags
- Stats: advisor-level stats

Base URL is configured with:
- `VITE_API_URL` (default: `http://localhost:8000/api/v1`)

## Tech Stack

- React 18 + TypeScript + Vite
- Tailwind CSS + shadcn/ui + Radix UI
- Framer Motion (animations)
- Recharts (data visualization)
- React Query
- Axios
- React Hook Form
- Sonner toasts

## Project Structure

```text
src/
  App.tsx
  contexts/
    DataModeContext.tsx
  lib/
    api.ts
    mockData.ts
  pages/
    LaunchIntroPage.tsx
    FPOCommandCenter.tsx
    PortfolioDashboard.tsx
    FarmerDetailPage.tsx
    SoilIntelligencePage.tsx
    AdvisorInsightsPage.tsx
```

## Getting Started

### Prerequisites
- Node.js 18+
- npm 9+

### Install

```bash
npm install
```

### Environment

Create `.env` from `.env.example` and set values as needed:

```env
VITE_API_URL=http://localhost:8000/api/v1
VITE_APP_NAME=FieldDesk
VITE_APP_DESCRIPTION=AI Soil Intelligence System for Agricultural Advisors
```

### Run (development)

```bash
npm run dev
```

### Build

```bash
npm run build
npm run preview
```

### Tests

```bash
npm run test
```

## Docker (frontend)

A frontend Dockerfile is included for containerized development/build flow.

```bash
docker build -t fielddesk-frontend .
docker run -p 5173:5173 fielddesk-frontend
```

## Operational Notes and Missing Data Analysis

### Included details now
- Intro and module storytelling with real-world scenario examples
- Rich Farmer 360 data blocks (profile, cluster, crop playbook, recommendations)
- End-to-end demo workflows when backend is unavailable

### Known gaps to address next
- Backend startup in local environment is currently failing in the provided terminal history; live mode depends on backend availability
- Auth endpoints exist in API client, but dedicated auth UI screens are not part of current advisor-hub routes
- Village naming in mock data has one spelling inconsistency (`Papireddipatti` vs `Pappireddipatti`) and should be normalized for analytics consistency
- Historical yield outcome capture per season is not yet persisted as a separate dataset

## Suggested Next Enhancements

- Add dedicated Weather Trends page per village
- Add input dealer inventory mapping to recommendation engine
- Add per-farmer seasonal yield history chart
- Add backend health indicator in app header for live/demo transparency

## License

Internal project workspace implementation.

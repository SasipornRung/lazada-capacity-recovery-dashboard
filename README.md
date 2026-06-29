# Recruitment Ads = Capacity Recovery System

Interactive logistics recruitment dashboard prototype built with React, TypeScript, Vite, Tailwind CSS, React-Leaflet, Recharts, and Lucide React.

The prototype frames recruitment ads as a capacity recovery system for logistics hubs. It calculates hub-level workforce gaps from operational workload, effective capacity, attrition buffer, and ramp-up buffer, then works backward from productive retained workers to estimate funnel volume and recommended ads budget.

## Run locally

```bash
npm install
npm run dev
```

Then open the local URL printed by Vite, usually:

```text
http://127.0.0.1:5173
```

## Build

```bash
npm run build
```

## Core formulas

Capacity need:

```text
workload = baselineVolume * campaignUplift * returnFactor
requiredWorkforce = ceil(workload / productivityPerWorker)
effectiveCapacity = floor(currentHeadcount * attendanceRate)
baseGap = max(requiredWorkforce - effectiveCapacity, 0)
attritionBuffer = ceil(baseGap * attritionBufferRate)
recruitmentNeed = baseGap + attritionBuffer + rampUpBuffer
```

Ads funnel:

```text
targetRetainedWorkers = recruitmentNeed
activated = ceil(targetRetainedWorkers / retention30dRate)
showUps = ceil(activated / activationRate)
qualified = ceil(showUps / showUpRate)
applications = ceil(qualified / qualificationRate)
clicks = ceil(applications / applyRate)
impressions = ceil(clicks / ctr)
adsBudget = clicks * cpc
costPerProductiveRetainedWorker = adsBudget / targetRetainedWorkers
```

## Prototype scope

- Overview is the fully functional operating cockpit.
- Other sidebar pages are wired placeholder workspaces for future build-out.
- All data is local mock data; no backend, database, paid APIs, or confidential Lazada data are used.

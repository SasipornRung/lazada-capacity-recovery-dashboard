import type { Hub, RiskLevel } from "../data/hubs";

export interface HubFlow {
  originHubId: string;
  destinationName: string;
  lat: number;
  lng: number;
  volume: number;
  slaRisk: RiskLevel;
}

export interface ScenarioOverrides {
  campaignUplift: number;
  returnFactor: number;
  attendanceRate: number;
  productivityPerWorker: number;
  ctr: number;
  applyRate: number;
  retention30dRate: number;
  cpc: number;
}

export function applyScenario(hub: Hub, scenario?: ScenarioOverrides): Hub {
  if (!scenario) {
    return hub;
  }

  return {
    ...hub,
    campaignUplift: scenario.campaignUplift,
    returnFactor: scenario.returnFactor,
    attendanceRate: scenario.attendanceRate,
    productivityPerWorker: scenario.productivityPerWorker,
    funnelRates: {
      ...hub.funnelRates,
      ctr: scenario.ctr,
      applyRate: scenario.applyRate,
      retention30dRate: scenario.retention30dRate,
      cpc: scenario.cpc,
    },
  };
}

export function scenarioFromHub(hub: Hub): ScenarioOverrides {
  return {
    campaignUplift: hub.campaignUplift,
    returnFactor: hub.returnFactor,
    attendanceRate: hub.attendanceRate,
    productivityPerWorker: hub.productivityPerWorker,
    ctr: hub.funnelRates.ctr,
    applyRate: hub.funnelRates.applyRate,
    retention30dRate: hub.funnelRates.retention30dRate,
    cpc: hub.funnelRates.cpc,
  };
}

export function calculateHubMetrics(hub: Hub) {
  const workload = hub.baselineVolume * hub.campaignUplift * hub.returnFactor;

  const requiredWorkforce = Math.ceil(workload / hub.productivityPerWorker);

  const effectiveCapacity = Math.floor(hub.currentHeadcount * hub.attendanceRate);

  const baseGap = Math.max(requiredWorkforce - effectiveCapacity, 0);

  const attritionBuffer = Math.ceil(baseGap * hub.attritionBufferRate);

  const recruitmentNeed = baseGap + attritionBuffer + hub.rampUpBuffer;

  const targetRetainedWorkers = recruitmentNeed;

  const activated =
    targetRetainedWorkers > 0
      ? Math.ceil(targetRetainedWorkers / hub.funnelRates.retention30dRate)
      : 0;

  const showUps =
    activated > 0 ? Math.ceil(activated / hub.funnelRates.activationRate) : 0;

  const qualified =
    showUps > 0 ? Math.ceil(showUps / hub.funnelRates.showUpRate) : 0;

  const applications =
    qualified > 0 ? Math.ceil(qualified / hub.funnelRates.qualifyRate) : 0;

  const clicks =
    applications > 0 ? Math.ceil(applications / hub.funnelRates.applyRate) : 0;

  const impressions =
    clicks > 0 ? Math.ceil(clicks / hub.funnelRates.ctr) : 0;

  const adsBudget = clicks * hub.funnelRates.cpc;

  const costPerProductiveRetainedWorker =
    targetRetainedWorkers > 0 ? adsBudget / targetRetainedWorkers : 0;

  return {
    workload,
    requiredWorkforce,
    effectiveCapacity,
    baseGap,
    attritionBuffer,
    recruitmentNeed,
    funnel: {
      impressions,
      clicks,
      applications,
      qualified,
      showUps,
      activated,
      retained30d: targetRetainedWorkers,
    },
    adsBudget,
    costPerProductiveRetainedWorker,
  };
}

import type { Feasibility, Hub, HubPriority, RiskLevel } from "../data/hubs";
import { calculateHubMetrics } from "./calculations";

export const riskScore: Record<RiskLevel, number> = {
  High: 3,
  Medium: 2,
  Low: 1,
};

export const feasibilityScore: Record<Feasibility, number> = {
  High: 0.9,
  Medium: 0.6,
  Low: 0.3,
};

export function estimateMarginalCostPerHire(hub: Hub) {
  const metrics = calculateHubMetrics(hub);
  const point = hub.marginalCurve?.find(
    (item) => item.spend >= metrics.adsBudget || item.retainedWorkers >= metrics.recruitmentNeed,
  );

  if (point) {
    return point.marginalCostPerHire;
  }

  const feasibilityLift =
    hub.candidateFeasibility === "High" ? 1.12 : hub.candidateFeasibility === "Medium" ? 1.28 : 1.75;

  return metrics.costPerProductiveRetainedWorker * feasibilityLift;
}

export function getPriorityScore(hub: Hub) {
  const metrics = calculateHubMetrics(hub);
  const marginalCost = estimateMarginalCostPerHire(hub) || 1;

  return (
    (metrics.recruitmentNeed *
      riskScore[hub.urgency] *
      riskScore[hub.slaImpact] *
      feasibilityScore[hub.candidateFeasibility]) /
    marginalCost
  );
}

export function getHubPriority(hub: Hub): HubPriority {
  const metrics = calculateHubMetrics(hub);
  const marginalCost = estimateMarginalCostPerHire(hub);
  const score = getPriorityScore(hub);

  if (
    metrics.recruitmentNeed <= 8 &&
    (hub.candidateFeasibility === "Low" || hub.slaImpact === "Low")
  ) {
    return "NO_PAID_ADS";
  }

  if (
    hub.recommendedChannel.toLowerCase().includes("no paid ads") ||
    (hub.candidateFeasibility === "Low" && hub.urgency === "Low")
  ) {
    return "NO_PAID_ADS";
  }

  if (
    metrics.recruitmentNeed >= 24 &&
    hub.slaImpact === "High" &&
    hub.candidateFeasibility !== "Low" &&
    marginalCost <= 3200
  ) {
    return "P0";
  }

  if (score >= 0.018 || metrics.recruitmentNeed >= 15 || hub.slaImpact === "High") {
    return "P1";
  }

  return "P2";
}

export function getRecommendedActions(hub: Hub) {
  if (hub.id === "BKK_EAST") {
    return ["Increase paid ads", "Use referral support", "Fix attrition in parallel"];
  }

  if (hub.id === "RURAL_A") {
    return ["No paid ads", "Use referral / walk-in / local community", "Monitor only"];
  }

  if (getHubPriority(hub) === "NO_PAID_ADS") {
    return ["Do not use paid ads", "Use referral / walk-in only", "Monitor capacity weekly"];
  }

  const actions = new Set<string>();
  const metrics = calculateHubMetrics(hub);

  if (metrics.recruitmentNeed >= 15 && hub.candidateFeasibility !== "Low") {
    actions.add("Increase paid ads");
  }

  if (hub.candidateFeasibility !== "High") {
    actions.add("Use referral support");
    actions.add("Use local partner / community hiring");
  }

  if (hub.diagnosis.attritionRisk === "High") {
    actions.add("Fix attrition in parallel");
  }

  if (hub.diagnosis.productivityIssue === "High") {
    actions.add("Fix routing/productivity before hiring");
  }

  if (hub.recruiterCapacity === "Low") {
    actions.add("Reduce paid ads because recruiter capacity is constrained");
  }

  if (actions.size === 0) {
    actions.add("Light always-on or referral support");
  }

  return Array.from(actions).slice(0, 3);
}

export function getDiagnosisSummary(hub: Hub) {
  if (hub.id === "BKK_EAST") {
    return "Recruitment is needed, but attrition should be fixed in parallel to avoid refilling a leaking bucket.";
  }

  if (hub.diagnosis.productivityIssue === "High") {
    return "Recommend training/process redesign before increasing ads.";
  }

  if (hub.diagnosis.routingIssue === "High") {
    return "Recommend route/catchment redesign before hiring.";
  }

  if (hub.diagnosis.attritionRisk === "High") {
    return "Recommend recruitment with retention fixes in parallel.";
  }

  if (hub.diagnosis.laborShortage) {
    return "Recommend recruitment because labor shortage is the primary bottleneck.";
  }

  return "Monitor weekly; capacity risk is not primarily a paid-ads problem.";
}

export function getCostPerSlaValue(hub: Hub) {
  const metrics = calculateHubMetrics(hub);
  const capacityRecovered =
    metrics.funnel.retained30d * hub.productivityPerWorker;
  const valueScore = capacityRecovered * riskScore[hub.slaImpact];

  return valueScore > 0 ? metrics.adsBudget / valueScore : 0;
}

export function getQuadrantLabel(hub: Hub) {
  const metrics = calculateHubMetrics(hub);
  const highNeed = metrics.recruitmentNeed >= 15;
  const highFeasibility = hub.candidateFeasibility === "High";

  if (highNeed && highFeasibility) {
    return "Scale paid ads";
  }

  if (highNeed && !highFeasibility) {
    return "Ads alone not enough";
  }

  if (!highNeed && highFeasibility) {
    return "Do not overbuy leads";
  }

  return "Monitor / no paid ads";
}

import type { HubPriority, RiskLevel } from "../data/hubs";

export function formatNumber(value: number, maximumFractionDigits = 0) {
  return new Intl.NumberFormat("en-US", { maximumFractionDigits }).format(value);
}

export function formatTHB(value: number, maximumFractionDigits = 0) {
  if (!Number.isFinite(value) || value <= 0) {
    return "N/A";
  }

  return `${formatNumber(value, maximumFractionDigits)} THB`;
}

export function formatPercent(value: number, maximumFractionDigits = 0) {
  return new Intl.NumberFormat("en-US", {
    style: "percent",
    maximumFractionDigits,
  }).format(value);
}

export function formatRiskLabel(value: RiskLevel) {
  return value;
}

export function formatPriorityLabel(priority: HubPriority) {
  const labels: Record<HubPriority, string> = {
    P0: "P0 Critical",
    P1: "P1 High",
    P2: "P2 Normal",
    NO_PAID_ADS: "No Paid Ads",
  };

  return labels[priority];
}

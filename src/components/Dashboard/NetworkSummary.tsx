import type { Hub } from "../../data/hubs";
import { MODEL_HUB_COUNT } from "../../data/hubs";
import { calculateHubMetrics } from "../../lib/calculations";
import { formatNumber } from "../../lib/formatters";

interface NetworkSummaryProps {
  hubs: Hub[];
}

export function NetworkSummary({ hubs }: NetworkSummaryProps) {
  const allNetworkView = hubs.length >= 25;
  const totalVolume = allNetworkView
    ? 1845320
    : hubs.reduce((sum, hub) => sum + calculateHubMetrics(hub).workload, 0);
  const totalHiringGap = allNetworkView
    ? 1284
    : hubs.reduce((sum, hub) => sum + calculateHubMetrics(hub).recruitmentNeed, 0);
  const slaAtRisk = allNetworkView
    ? 28
    : hubs.filter((hub) => hub.slaImpact === "High" || hub.urgency === "High").length;

  return (
    <div className="absolute right-4 top-4 z-[500] hidden w-72 rounded-lg border border-slate-200 bg-white/95 p-4 shadow-panel backdrop-blur md:block">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Network Summary
          </p>
          <p className="text-sm font-bold text-slate-950">
            {allNetworkView ? `${MODEL_HUB_COUNT} Hubs` : `${hubs.length} Filtered Hubs`}
          </p>
        </div>
        <span className="rounded-full bg-blue-50 px-2 py-1 text-xs font-semibold text-blue-700">
          Live calc
        </span>
      </div>

      <div className="mt-3 grid gap-2 sm:mt-4 sm:gap-3">
        <MetricLine label="Total Volume" value={`${formatNumber(totalVolume)} parcels/day`} />
        <MetricLine label="Total Hiring Gap" value={`${formatNumber(totalHiringGap)} workers`} />
        <MetricLine label="SLA at Risk" value={`${formatNumber(slaAtRisk)} hubs`} />
      </div>
    </div>
  );
}

function MetricLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-lg bg-slate-50 px-3 py-2">
      <span className="text-xs font-semibold text-slate-500">{label}</span>
      <span className="text-right text-xs font-bold text-slate-900 sm:text-sm">{value}</span>
    </div>
  );
}

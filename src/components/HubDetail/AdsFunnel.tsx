import type { Hub } from "../../data/hubs";
import { calculateHubMetrics } from "../../lib/calculations";
import { formatNumber, formatTHB } from "../../lib/formatters";

interface AdsFunnelProps {
  hub: Hub;
}

export function AdsFunnel({ hub }: AdsFunnelProps) {
  const metrics = calculateHubMetrics(hub);
  const stages = [
    { label: "Impressions", value: metrics.funnel.impressions },
    { label: "Clicks", value: metrics.funnel.clicks },
    { label: "Apply", value: metrics.funnel.applications },
    { label: "Qualified", value: metrics.funnel.qualified },
    { label: "Show-up", value: metrics.funnel.showUps },
    { label: "Activated", value: metrics.funnel.activated },
    { label: "Retained 30d", value: metrics.funnel.retained30d },
  ];
  const max = stages[0].value || 1;

  return (
    <div>
      <p className="text-sm font-bold text-slate-900">Ads Funnel</p>
      <p className="mt-0.5 text-xs text-slate-500">
        Optimize backward from productive retained workers, not leads.
      </p>

      <div className="mt-3 space-y-1.5">
        {stages.map((stage, index) => (
          <div key={stage.label} className="flex items-center gap-2">
            <span className="w-20 text-[11px] font-semibold text-slate-500">
              {stage.label}
            </span>
            <div className="h-7 flex-1 rounded bg-slate-100">
              <div
                className={`flex h-7 items-center justify-end rounded px-2 text-xs font-bold text-white ${
                  index === stages.length - 1 ? "bg-blue-700" : "bg-blue-500"
                }`}
                style={{
                  width: `${Math.max(12, (stage.value / max) * 100)}%`,
                }}
              >
                {formatNumber(stage.value)}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-3 rounded-lg border border-blue-200 bg-blue-50 p-3">
        <p className="text-[10px] font-semibold uppercase tracking-wide text-blue-600">
          Final KPI: Cost per Productive Retained Worker
        </p>
        <p className="mt-1 text-xl font-extrabold text-blue-800">
          {formatTHB(metrics.costPerProductiveRetainedWorker)}
        </p>
        <p className="mt-1 text-xs font-semibold text-blue-700">
          Budget: {formatTHB(metrics.adsBudget)}
        </p>
      </div>

      <p className="mt-2 rounded-lg bg-orange-50 px-3 py-2 text-xs font-semibold text-orange-700">
        Cheap leads can become expensive if they fail at show-up, retention, or productivity.
      </p>
    </div>
  );
}

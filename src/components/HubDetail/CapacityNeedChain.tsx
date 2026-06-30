import type { Hub } from "../../data/hubs";
import { calculateHubMetrics } from "../../lib/calculations";
import { formatNumber } from "../../lib/formatters";

interface CapacityNeedChainProps {
  hub: Hub;
}

export function CapacityNeedChain({ hub }: CapacityNeedChainProps) {
  const metrics = calculateHubMetrics(hub);
  const items = [
    { label: "Baseline Volume", value: `${formatNumber(hub.baselineVolume)} parcels` },
    { label: "Campaign Uplift", value: `${hub.campaignUplift.toFixed(2)}x` },
    { label: "Return Factor", value: `${hub.returnFactor.toFixed(2)}x` },
    { label: "Workload", value: `${formatNumber(metrics.workload)} parcels/day` },
    { label: "Productivity", value: `${formatNumber(hub.productivityPerWorker)} / worker` },
    { label: "Required Workforce", value: `${formatNumber(metrics.requiredWorkforce)} workers` },
    { label: "Effective Capacity", value: `${formatNumber(metrics.effectiveCapacity)} workers` },
  ];

  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-bold text-slate-900">Capacity Need</p>
          <p className="mt-0.5 text-xs text-slate-500">
            Recruitment should be driven by capacity gap, not headcount target.
          </p>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
        {items.map((item, index) => (
          <div
            key={item.label}
            className="relative rounded-lg border border-slate-200 bg-slate-50 p-2"
          >
            <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">
              {item.label}
            </p>
            <p className="mt-1 text-sm font-bold text-slate-900">{item.value}</p>
            {index < items.length - 1 ? (
              <span className="absolute -right-2 top-1/2 z-10 hidden -translate-y-1/2 text-xs font-bold text-slate-400 sm:block">
                {"->"}
              </span>
            ) : null}
          </div>
        ))}
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-3 text-blue-800">
          <p className="text-[10px] font-semibold uppercase tracking-wide">
            Recruitment Need
          </p>
          <p className="mt-1 text-2xl font-extrabold leading-none">
            {formatNumber(metrics.recruitmentNeed)} workers
          </p>
          <p className="mt-1 text-xs">
            Base gap {formatNumber(metrics.baseGap)} + attrition{" "}
            {formatNumber(metrics.attritionBuffer)} + ramp-up {hub.rampUpBuffer}
          </p>
        </div>
      </div>
    </div>
  );
}

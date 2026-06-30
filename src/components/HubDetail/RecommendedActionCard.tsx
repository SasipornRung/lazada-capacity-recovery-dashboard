import { CheckCircle2 } from "lucide-react";
import type { Hub } from "../../data/hubs";
import { getCostPerSlaValue, getQuadrantLabel, getRecommendedActions } from "../../lib/scoring";
import { formatTHB } from "../../lib/formatters";

interface RecommendedActionCardProps {
  hub: Hub;
}

export function RecommendedActionCard({ hub }: RecommendedActionCardProps) {
  const actions = getRecommendedActions(hub);

  return (
    <div>
      <p className="text-sm font-bold text-slate-900">Recommended Action</p>
      <p className="mt-0.5 text-xs text-slate-500">
        Need must be paired with feasibility and SLA value.
      </p>

      <div className="mt-3 space-y-2">
        {actions.map((action) => (
          <div key={action} className="flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2">
            <CheckCircle2 className="text-blue-600" size={16} />
            <span className="text-sm font-semibold text-slate-800">{action}</span>
          </div>
        ))}
      </div>

      <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
        <div className="rounded-lg bg-blue-50 p-3">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-blue-600">
            Quadrant
          </p>
          <p className="mt-1 text-sm font-bold text-blue-900">{getQuadrantLabel(hub)}</p>
        </div>
        <div className="rounded-lg bg-slate-50 p-3">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">
            Cost / SLA Value
          </p>
          <p className="mt-1 text-sm font-bold text-slate-900">
            {formatTHB(getCostPerSlaValue(hub), 2)}
          </p>
        </div>
      </div>
    </div>
  );
}

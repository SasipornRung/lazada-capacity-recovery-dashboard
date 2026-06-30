import type { Hub } from "../../data/hubs";
import { getHubPriority } from "../../lib/scoring";
import { Badge, PriorityBadge, RiskBadge } from "../UI/Badge";
import { CapacityNeedChain } from "./CapacityNeedChain";
import { DiagnosisCard } from "./DiagnosisCard";
import { AdsFunnel } from "./AdsFunnel";
import { RecommendedActionCard } from "./RecommendedActionCard";

interface HubDetailPanelProps {
  hub: Hub;
}

export function HubDetailPanel({ hub }: HubDetailPanelProps) {
  const priority = getHubPriority(hub);

  return (
    <aside className="dashboard-scrollbar max-h-[720px] overflow-auto rounded-lg border border-slate-200 bg-white shadow-panel xl:h-full xl:max-h-none">
      <div className="sticky top-0 z-20 border-b border-slate-200 bg-white px-4 py-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Selected Hub
            </p>
            <h2 className="mt-1 text-xl font-bold text-slate-950">{hub.name}</h2>
          </div>
          <PriorityBadge priority={priority} />
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          <Badge tone={hub.candidateFeasibility === "High" ? "green" : hub.candidateFeasibility === "Medium" ? "orange" : "gray"}>
            Candidate Liquidity: {hub.candidateFeasibility}
          </Badge>
          <RiskBadge risk={hub.slaImpact} />
        </div>
      </div>

      <div className="space-y-5 p-4">
        <CapacityNeedChain hub={hub} />
        <DiagnosisCard hub={hub} />
        <AdsFunnel hub={hub} />
        <RecommendedActionCard hub={hub} />
      </div>
    </aside>
  );
}

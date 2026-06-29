import type { Hub } from "../../data/hubs";
import { calculateHubMetrics } from "../../lib/calculations";
import { formatNumber, formatTHB } from "../../lib/formatters";
import {
  estimateMarginalCostPerHire,
  getHubPriority,
  getPriorityScore,
  getRecommendedActions,
} from "../../lib/scoring";
import { PriorityBadge } from "../UI/Badge";

interface HubRankingTableProps {
  hubs: Hub[];
  selectedHubId: string;
  onSelectHub: (hubId: string) => void;
}

export function HubRankingTable({
  hubs,
  selectedHubId,
  onSelectHub,
}: HubRankingTableProps) {
  const sortedHubs = [...hubs].sort((a, b) => {
    const priorityWeight = { P0: 4, P1: 3, P2: 2, NO_PAID_ADS: 1 };
    const pa = getHubPriority(a);
    const pb = getHubPriority(b);
    return (
      priorityWeight[pb] - priorityWeight[pa] ||
      getPriorityScore(b) - getPriorityScore(a)
    );
  });

  return (
    <div className="h-full overflow-hidden rounded-lg border border-slate-200 bg-white shadow-panel">
      <div className="border-b border-slate-200 px-4 py-3">
        <p className="text-sm font-bold text-slate-900">Hub Ranking Table</p>
        <p className="mt-0.5 text-xs text-slate-500">
          Do not split budget equally across 100 hubs.
        </p>
      </div>
      <div className="dashboard-scrollbar h-[258px] overflow-auto">
        <table className="min-w-[1180px] border-separate border-spacing-0 text-left text-xs">
          <thead className="sticky top-0 z-10 bg-slate-50 text-slate-500">
            <tr>
              {[
                "#",
                "Hub",
                "Region",
                "Hub Type",
                "Hiring Gap",
                "Candidate Feasibility",
                "SLA Impact",
                "Cost / Productive Hire",
                "Marginal Cost / Productive Hire",
                "Priority",
                "Recommended Approach",
              ].map((header) => (
                <th
                  key={header}
                  className="border-b border-slate-200 px-3 py-2 font-semibold"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedHubs.map((hub, index) => {
              const metrics = calculateHubMetrics(hub);
              const priority = getHubPriority(hub);
              const noPaidAds = priority === "NO_PAID_ADS";
              const selected = hub.id === selectedHubId;

              return (
                <tr
                  key={hub.id}
                  className={`cursor-pointer transition hover:bg-blue-50 ${
                    selected ? "bg-blue-50" : "bg-white"
                  }`}
                  onClick={() => onSelectHub(hub.id)}
                >
                  <td className="border-b border-slate-100 px-3 py-2 font-semibold text-slate-500">
                    {index + 1}
                  </td>
                  <td className="border-b border-slate-100 px-3 py-2 font-bold text-slate-900">
                    {hub.name}
                  </td>
                  <td className="border-b border-slate-100 px-3 py-2 text-slate-600">
                    {hub.region}
                  </td>
                  <td className="border-b border-slate-100 px-3 py-2 text-slate-600">
                    {hub.hubType}
                  </td>
                  <td className="border-b border-slate-100 px-3 py-2 font-bold text-slate-900">
                    {formatNumber(metrics.recruitmentNeed)}
                  </td>
                  <td className="border-b border-slate-100 px-3 py-2 text-slate-600">
                    {hub.candidateFeasibility}
                  </td>
                  <td className="border-b border-slate-100 px-3 py-2 text-slate-600">
                    {hub.slaImpact}
                  </td>
                  <td className="border-b border-slate-100 px-3 py-2 font-semibold text-slate-700">
                    {noPaidAds ? "N/A" : formatTHB(metrics.costPerProductiveRetainedWorker)}
                  </td>
                  <td className="border-b border-slate-100 px-3 py-2 font-semibold text-slate-700">
                    {noPaidAds ? "N/A" : formatTHB(estimateMarginalCostPerHire(hub))}
                  </td>
                  <td className="border-b border-slate-100 px-3 py-2">
                    <PriorityBadge priority={priority} />
                  </td>
                  <td className="border-b border-slate-100 px-3 py-2 text-slate-700">
                    {getRecommendedActions(hub)[0]}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

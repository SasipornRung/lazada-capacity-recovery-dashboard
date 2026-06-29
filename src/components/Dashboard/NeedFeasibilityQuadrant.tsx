import {
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
  ZAxis,
  ReferenceLine,
} from "recharts";
import type { Hub } from "../../data/hubs";
import { calculateHubMetrics } from "../../lib/calculations";
import { formatNumber } from "../../lib/formatters";

interface NeedFeasibilityQuadrantProps {
  hubs: Hub[];
  selectedHubId: string;
  onSelectHub: (hubId: string) => void;
}

const feasibilityX = { Low: 1, Medium: 2, High: 3 };
const slaSize = { Low: 80, Medium: 150, High: 240 };

export function NeedFeasibilityQuadrant({
  hubs,
  selectedHubId,
  onSelectHub,
}: NeedFeasibilityQuadrantProps) {
  const data = hubs.map((hub) => ({
    id: hub.id,
    name: hub.name,
    feasibility: hub.candidateFeasibility,
    x: feasibilityX[hub.candidateFeasibility],
    y: calculateHubMetrics(hub).recruitmentNeed,
    z: slaSize[hub.slaImpact],
    slaImpact: hub.slaImpact,
    selected: hub.id === selectedHubId,
  }));

  return (
    <div className="relative h-full rounded-lg border border-slate-200 bg-white p-4 shadow-panel">
      <div className="mb-2">
        <p className="text-sm font-bold text-slate-900">Need x Feasibility</p>
        <p className="mt-0.5 text-xs text-slate-500">
          High hiring gap does not always mean high ads budget.
        </p>
      </div>
      <div className="absolute left-5 top-[76px] rounded bg-white/80 px-2 py-1 text-[11px] font-semibold text-orange-700">
        Ads alone not enough
      </div>
      <div className="absolute right-5 top-[76px] rounded bg-white/80 px-2 py-1 text-[11px] font-semibold text-blue-700">
        Scale paid ads
      </div>
      <div className="absolute bottom-5 left-5 rounded bg-white/80 px-2 py-1 text-[11px] font-semibold text-slate-600">
        Monitor / no paid ads
      </div>
      <div className="absolute bottom-5 right-5 rounded bg-white/80 px-2 py-1 text-[11px] font-semibold text-emerald-700">
        Do not overbuy leads
      </div>

      <ResponsiveContainer width="100%" height={245}>
        <ScatterChart margin={{ top: 12, right: 12, bottom: 18, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis
            type="number"
            dataKey="x"
            domain={[0.7, 3.3]}
            ticks={[1, 2, 3]}
            tickFormatter={(value) => (value === 1 ? "Low" : value === 2 ? "Medium" : "High")}
            name="Candidate Feasibility"
            tick={{ fontSize: 11 }}
          />
          <YAxis
            type="number"
            dataKey="y"
            name="Hiring Need"
            tick={{ fontSize: 11 }}
            width={34}
          />
          <ZAxis type="number" dataKey="z" range={[80, 260]} />
          <ReferenceLine x={2} stroke="#94a3b8" strokeDasharray="4 4" />
          <ReferenceLine y={15} stroke="#94a3b8" strokeDasharray="4 4" />
          <Tooltip
            cursor={{ strokeDasharray: "3 3" }}
            content={({ active, payload }) => {
              if (!active || !payload?.length) return null;
              const item = payload[0].payload;
              return (
                <div className="rounded-lg border border-slate-200 bg-white p-3 text-xs shadow-panel">
                  <p className="font-bold text-slate-900">{item.name}</p>
                  <p>Hiring need: {formatNumber(item.y)} workers</p>
                  <p>Feasibility: {item.feasibility}</p>
                  <p>SLA impact: {item.slaImpact}</p>
                </div>
              );
            }}
          />
          <Scatter data={data} onClick={(item) => onSelectHub(item.id)}>
            {data.map((item) => (
              <Cell
                key={item.id}
                fill={item.selected ? "#1d4ed8" : "#64748b"}
                stroke={item.selected ? "#0f172a" : "#ffffff"}
                strokeWidth={item.selected ? 3 : 1.5}
              />
            ))}
          </Scatter>
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
}

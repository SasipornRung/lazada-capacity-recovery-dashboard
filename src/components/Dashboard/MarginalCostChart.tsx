import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { Hub, MarginalCurvePoint } from "../../data/hubs";
import { calculateHubMetrics } from "../../lib/calculations";
import { formatNumber, formatTHB } from "../../lib/formatters";

interface MarginalCostChartProps {
  hub: Hub;
}

function buildCurve(hub: Hub): MarginalCurvePoint[] {
  if (hub.marginalCurve) {
    return hub.marginalCurve;
  }

  const metrics = calculateHubMetrics(hub);
  return [
    {
      spend: Math.round(metrics.adsBudget * 0.35),
      retainedWorkers: Math.max(1, Math.round(metrics.recruitmentNeed * 0.45)),
      marginalCostPerHire: metrics.costPerProductiveRetainedWorker * 0.9,
    },
    {
      spend: Math.round(metrics.adsBudget * 0.7),
      retainedWorkers: Math.max(1, Math.round(metrics.recruitmentNeed * 0.75)),
      marginalCostPerHire: metrics.costPerProductiveRetainedWorker,
    },
    {
      spend: Math.round(metrics.adsBudget),
      retainedWorkers: metrics.recruitmentNeed,
      marginalCostPerHire: metrics.costPerProductiveRetainedWorker * 1.25,
    },
    {
      spend: Math.round(metrics.adsBudget * 1.35),
      retainedWorkers: Math.round(metrics.recruitmentNeed * 1.12),
      marginalCostPerHire: metrics.costPerProductiveRetainedWorker * 2.1,
    },
  ];
}

export function MarginalCostChart({ hub }: MarginalCostChartProps) {
  const metrics = calculateHubMetrics(hub);
  const data = buildCurve(hub);

  return (
    <div className="h-full rounded-lg border border-slate-200 bg-white p-4 shadow-panel">
      <div className="mb-2 flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-bold text-slate-900">
            Marginal Cost per Productive Hire
          </p>
          <p className="mt-0.5 text-xs text-slate-500">
            Recommended spend point = {formatTHB(metrics.adsBudget)}
          </p>
        </div>
        <span className="rounded-full bg-blue-50 px-2 py-1 text-xs font-semibold text-blue-700">
          {hub.name}
        </span>
      </div>

      <ResponsiveContainer width="100%" height={190}>
        <LineChart data={data} margin={{ top: 8, right: 18, bottom: 12, left: 8 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis
            dataKey="spend"
            tick={{ fontSize: 11 }}
            tickFormatter={(value) => `${formatNumber(value / 1000)}k`}
          />
          <YAxis
            tick={{ fontSize: 11 }}
            tickFormatter={(value) => `${formatNumber(value / 1000, 1)}k`}
          />
          <ReferenceLine
            x={metrics.adsBudget}
            stroke="#1d4ed8"
            strokeWidth={2}
            strokeDasharray="5 5"
          />
          <Tooltip
            formatter={(value, name) => [
              name === "marginalCostPerHire"
                ? formatTHB(Number(value))
                : formatNumber(Number(value)),
              name === "marginalCostPerHire"
                ? "Marginal Cost / Hire"
                : "Retained Workers",
            ]}
            labelFormatter={(value) => `Spend ${formatTHB(Number(value))}`}
          />
          <Line
            type="monotone"
            dataKey="marginalCostPerHire"
            stroke="#1d4ed8"
            strokeWidth={3}
            dot={{ r: 4, fill: "#ffffff", strokeWidth: 2 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>

      <p className="mt-2 rounded-lg bg-orange-50 px-3 py-2 text-xs font-semibold text-orange-700">
        Beyond this point, marginal cost increases sharply. Consider referral or offer redesign.
      </p>
    </div>
  );
}

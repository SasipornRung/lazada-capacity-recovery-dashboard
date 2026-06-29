import type { Hub, RiskLevel } from "../../data/hubs";
import { getDiagnosisSummary } from "../../lib/scoring";

interface DiagnosisCardProps {
  hub: Hub;
}

const riskTone: Record<RiskLevel, string> = {
  High: "bg-red-50 text-red-700",
  Medium: "bg-orange-50 text-orange-700",
  Low: "bg-emerald-50 text-emerald-700",
};

export function DiagnosisCard({ hub }: DiagnosisCardProps) {
  const items = [
    { label: "Labor Shortage", value: hub.diagnosis.laborShortage ? "Yes" : "No", tone: hub.diagnosis.laborShortage ? "bg-red-50 text-red-700" : "bg-emerald-50 text-emerald-700" },
    { label: "Attrition Risk", value: hub.diagnosis.attritionRisk, tone: riskTone[hub.diagnosis.attritionRisk] },
    { label: "Productivity Issue", value: hub.diagnosis.productivityIssue, tone: riskTone[hub.diagnosis.productivityIssue] },
    { label: "Routing Issue", value: hub.diagnosis.routingIssue, tone: riskTone[hub.diagnosis.routingIssue] },
    { label: "Shift Planning Issue", value: hub.diagnosis.shiftPlanningIssue, tone: riskTone[hub.diagnosis.shiftPlanningIssue] },
    { label: "Attendance Risk", value: hub.diagnosis.attendanceRisk, tone: riskTone[hub.diagnosis.attendanceRisk] },
  ];

  return (
    <div>
      <p className="text-sm font-bold text-slate-900">Workforce Diagnosis</p>
      <p className="mt-0.5 text-xs text-slate-500">
        If the root cause is attrition, paid ads only refill a leaking bucket.
      </p>

      <div className="mt-3 grid grid-cols-2 gap-2">
        {items.map((item) => (
          <div key={item.label} className="rounded-lg bg-slate-50 p-2">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">
              {item.label}
            </p>
            <p className={`mt-1 inline-flex rounded-full px-2 py-0.5 text-xs font-bold ${item.tone}`}>
              {item.value}
            </p>
          </div>
        ))}
      </div>

      <p className="mt-3 rounded-lg bg-slate-900 px-3 py-2 text-xs font-semibold text-white">
        {getDiagnosisSummary(hub)}
      </p>
    </div>
  );
}

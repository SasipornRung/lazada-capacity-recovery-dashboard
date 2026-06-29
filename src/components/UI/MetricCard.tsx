interface MetricCardProps {
  label: string;
  value: string;
  helper?: string;
  tone?: "blue" | "green" | "orange" | "red" | "slate";
}

const toneClass = {
  blue: "border-blue-200 bg-blue-50 text-blue-700",
  green: "border-emerald-200 bg-emerald-50 text-emerald-700",
  orange: "border-orange-200 bg-orange-50 text-orange-700",
  red: "border-red-200 bg-red-50 text-red-700",
  slate: "border-slate-200 bg-slate-50 text-slate-700",
};

export function MetricCard({
  label,
  value,
  helper,
  tone = "slate",
}: MetricCardProps) {
  return (
    <div className={`rounded-lg border p-3 ${toneClass[tone]}`}>
      <p className="text-[11px] font-semibold uppercase tracking-wide opacity-80">
        {label}
      </p>
      <p className="mt-1 text-2xl font-bold leading-none">{value}</p>
      {helper ? <p className="mt-1 text-xs opacity-80">{helper}</p> : null}
    </div>
  );
}

import type { ReactNode } from "react";
import type { HubPriority, RiskLevel } from "../../data/hubs";
import { formatPriorityLabel } from "../../lib/formatters";

type BadgeTone = "red" | "orange" | "green" | "blue" | "gray" | "navy";

const toneClass: Record<BadgeTone, string> = {
  red: "bg-red-50 text-red-700 ring-red-200",
  orange: "bg-orange-50 text-orange-700 ring-orange-200",
  green: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  blue: "bg-blue-50 text-blue-700 ring-blue-200",
  gray: "bg-slate-100 text-slate-600 ring-slate-200",
  navy: "bg-slate-900 text-white ring-slate-700",
};

interface BadgeProps {
  children: ReactNode;
  tone?: BadgeTone;
  className?: string;
}

export function Badge({ children, tone = "blue", className = "" }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${toneClass[tone]} ${className}`}
    >
      {children}
    </span>
  );
}

export function PriorityBadge({ priority }: { priority: HubPriority }) {
  const tone: Record<HubPriority, BadgeTone> = {
    P0: "red",
    P1: "orange",
    P2: "green",
    NO_PAID_ADS: "gray",
  };

  return <Badge tone={tone[priority]}>{formatPriorityLabel(priority)}</Badge>;
}

export function RiskBadge({ risk }: { risk: RiskLevel }) {
  const tone: Record<RiskLevel, BadgeTone> = {
    High: "red",
    Medium: "orange",
    Low: "green",
  };

  return <Badge tone={tone[risk]}>{risk}</Badge>;
}

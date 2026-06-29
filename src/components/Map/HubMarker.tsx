import { CircleMarker, Tooltip } from "react-leaflet";
import type { Hub, HubPriority } from "../../data/hubs";
import type { ViewMode } from "../../types";
import { calculateHubMetrics } from "../../lib/calculations";
import { formatNumber, formatPriorityLabel, formatTHB } from "../../lib/formatters";
import { getHubPriority } from "../../lib/scoring";

interface HubMarkerProps {
  hub: Hub;
  activeMode: ViewMode;
  selected: boolean;
  onSelect: (hubId: string) => void;
}

const priorityColors: Record<HubPriority, string> = {
  P0: "#ef4444",
  P1: "#f97316",
  P2: "#16a34a",
  NO_PAID_ADS: "#64748b",
};

function getRadius(hub: Hub, activeMode: ViewMode) {
  const metrics = calculateHubMetrics(hub);

  if (activeMode === "Volume") {
    return Math.max(7, Math.min(22, Math.sqrt(hub.baselineVolume) / 7));
  }

  if (activeMode === "Capacity Gap") {
    return Math.max(7, Math.min(24, metrics.baseGap * 0.55 + 6));
  }

  if (activeMode === "Recruitment Need") {
    return Math.max(7, Math.min(24, metrics.recruitmentNeed * 0.48 + 6));
  }

  if (activeMode === "Ads Budget") {
    return Math.max(7, Math.min(24, Math.sqrt(metrics.adsBudget) / 13));
  }

  return Math.max(7, Math.min(24, hub.slaImpact === "High" ? 18 : hub.slaImpact === "Medium" ? 13 : 9));
}

function getColor(hub: Hub, activeMode: ViewMode) {
  const priority = getHubPriority(hub);

  if (activeMode === "SLA Risk") {
    if (hub.slaImpact === "High") return "#ef4444";
    if (hub.slaImpact === "Medium") return "#f97316";
    return "#16a34a";
  }

  return priorityColors[priority];
}

export function HubMarker({ hub, activeMode, selected, onSelect }: HubMarkerProps) {
  const metrics = calculateHubMetrics(hub);
  const priority = getHubPriority(hub);
  const color = getColor(hub, activeMode);

  return (
    <CircleMarker
      center={[hub.lat, hub.lng]}
      pathOptions={{
        color: selected ? "#0f172a" : "#ffffff",
        weight: selected ? 4 : 2,
        fillColor: color,
        fillOpacity: selected ? 0.92 : 0.78,
      }}
      radius={selected ? getRadius(hub, activeMode) + 4 : getRadius(hub, activeMode)}
      eventHandlers={{
        click: () => onSelect(hub.id),
      }}
    >
      <Tooltip direction="top" offset={[0, -8]} opacity={1}>
        <div className="space-y-1">
          <p className="font-bold">{hub.name}</p>
          <p>{hub.region}</p>
          <p>Volume: {formatNumber(hub.baselineVolume)} parcels/day</p>
          <p>Hiring gap: {formatNumber(metrics.recruitmentNeed)} workers</p>
          <p>Priority: {formatPriorityLabel(priority)}</p>
          <p>Channel: {hub.recommendedChannel}</p>
          <p>Budget: {formatTHB(metrics.adsBudget)}</p>
        </div>
      </Tooltip>
    </CircleMarker>
  );
}

import { useEffect } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import type { Hub } from "../../data/hubs";
import type { HubFlow } from "../../lib/calculations";
import type { ViewMode } from "../../types";
import { HubMarker } from "./HubMarker";
import { FlowLines } from "./FlowLines";
import { MapLegend } from "./MapLegend";
import { NetworkSummary } from "../Dashboard/NetworkSummary";

interface ThailandHubMapProps {
  hubs: Hub[];
  allHubs: Hub[];
  flows: HubFlow[];
  activeMode: ViewMode;
  selectedHubId: string;
  onSelectHub: (hubId: string) => void;
}

function MapPan({ hub }: { hub?: Hub }) {
  const map = useMap();

  useEffect(() => {
    if (hub) {
      map.flyTo([hub.lat, hub.lng], Math.max(map.getZoom(), 6), {
        duration: 0.7,
      });
    }
  }, [hub, map]);

  return null;
}

export function ThailandHubMap({
  hubs,
  allHubs,
  flows,
  activeMode,
  selectedHubId,
  onSelectHub,
}: ThailandHubMapProps) {
  const selectedHub = allHubs.find((hub) => hub.id === selectedHubId);

  return (
    <div className="relative h-full min-h-[360px] overflow-hidden rounded-lg border border-slate-200 bg-slate-100 sm:min-h-[440px] xl:min-h-[500px]">
      <MapContainer center={[13.7, 101]} zoom={5} scrollWheelZoom={false} zoomControl={false}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <FlowLines flows={flows} hubs={allHubs} />
        {hubs.map((hub) => (
          <HubMarker
            key={hub.id}
            hub={hub}
            activeMode={activeMode}
            selected={hub.id === selectedHubId}
            onSelect={onSelectHub}
          />
        ))}
        <MapPan hub={selectedHub} />
      </MapContainer>

      <div className="absolute left-3 top-3 z-[500] rounded-lg border border-slate-200 bg-white/95 px-3 py-2 shadow-panel backdrop-blur sm:left-4 sm:top-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Active View
        </p>
        <p className="text-sm font-bold text-slate-900">{activeMode}</p>
      </div>

      <NetworkSummary hubs={hubs} />
      <MapLegend />
    </div>
  );
}

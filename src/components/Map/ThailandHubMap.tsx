import { useEffect, useRef } from "react";
import { latLngBounds } from "leaflet";
import { MapContainer, TileLayer, ZoomControl, useMap } from "react-leaflet";
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
  const previousHubId = useRef(hub?.id);

  useEffect(() => {
    if (!hub || previousHubId.current === hub.id) {
      return;
    }

    previousHubId.current = hub.id;
    const isCompact = map.getContainer().clientWidth < 640;

    map.flyTo([hub.lat, hub.lng], Math.max(map.getZoom(), isCompact ? 6 : 7), {
      duration: 0.7,
    });
  }, [hub, map]);

  return null;
}

function MapAutoLayout({ hubs }: { hubs: Hub[] }) {
  const map = useMap();
  const firstLayout = useRef(true);
  const previousHubSignature = useRef("");

  useEffect(() => {
    const container = map.getContainer();
    const refreshSize = () => map.invalidateSize({ pan: false });

    window.requestAnimationFrame(refreshSize);

    const resizeObserver = new ResizeObserver(refreshSize);
    resizeObserver.observe(container);
    window.addEventListener("orientationchange", refreshSize);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("orientationchange", refreshSize);
    };
  }, [map]);

  useEffect(() => {
    const hubSignature = hubs.map((hub) => hub.id).join("|");
    if (hubSignature === previousHubSignature.current) {
      return;
    }

    previousHubSignature.current = hubSignature;

    if (hubs.length === 0) {
      return;
    }

    const isCompact = map.getContainer().clientWidth < 640;

    if (hubs.length === 1) {
      const [hub] = hubs;
      map.setView([hub.lat, hub.lng], isCompact ? 6 : 7, {
        animate: !firstLayout.current,
      });
      firstLayout.current = false;
      return;
    }

    const visibleBounds = latLngBounds(hubs.map((hub) => [hub.lat, hub.lng]));
    map.fitBounds(visibleBounds.pad(0.12), {
      animate: !firstLayout.current,
      maxZoom: isCompact ? 6 : 7,
      padding: isCompact ? [18, 34] : [36, 36],
    });
    firstLayout.current = false;
  }, [hubs, map]);

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
    <div className="relative h-full min-h-[420px] overflow-hidden rounded-lg border border-slate-200 bg-slate-100 sm:min-h-[480px] xl:min-h-[500px]">
      <MapContainer
        center={[13.7, 101]}
        zoom={5}
        scrollWheelZoom
        touchZoom
        doubleClickZoom
        boxZoom
        keyboard
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <ZoomControl position="topright" />
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
        <MapAutoLayout hubs={hubs} />
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

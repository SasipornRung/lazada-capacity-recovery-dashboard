import { Polyline, Tooltip } from "react-leaflet";
import type { Hub } from "../../data/hubs";
import type { HubFlow } from "../../lib/calculations";
import { formatNumber } from "../../lib/formatters";

interface FlowLinesProps {
  flows: HubFlow[];
  hubs: Hub[];
}

export function FlowLines({ flows, hubs }: FlowLinesProps) {
  return (
    <>
      {flows.map((flow) => {
        const origin = hubs.find((hub) => hub.id === flow.originHubId);
        if (!origin) return null;

        const weight = Math.max(2, Math.min(8, flow.volume / 12000));

        return (
          <Polyline
            key={`${flow.originHubId}-${flow.destinationName}`}
            pathOptions={{
              color: "#2563eb",
              opacity: 0.34,
              weight,
              dashArray: flow.slaRisk === "High" ? undefined : "6 8",
            }}
            positions={[
              [origin.lat, origin.lng],
              [flow.lat, flow.lng],
            ]}
          >
            <Tooltip sticky opacity={1}>
              <div className="space-y-1">
                <p className="font-bold">
                  {origin.name} {"->"} {flow.destinationName}
                </p>
                <p>Parcel flow: {formatNumber(flow.volume)}</p>
                <p>SLA risk: {flow.slaRisk}</p>
              </div>
            </Tooltip>
          </Polyline>
        );
      })}
    </>
  );
}

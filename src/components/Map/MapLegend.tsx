export function MapLegend() {
  return (
    <div className="absolute bottom-4 left-4 z-[500] w-64 rounded-lg border border-slate-200 bg-white/95 p-3 text-xs shadow-panel backdrop-blur">
      <p className="text-sm font-bold text-slate-900">Map Legend</p>

      <div className="mt-3 grid grid-cols-2 gap-3">
        <div>
          <p className="font-semibold text-slate-600">Hub Volume</p>
          <div className="mt-2 flex items-end gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-blue-500" />
            <span className="h-4 w-4 rounded-full bg-blue-500" />
            <span className="h-6 w-6 rounded-full bg-blue-500" />
          </div>
          <p className="mt-1 text-slate-500">Parcel/day scale</p>
        </div>

        <div>
          <p className="font-semibold text-slate-600">Capacity Pressure</p>
          <div className="mt-2 space-y-1">
            <LegendRow color="bg-red-500" label="High" />
            <LegendRow color="bg-orange-500" label="Medium" />
            <LegendRow color="bg-emerald-500" label="Healthy" />
          </div>
        </div>
      </div>

      <div className="mt-3 border-t border-slate-200 pt-3">
        <p className="font-semibold text-slate-600">Priority</p>
        <div className="mt-2 grid grid-cols-3 gap-1">
          <LegendRow color="bg-red-500" label="P0" />
          <LegendRow color="bg-orange-500" label="P1" />
          <LegendRow color="bg-emerald-500" label="P2" />
        </div>
      </div>

      <div className="mt-3 border-t border-slate-200 pt-3">
        <p className="font-semibold text-slate-600">Flow</p>
        <div className="mt-2 flex items-center gap-2 text-slate-600">
          <span className="h-0.5 w-12 rounded-full bg-blue-600 opacity-60" />
          Flow = Volume Distribution
        </div>
      </div>
    </div>
  );
}

function LegendRow({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className={`h-2.5 w-2.5 rounded-full ${color}`} />
      <span className="text-slate-600">{label}</span>
    </div>
  );
}

import { RotateCcw } from "lucide-react";
import type { ScenarioOverrides } from "../../lib/calculations";
import { formatPercent } from "../../lib/formatters";

interface ScenarioControlsProps {
  scenario: ScenarioOverrides;
  onChange: (scenario: ScenarioOverrides) => void;
  onReset: () => void;
}

export function ScenarioControls({
  scenario,
  onChange,
  onReset,
}: ScenarioControlsProps) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-panel">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-bold text-slate-900">Scenario Simulation</p>
          <p className="mt-0.5 text-xs text-slate-500">
            Scenario changes recalculate capacity need and the ads funnel live.
          </p>
        </div>
        <button
          className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
          type="button"
          onClick={onReset}
        >
          <RotateCcw size={14} />
          Reset Scenario
        </button>
      </div>

      <div className="mt-4 grid grid-cols-4 gap-3">
        <Slider
          label="Campaign uplift"
          min={1}
          max={2.5}
          step={0.05}
          value={scenario.campaignUplift}
          display={`${scenario.campaignUplift.toFixed(2)}x`}
          onChange={(campaignUplift) => onChange({ ...scenario, campaignUplift })}
        />
        <Slider
          label="Return factor"
          min={1}
          max={1.2}
          step={0.01}
          value={scenario.returnFactor}
          display={`${scenario.returnFactor.toFixed(2)}x`}
          onChange={(returnFactor) => onChange({ ...scenario, returnFactor })}
        />
        <Slider
          label="Attendance rate"
          min={0.8}
          max={0.98}
          step={0.01}
          value={scenario.attendanceRate}
          display={formatPercent(scenario.attendanceRate)}
          onChange={(attendanceRate) => onChange({ ...scenario, attendanceRate })}
        />
        <Slider
          label="Productivity"
          min={250}
          max={450}
          step={5}
          value={scenario.productivityPerWorker}
          display={`${scenario.productivityPerWorker} parcels`}
          onChange={(productivityPerWorker) =>
            onChange({ ...scenario, productivityPerWorker })
          }
        />
        <Slider
          label="CTR"
          min={0.01}
          max={0.05}
          step={0.001}
          value={scenario.ctr}
          display={formatPercent(scenario.ctr, 1)}
          onChange={(ctr) => onChange({ ...scenario, ctr })}
        />
        <Slider
          label="Apply rate"
          min={0.05}
          max={0.25}
          step={0.005}
          value={scenario.applyRate}
          display={formatPercent(scenario.applyRate, 1)}
          onChange={(applyRate) => onChange({ ...scenario, applyRate })}
        />
        <Slider
          label="Retention rate"
          min={0.3}
          max={0.7}
          step={0.01}
          value={scenario.retention30dRate}
          display={formatPercent(scenario.retention30dRate)}
          onChange={(retention30dRate) =>
            onChange({ ...scenario, retention30dRate })
          }
        />
        <Slider
          label="CPC"
          min={15}
          max={50}
          step={1}
          value={scenario.cpc}
          display={`${scenario.cpc} THB`}
          onChange={(cpc) => onChange({ ...scenario, cpc })}
        />
      </div>
    </div>
  );
}

function Slider({
  label,
  min,
  max,
  step,
  value,
  display,
  onChange,
}: {
  label: string;
  min: number;
  max: number;
  step: number;
  value: number;
  display: string;
  onChange: (value: number) => void;
}) {
  return (
    <label className="rounded-lg bg-slate-50 p-3">
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-semibold text-slate-500">{label}</span>
        <span className="text-xs font-bold text-slate-900">{display}</span>
      </div>
      <input
        className="mt-2 w-full accent-blue-600"
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
      />
    </label>
  );
}

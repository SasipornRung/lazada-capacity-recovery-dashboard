import { RotateCcw, SlidersHorizontal } from "lucide-react";
import type { HubType } from "../../data/hubs";

export type RegionFilter =
  | "All Regions"
  | "Bangkok & Vicinity"
  | "North"
  | "Northeast"
  | "East"
  | "South"
  | "Central";

export type PriorityFilter =
  | "All"
  | "P0 Critical"
  | "P1 High"
  | "P2 Normal"
  | "No Paid Ads";

export type ChannelFilter =
  | "All Channels"
  | "Paid Ads"
  | "Referral"
  | "Local Partner"
  | "Walk-in"
  | "Mixed";

export interface Filters {
  region: RegionFilter;
  hubType: "All" | HubType;
  priority: PriorityFilter;
  channel: ChannelFilter;
}

interface FilterBarProps {
  filters: Filters;
  onChange: (filters: Filters) => void;
  onReset: () => void;
}

const regions: RegionFilter[] = [
  "All Regions",
  "Bangkok & Vicinity",
  "North",
  "Northeast",
  "East",
  "South",
  "Central",
];

const hubTypes: Filters["hubType"][] = [
  "All",
  "Regional Hub",
  "Urban Hub",
  "Last-mile Hub",
  "Seller Pickup Hub",
  "Overflow Hub",
  "Remote Partner Hub",
];

const priorities: PriorityFilter[] = [
  "All",
  "P0 Critical",
  "P1 High",
  "P2 Normal",
  "No Paid Ads",
];

const channels: ChannelFilter[] = [
  "All Channels",
  "Paid Ads",
  "Referral",
  "Local Partner",
  "Walk-in",
  "Mixed",
];

function Select<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: T[];
  onChange: (value: T) => void;
}) {
  return (
    <label className="flex min-w-[9.5rem] flex-none flex-col gap-1 text-xs font-semibold uppercase tracking-wide text-slate-500 sm:min-w-40 sm:flex-1 lg:flex-none">
      {label}
      <select
        className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm font-semibold normal-case tracking-normal text-slate-700 outline-none focus:border-blue-500"
        value={value}
        onChange={(event) => onChange(event.target.value as T)}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

export function FilterBar({ filters, onChange, onReset }: FilterBarProps) {
  return (
    <div className="dashboard-scrollbar flex flex-nowrap items-end gap-3 overflow-x-auto border-b border-slate-200 bg-slate-50 px-3 py-3 sm:flex-wrap sm:overflow-visible sm:px-4 lg:px-6">
      <div className="flex h-10 shrink-0 items-center gap-2 rounded-lg bg-slate-900 px-3 text-sm font-semibold text-white">
        <SlidersHorizontal size={16} />
        Filters
      </div>

      <Select
        label="Region"
        value={filters.region}
        options={regions}
        onChange={(region) => onChange({ ...filters, region })}
      />
      <Select
        label="Hub Type"
        value={filters.hubType}
        options={hubTypes}
        onChange={(hubType) => onChange({ ...filters, hubType })}
      />
      <Select
        label="Priority"
        value={filters.priority}
        options={priorities}
        onChange={(priority) => onChange({ ...filters, priority })}
      />
      <Select
        label="Channel"
        value={filters.channel}
        options={channels}
        onChange={(channel) => onChange({ ...filters, channel })}
      />

      <button
        className="flex h-10 shrink-0 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 hover:bg-slate-100 lg:ml-auto"
        type="button"
        onClick={onReset}
      >
        <RotateCcw size={15} />
        Reset
      </button>
    </div>
  );
}

import {
  BarChart3,
  BellDot,
  FileText,
  Gauge,
  Map,
  PackageCheck,
  Settings,
  Truck,
  Users,
} from "lucide-react";

export type SidebarPage =
  | "Overview"
  | "Hubs"
  | "Campaigns"
  | "Applicants"
  | "Workforce"
  | "SLA Monitor"
  | "Reports"
  | "Settings";

const menuItems = [
  { label: "Overview", icon: Gauge },
  { label: "Hubs", icon: Map },
  { label: "Campaigns", icon: BarChart3 },
  { label: "Applicants", icon: Users },
  { label: "Workforce", icon: PackageCheck },
  { label: "SLA Monitor", icon: BellDot },
  { label: "Reports", icon: FileText },
  { label: "Settings", icon: Settings },
] satisfies Array<{ label: SidebarPage; icon: typeof Gauge }>;

interface SidebarProps {
  activePage: SidebarPage;
  onNavigate: (page: SidebarPage) => void;
}

export function Sidebar({ activePage, onNavigate }: SidebarProps) {
  return (
    <aside className="flex h-screen w-64 shrink-0 flex-col bg-navy-950 px-4 py-5 text-slate-200">
      <div className="flex items-center gap-3 px-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
          <Truck size={22} />
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-200">
            Lazada Logistics
          </p>
          <p className="text-xs text-slate-400">Capacity Recovery</p>
        </div>
      </div>

      <nav className="mt-8 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = item.label === activePage;
          return (
            <button
              key={item.label}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition ${
                active
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-950/30"
                  : "text-slate-300 hover:bg-navy-800 hover:text-white"
              }`}
              type="button"
              onClick={() => onNavigate(item.label)}
            >
              <Icon size={18} />
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="mt-auto rounded-lg border border-white/10 bg-white/5 p-4">
        <p className="text-xs uppercase tracking-wide text-slate-400">Data as of</p>
        <p className="mt-1 text-sm font-semibold text-white">May 31, 2025 23:59</p>
        <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-4">
          <span className="text-xs uppercase tracking-wide text-slate-400">
            Data Quality
          </span>
          <span className="rounded-full bg-emerald-400/15 px-2 py-1 text-xs font-semibold text-emerald-300">
            Good
          </span>
        </div>
      </div>
    </aside>
  );
}

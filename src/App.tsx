import { useEffect, useMemo, useState } from "react";
import { Activity, ArrowLeft, FlaskConical } from "lucide-react";
import { hubs, defaultSelectedHubId } from "./data/hubs";
import { flows } from "./data/flows";
import type { Hub } from "./data/hubs";
import type { ViewMode } from "./types";
import {
  applyScenario,
  scenarioFromHub,
  type ScenarioOverrides,
} from "./lib/calculations";
import { formatPriorityLabel } from "./lib/formatters";
import { getHubPriority } from "./lib/scoring";
import { Sidebar, type SidebarPage } from "./components/Layout/Sidebar";
import { Header } from "./components/Layout/Header";
import { FilterBar, type Filters } from "./components/Layout/FilterBar";
import { ThailandHubMap } from "./components/Map/ThailandHubMap";
import { HubDetailPanel } from "./components/HubDetail/HubDetailPanel";
import { HubRankingTable } from "./components/Dashboard/HubRankingTable";
import { NeedFeasibilityQuadrant } from "./components/Dashboard/NeedFeasibilityQuadrant";
import { MarginalCostChart } from "./components/Dashboard/MarginalCostChart";
import { ScenarioControls } from "./components/Dashboard/ScenarioControls";
import { ExperimentModal } from "./components/Dashboard/ExperimentModal";

const viewModes: ViewMode[] = [
  "Volume",
  "Capacity Gap",
  "Recruitment Need",
  "Ads Budget",
  "SLA Risk",
];

const defaultFilters: Filters = {
  region: "All Regions",
  hubType: "All",
  priority: "All",
  channel: "All Channels",
};

function channelMatches(hub: Hub, channel: Filters["channel"]) {
  if (channel === "All Channels") return true;
  const value = hub.recommendedChannel.toLowerCase();

  if (channel === "Mixed") {
    return value.includes("+") || value.includes("/");
  }

  if (channel === "Paid Ads") {
    return value.includes("paid ads") && !value.includes("no paid ads");
  }

  return value.includes(channel.toLowerCase());
}

function filterHubs(source: Hub[], filters: Filters) {
  return source.filter((hub) => {
    const priorityLabel = formatPriorityLabel(getHubPriority(hub));
    return (
      (filters.region === "All Regions" || hub.region === filters.region) &&
      (filters.hubType === "All" || hub.hubType === filters.hubType) &&
      (filters.priority === "All" || priorityLabel === filters.priority) &&
      channelMatches(hub, filters.channel)
    );
  });
}

export default function App() {
  const [activePage, setActivePage] = useState<SidebarPage>("Overview");
  const [activeMode, setActiveMode] = useState<ViewMode>("Capacity Gap");
  const [filters, setFilters] = useState<Filters>(defaultFilters);
  const [selectedHubId, setSelectedHubId] = useState(defaultSelectedHubId);
  const [searchQuery, setSearchQuery] = useState("");
  const [validationOpen, setValidationOpen] = useState(false);
  const selectedBaseHub =
    hubs.find((hub) => hub.id === selectedHubId) ?? hubs[0];
  const [scenario, setScenario] = useState<ScenarioOverrides>(
    scenarioFromHub(selectedBaseHub),
  );

  const filteredHubs = useMemo(() => filterHubs(hubs, filters), [filters]);

  useEffect(() => {
    if (
      filteredHubs.length > 0 &&
      !filteredHubs.some((hub) => hub.id === selectedHubId)
    ) {
      setSelectedHubId(filteredHubs[0].id);
    }
  }, [filteredHubs, selectedHubId]);

  useEffect(() => {
    const nextHub = hubs.find((hub) => hub.id === selectedHubId);
    if (nextHub) {
      setScenario(scenarioFromHub(nextHub));
    }
  }, [selectedHubId]);

  const scenarioHub = applyScenario(selectedBaseHub, scenario);

  const handleSearchSelect = (hubName: string) => {
    const match = hubs.find(
      (hub) => hub.name.toLowerCase() === hubName.toLowerCase(),
    );
    if (match) {
      setSelectedHubId(match.id);
      setSearchQuery(match.name);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-100 lg:h-screen lg:flex-row lg:overflow-hidden">
      <Sidebar activePage={activePage} onNavigate={setActivePage} />
      <main className="flex min-w-0 flex-1 flex-col lg:min-h-0">
        <Header
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          searchOptions={hubs.map((hub) => hub.name)}
          onSearchSelect={handleSearchSelect}
        />

        {activePage === "Overview" ? (
          <>
            <div className="flex flex-col gap-3 border-b border-slate-200 bg-white px-4 py-3 lg:px-6 xl:flex-row xl:items-center xl:justify-between">
              <div className="dashboard-scrollbar flex gap-2 overflow-x-auto pb-1 xl:overflow-visible xl:pb-0">
                {viewModes.map((mode) => (
                  <button
                    key={mode}
                    className={`shrink-0 rounded-lg px-3 py-2 text-sm font-semibold transition ${
                      activeMode === mode
                        ? "bg-blue-600 text-white shadow-md shadow-blue-900/20"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                    type="button"
                    onClick={() => setActiveMode(mode)}
                  >
                    {mode}
                  </button>
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600">
                <div className="flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2">
                  <Activity className="text-blue-600" size={16} />
                  Ads recover capacity, not just leads
                </div>
                <button
                  className="flex items-center gap-2 rounded-lg bg-slate-900 px-3 py-2 font-semibold text-white hover:bg-slate-800"
                  type="button"
                  onClick={() => setValidationOpen(true)}
                >
                  <FlaskConical size={16} />
                  Validation
                </button>
              </div>
            </div>

            <FilterBar
              filters={filters}
              onChange={setFilters}
              onReset={() => setFilters(defaultFilters)}
            />

            <div className="dashboard-scrollbar flex-1 overflow-auto p-3 lg:p-5">
              <div className="grid gap-4 xl:h-[560px] xl:grid-cols-[minmax(0,1fr)_390px] xl:gap-5">
                <div className="h-[430px] min-h-0 sm:h-[500px] xl:h-full">
                  <ThailandHubMap
                    hubs={filteredHubs}
                    allHubs={hubs}
                    flows={flows}
                    activeMode={activeMode}
                    selectedHubId={selectedHubId}
                    onSelectHub={setSelectedHubId}
                  />
                </div>
                <HubDetailPanel hub={scenarioHub} />
              </div>

              <div className="mt-5">
                <ScenarioControls
                  scenario={scenario}
                  onChange={setScenario}
                  onReset={() => setScenario(scenarioFromHub(selectedBaseHub))}
                />
              </div>

              <div className="mt-5 grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1.25fr)_minmax(300px,0.75fr)_minmax(300px,0.75fr)] xl:gap-5">
                <HubRankingTable
                  hubs={filteredHubs}
                  selectedHubId={selectedHubId}
                  onSelectHub={setSelectedHubId}
                />
                <NeedFeasibilityQuadrant
                  hubs={filteredHubs}
                  selectedHubId={selectedHubId}
                  onSelectHub={setSelectedHubId}
                />
                <MarginalCostChart hub={scenarioHub} />
              </div>
            </div>
          </>
        ) : (
          <PlaceholderPage
            page={activePage}
            selectedHubName={selectedBaseHub.name}
            onBackToOverview={() => setActivePage("Overview")}
          />
        )}
      </main>

      <ExperimentModal
        open={validationOpen}
        onClose={() => setValidationOpen(false)}
      />
    </div>
  );
}

const pageContent: Record<
  Exclude<SidebarPage, "Overview">,
  { eyebrow: string; title: string; description: string; cards: string[] }
> = {
  Hubs: {
    eyebrow: "Hub Operations",
    title: "Hub workspace",
    description:
      "Use Overview as the operating cockpit; this workspace is reserved for hub rosters, catchment diagnostics, route constraints, and local hiring actions.",
    cards: ["Hub roster", "Catchment health", "Route constraints", "Local action log"],
  },
  Campaigns: {
    eyebrow: "Ads Funnel",
    title: "Campaign workspace",
    description:
      "Campaign decisions should inherit recruitment need from the capacity model, then optimize backward from productive retained workers.",
    cards: ["Creative tests", "Channel mix", "Budget pacing", "Downstream funnel quality"],
  },
  Applicants: {
    eyebrow: "Candidate Pipeline",
    title: "Applicants workspace",
    description:
      "Track candidate flow from application to qualification, show-up, activation, and 30-day retention instead of stopping at cheap leads.",
    cards: ["Applications", "Qualified candidates", "Show-up queue", "Retention cohort"],
  },
  Workforce: {
    eyebrow: "Capacity Diagnosis",
    title: "Workforce workspace",
    description:
      "Separate true labor shortage from attendance, productivity, shift planning, attrition, and routing issues before increasing paid ads.",
    cards: ["Effective capacity", "Attendance risk", "Attrition signals", "Productivity variance"],
  },
  "SLA Monitor": {
    eyebrow: "Service Risk",
    title: "SLA monitor workspace",
    description:
      "Prioritize hiring where recovered capacity protects critical service levels, not where cost per lead looks cheapest.",
    cards: ["SLA at risk", "Capacity recovered", "Critical hubs", "Risk reduction value"],
  },
  Reports: {
    eyebrow: "Executive Reporting",
    title: "Reports workspace",
    description:
      "Summarize why budget was allocated, which hubs recovered capacity, and whether experiments improved retained productive workers.",
    cards: ["Weekly recovery brief", "Budget rationale", "Experiment outcomes", "SLA value report"],
  },
  Settings: {
    eyebrow: "Model Controls",
    title: "Settings workspace",
    description:
      "Configure model thresholds, scoring assumptions, region groups, and mock-data refresh rules for the prototype.",
    cards: ["Priority thresholds", "Funnel defaults", "Region groups", "Data quality rules"],
  },
};

function PlaceholderPage({
  page,
  selectedHubName,
  onBackToOverview,
}: {
  page: Exclude<SidebarPage, "Overview">;
  selectedHubName: string;
  onBackToOverview: () => void;
}) {
  const content = pageContent[page];

  return (
    <div className="dashboard-scrollbar flex-1 overflow-auto p-3 sm:p-6">
      <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-panel">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
              {content.eyebrow}
            </p>
            <h2 className="mt-2 text-3xl font-bold text-slate-950">
              {content.title}
            </h2>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
              {content.description}
            </p>
          </div>
          <button
            className="flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
            type="button"
            onClick={onBackToOverview}
          >
            <ArrowLeft size={16} />
            Back to Overview
          </button>
        </div>

        <div className="mt-6 rounded-lg border border-blue-200 bg-blue-50 p-4">
          <p className="text-sm font-bold text-blue-900">
            Prototype note
          </p>
          <p className="mt-1 text-sm text-blue-800">
            The full interactive logic is currently concentrated in Overview. This
            page is wired for navigation and ready for the next build-out, using{" "}
            <span className="font-semibold">{selectedHubName}</span> as the current
            selected hub context.
          </p>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {content.cards.map((card) => (
            <div key={card} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm font-bold text-slate-900">{card}</p>
              <p className="mt-2 text-xs leading-5 text-slate-500">
                Reserved module for the capacity recovery workflow.
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

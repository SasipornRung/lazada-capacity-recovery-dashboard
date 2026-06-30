import { Bell, CalendarDays, Search, Share2 } from "lucide-react";

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  searchOptions: string[];
  onSearchSelect: (hubName: string) => void;
}

export function Header({
  searchQuery,
  onSearchChange,
  searchOptions,
  onSearchSelect,
}: HeaderProps) {
  return (
    <header className="border-b border-slate-200 bg-white px-3 py-3 sm:px-4 sm:py-4 lg:px-6">
      <div className="flex flex-col gap-3 xl:flex-row xl:items-start xl:justify-between">
        <div className="flex min-w-0 items-start justify-between gap-3 xl:block xl:max-w-[430px] 2xl:max-w-none">
          <div className="min-w-0">
            <h1 className="text-lg font-bold leading-tight text-slate-950 sm:text-2xl">
              Recruitment Ads = Capacity Recovery System
            </h1>
            <p className="mt-1 hidden text-sm text-slate-500 sm:block">
              Close hub-level capacity gaps with the lowest cost per productive retained worker.
            </p>
          </div>

          <HeaderActions className="xl:hidden" />
        </div>

        <div className="flex items-center gap-2 sm:gap-3 xl:flex-nowrap xl:justify-end">
          <div className="relative min-w-0 flex-1 sm:flex-none">
            <Search
              className="pointer-events-none absolute left-3 top-2.5 text-slate-400"
              size={16}
            />
            <input
              className="h-10 w-full min-w-0 rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm outline-none transition focus:border-blue-500 focus:bg-white sm:w-60 sm:min-w-48 xl:w-56"
              list="hub-search"
              placeholder="Search hub"
              value={searchQuery}
              onChange={(event) => onSearchChange(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && searchQuery.trim()) {
                  onSearchSelect(searchQuery.trim());
                }
              }}
            />
            <datalist id="hub-search">
              {searchOptions.map((option) => (
                <option key={option} value={option} />
              ))}
            </datalist>
          </div>

          <div className="hidden h-10 items-center gap-2 whitespace-nowrap rounded-lg border border-slate-200 bg-slate-50 px-3 text-xs font-semibold text-slate-700 sm:flex sm:text-sm">
            <CalendarDays size={16} />
            <span>May 1 - May 31, 2025</span>
          </div>

          <HeaderActions className="hidden xl:flex" />
        </div>
      </div>
    </header>
  );
}

function HeaderActions({ className = "" }: { className?: string }) {
  return (
    <div className={`flex shrink-0 items-center gap-2 ${className}`}>
      <button
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 sm:h-10 sm:w-10"
        type="button"
        title="Share"
      >
        <Share2 size={17} />
      </button>
      <button
        className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 sm:h-10 sm:w-10"
        type="button"
        title="Notifications"
      >
        <Bell size={17} />
        <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />
      </button>
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900 text-xs font-bold text-white sm:h-10 sm:w-10 sm:text-sm">
        RL
      </div>
    </div>
  );
}

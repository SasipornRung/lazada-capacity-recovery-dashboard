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
    <header className="border-b border-slate-200 bg-white px-6 py-4">
      <div className="flex items-start justify-between gap-5">
        <div>
          <h1 className="text-2xl font-bold leading-tight text-slate-950">
            Recruitment Ads = Capacity Recovery System
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Close hub-level capacity gaps with the lowest cost per productive retained worker.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search
              className="pointer-events-none absolute left-3 top-2.5 text-slate-400"
              size={16}
            />
            <input
              className="h-10 w-60 rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm outline-none transition focus:border-blue-500 focus:bg-white"
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

          <div className="flex h-10 items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm font-semibold text-slate-700">
            <CalendarDays size={16} />
            May 1 - May 31, 2025
          </div>

          <button
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
            type="button"
            title="Share"
          >
            <Share2 size={17} />
          </button>
          <button
            className="relative flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
            type="button"
            title="Notifications"
          >
            <Bell size={17} />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />
          </button>
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-900 text-sm font-bold text-white">
            RL
          </div>
        </div>
      </div>
    </header>
  );
}

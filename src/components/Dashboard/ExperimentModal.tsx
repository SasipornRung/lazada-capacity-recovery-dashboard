import { X } from "lucide-react";

interface ExperimentModalProps {
  open: boolean;
  onClose: () => void;
}

const experiments = [
  {
    title: "Creative A vs B",
    metrics: "CTR -> Qualified Rate -> 30-day Retention",
  },
  {
    title: "Wage shown vs wage hidden",
    metrics: "Apply Rate -> Show-up Rate -> 30-day Retention",
  },
  {
    title: "Follow-up within 1 hour vs 24 hours",
    metrics: "Show-up Rate -> Activation Rate",
  },
  {
    title: "Targeting radius 5 km vs 10 km",
    metrics: "Apply Rate -> Commute Retention",
  },
  {
    title: "Referral vs Paid Ads",
    metrics: "Cost per Productive Retained Worker",
  },
];

export function ExperimentModal({ open, onClose }: ExperimentModalProps) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-slate-950/45 p-6">
      <div className="w-full max-w-3xl rounded-lg bg-white shadow-2xl">
        <div className="flex items-start justify-between border-b border-slate-200 px-6 py-4">
          <div>
            <p className="text-lg font-bold text-slate-950">
              Validation: Does the ads strategy actually work?
            </p>
            <p className="mt-1 text-sm text-slate-500">
              Evaluate ad experiments downstream, not only by CTR or CPL.
            </p>
          </div>
          <button
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50"
            type="button"
            onClick={onClose}
            title="Close"
          >
            <X size={18} />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4 p-6">
          {experiments.map((experiment) => (
            <div key={experiment.title} className="rounded-lg border border-slate-200 p-4">
              <p className="text-sm font-bold text-slate-900">{experiment.title}</p>
              <p className="mt-2 text-sm text-slate-600">{experiment.metrics}</p>
            </div>
          ))}
        </div>

        <div className="border-t border-slate-200 bg-orange-50 px-6 py-4 text-sm font-semibold text-orange-800">
          Any ad experiment should be evaluated downstream, not only by CTR or CPL.
          The winning creative at click level may produce worse retained workers.
        </div>
      </div>
    </div>
  );
}

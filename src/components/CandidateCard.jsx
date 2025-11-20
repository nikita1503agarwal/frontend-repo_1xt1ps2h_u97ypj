import { CheckCircle2 } from "lucide-react";

export default function CandidateCard({ candidate, rated, onRate }) {
  return (
    <div className="relative group bg-slate-800/60 border border-slate-700 rounded-xl overflow-hidden hover:shadow-lg hover:shadow-blue-900/20 transition">
      <img src={candidate.photo_url} alt={candidate.name} className="h-40 w-full object-cover" />
      <div className="p-4">
        <h3 className="text-white font-semibold leading-tight">{candidate.name}</h3>
        <p className="text-sm text-blue-300/70">{candidate.position}</p>
        <div className="mt-4 flex items-center justify-between">
          <button
            onClick={() => onRate(candidate)}
            className="px-4 py-2 text-sm rounded-lg bg-blue-500 hover:bg-blue-600 text-white transition"
          >
            {rated ? "Update" : "Rate"}
          </button>
          {rated && (
            <span className="inline-flex items-center gap-1 text-xs text-green-400">
              <CheckCircle2 size={16} /> Rated
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

import { X } from "lucide-react";
import { useEffect, useState } from "react";

export default function RatingModal({ open, onClose, candidate, criteria, onSubmit, alreadyRated }) {
  const [scores, setScores] = useState({});

  useEffect(() => {
    if (open) {
      const init = {};
      criteria.forEach(c => (init[c.id] = 50));
      setScores(init);
    }
  }, [open, criteria]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-xl bg-slate-900 border border-slate-700 rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-700">
          <div>
            <h3 className="text-white font-semibold">Rate {candidate?.name}</h3>
            <p className="text-xs text-blue-300/70">Use sliders 1–100 for each criterion</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-lg text-blue-200">
            <X />
          </button>
        </div>
        <div className="p-6 space-y-5">
          {criteria.map((c) => (
            <div key={c.id} className="">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white font-medium">
                  {c.name} <span className="text-xs text-blue-300/70">({c.type}, w={c.weight})</span>
                </span>
                <span className="text-blue-300">{scores[c.id]}</span>
              </div>
              <input
                type="range"
                min={1}
                max={100}
                value={scores[c.id] ?? 50}
                onChange={(e) => setScores((s) => ({ ...s, [c.id]: Number(e.target.value) }))}
                className="w-full accent-blue-500"
              />
            </div>
          ))}
          {alreadyRated && (
            <div className="text-amber-400 text-sm">You already submitted a rating for this candidate. Submitting again will be blocked.</div>
          )}
        </div>
        <div className="px-6 py-4 border-t border-slate-700 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 rounded-lg bg-slate-800 text-blue-200">Cancel</button>
          <button
            onClick={() => onSubmit(scores)}
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}

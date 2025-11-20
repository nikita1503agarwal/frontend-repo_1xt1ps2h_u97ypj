import { Crown, Trophy } from "lucide-react";

export default function ChiefDashboard({ stats, results }) {
  const winnerId = results?.[0]?.candidateId;
  return (
    <div className="space-y-6">
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-5">
          <div className="text-sm text-blue-300/70">Total Candidates</div>
          <div className="text-3xl font-semibold text-white">{stats?.totalCandidates ?? 0}</div>
        </div>
        <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-5">
          <div className="text-sm text-blue-300/70">Decision Makers Participated</div>
          <div className="text-3xl font-semibold text-white">{stats?.totalDecisionMakers ?? 0}</div>
        </div>
      </div>

      <div className="bg-slate-800/60 border border-slate-700 rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-700 flex items-center gap-2">
          <Crown className="text-blue-400" />
          <h3 className="text-white font-semibold">Group Decision Result (WP + Borda)</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-slate-900/60">
              <tr className="text-left text-blue-300/70">
                <th className="px-5 py-3">Rank</th>
                <th className="px-5 py-3">Candidate</th>
                <th className="px-5 py-3">Borda Points</th>
                <th className="px-5 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {results?.map((r) => (
                <tr key={r.candidateId} className={r.candidateId === winnerId ? "bg-blue-500/10" : ""}>
                  <td className="px-5 py-3 text-white font-semibold">{r.rank}</td>
                  <td className="px-5 py-3 text-white">{r.name}</td>
                  <td className="px-5 py-3 text-blue-200">{r.totalBordaPoints}</td>
                  <td className="px-5 py-3">
                    {r.candidateId === winnerId ? (
                      <span className="inline-flex items-center gap-1 text-emerald-400 text-sm font-medium">
                        <Trophy size={16} /> Winner
                      </span>
                    ) : (
                      <button className="text-sm px-3 py-1.5 rounded-md bg-slate-700 text-white">View</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

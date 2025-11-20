import { useEffect, useMemo, useState } from "react";
import Login from "./components/Login";
import CandidateCard from "./components/CandidateCard";
import RatingModal from "./components/RatingModal";
import ChiefDashboard from "./components/ChiefDashboard";
import { Crown, Users } from "lucide-react";

const API = import.meta.env.VITE_BACKEND_URL || "";

export default function App() {
  const [user, setUser] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [criteria, setCriteria] = useState([]);
  const [ratedIds, setRatedIds] = useState([]);
  const [stats, setStats] = useState(null);
  const [results, setResults] = useState([]);

  const [modal, setModal] = useState({ open: false, candidate: null });

  // login handler (mock to backend)
  const handleLogin = async ({ role }) => {
    try {
      const res = await fetch(`${API}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      });
      const data = await res.json();
      setUser(data);
    } catch (e) {
      console.error(e);
    }
  };

  // load shared data
  useEffect(() => {
    const load = async () => {
      try {
        const [c1, c2] = await Promise.all([
          fetch(`${API}/candidates`).then((r) => r.json()),
          fetch(`${API}/criteria`).then((r) => r.json()),
        ]);
        setCandidates(c1.data || []);
        setCriteria(c2.data || []);
      } catch (e) {
        console.error(e);
      }
    };
    load();
  }, []);

  // load rated list for staff
  useEffect(() => {
    const loadRated = async () => {
      if (!user || user.role !== "staff") return;
      const r = await fetch(`${API}/rated?userId=${user.id}`).then((r) => r.json());
      setRatedIds(r.data || []);
    };
    loadRated();
  }, [user]);

  // chief data
  useEffect(() => {
    const loadChief = async () => {
      if (!user || user.role !== "chief") return;
      const [s, resu] = await Promise.all([
        fetch(`${API}/stats`).then((r) => r.json()),
        fetch(`${API}/results`).then((r) => r.json()),
      ]);
      setStats(s);
      setResults(resu.data || []);
    };
    loadChief();
  }, [user]);

  const onRate = (candidate) => setModal({ open: true, candidate });

  const submitRatings = async (scores) => {
    try {
      const payload = {
        userId: user.id,
        candidateId: modal.candidate.id,
        scores: Object.entries(scores).map(([criteriaId, scoreValue]) => ({ criteriaId, scoreValue })),
      };
      const res = await fetch(`${API}/rate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const e = await res.json();
        alert(e.detail || "Error submitting rating");
        return;
      }
      setRatedIds((r) => [...r, modal.candidate.id]);
      setModal({ open: false, candidate: null });
    } catch (e) {
      console.error(e);
    }
  };

  if (!user) return <Login onLogin={handleLogin} />;

  if (user.role === "chief") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-950 p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          <header className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-400/20">
                <Crown className="text-blue-400" />
              </div>
              <div>
                <h1 className="text-white font-semibold">Chief Dashboard</h1>
                <p className="text-xs text-blue-300/70">Welcome, {user.name}</p>
              </div>
            </div>
            <button onClick={() => setUser(null)} className="text-blue-300/80 text-sm">Logout</button>
          </header>

          <ChiefDashboard stats={stats} results={results} />
        </div>
      </div>
    );
  }

  // staff view
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-950 p-6">
      <div className="max-w-6xl mx-auto">
        <header className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-400/20">
              <Users className="text-blue-400" />
            </div>
            <div>
              <h1 className="text-white font-semibold">Rate Candidates</h1>
              <p className="text-xs text-blue-300/70">Hello, {user.name}</p>
            </div>
          </div>
          <button onClick={() => setUser(null)} className="text-blue-300/80 text-sm">Logout</button>
        </header>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {candidates.map((c) => (
            <CandidateCard
              key={c.id}
              candidate={c}
              rated={ratedIds.includes(c.id)}
              onRate={onRate}
            />
          ))}
        </div>
      </div>

      <RatingModal
        open={modal.open}
        candidate={modal.candidate}
        criteria={criteria}
        alreadyRated={modal.candidate ? ratedIds.includes(modal.candidate.id) : false}
        onClose={() => setModal({ open: false, candidate: null })}
        onSubmit={submitRatings}
      />
    </div>
  );
}

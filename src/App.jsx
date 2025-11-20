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

  // load shared data with robust seeding fallback
  useEffect(() => {
    const load = async () => {
      try {
        const [c1, c2] = await Promise.all([
          fetch(`${API}/candidates`).then((r) => r.json()),
          fetch(`${API}/criteria`).then((r) => r.json()),
        ]);
        let cand = c1.data || [];
        let crit = c2.data || [];

        // Frontend safety seeding (mock demo) if backend returns empty
        if (!cand || cand.length === 0) {
          cand = [
            { id: "cand-1", name: "Alice Engineer", position: "Software Engineer", photo_url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=60" },
            { id: "cand-2", name: "Bob Developer", position: "Backend Developer", photo_url: "https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?w=400&auto=format&fit=crop&q=60" },
            { id: "cand-3", name: "Carla Coder", position: "Frontend Engineer", photo_url: "https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=400&auto=format&fit=crop&q=60" },
            { id: "cand-4", name: "Diego Architect", position: "Full‑stack Engineer", photo_url: "https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?w=400&auto=format&fit=crop&q=60" },
            { id: "cand-5", name: "Eva Programmer", position: "Mobile Engineer", photo_url: "https://images.unsplash.com/photo-1502685104226-ee32379fefbe?w=400&auto=format&fit=crop&q=60" },
          ];
        }
        if (!crit || crit.length === 0) {
          crit = [
            { id: "coding", name: "Coding Skill", weight: 0.4, type: "Benefit" },
            { id: "comm", name: "Communication", weight: 0.3, type: "Benefit" },
            { id: "exp", name: "Experience", weight: 0.3, type: "Benefit" },
          ];
        }

        setCandidates(cand);
        setCriteria(crit);
      } catch (e) {
        console.error(e);
      }
    };
    load();
  }, []);

  // load rated list for Decision Maker
  useEffect(() => {
    const loadRated = async () => {
      if (!user || user.role !== "staff") return;
      try {
        const r = await fetch(`${API}/rated?userId=${user.id}`).then((r) => r.json());
        setRatedIds(r.data || []);
      } catch (e) {
        setRatedIds([]);
      }
    };
    loadRated();
  }, [user]);

  // chief data - always fetch results on load
  useEffect(() => {
    const loadChief = async () => {
      if (!user || user.role !== "chief") return;
      const [s, resu] = await Promise.all([
        fetch(`${API}/stats`).then((r) => r.json()).catch(() => ({ totalCandidates: candidates.length, totalDecisionMakers: 3 })),
        fetch(`${API}/results`).then((r) => r.json()).catch(() => ({ data: [] })),
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

  // Decision Maker view
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
              <p className="text-xs text-blue-300/70">Hello, {user.name} (Decision Maker)</p>
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
          {candidates.length === 0 && (
            <div className="text-blue-300/80">No candidates available. Please refresh to trigger seeding.</div>
          )}
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

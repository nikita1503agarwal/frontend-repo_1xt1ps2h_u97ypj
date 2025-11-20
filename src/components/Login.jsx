import { LogIn, User, Shield } from "lucide-react";

export default function Login({ onLogin }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="w-full max-w-xl bg-slate-800/60 border border-blue-500/20 rounded-2xl shadow-2xl p-10 text-center">
        <div className="mx-auto mb-6 w-20 h-20 rounded-2xl bg-blue-500/10 border border-blue-400/30 flex items-center justify-center">
          <LogIn className="text-blue-400" size={36} />
        </div>
        <h1 className="text-3xl font-bold text-white tracking-tight mb-2">GDSS • Engineer Selection</h1>
        <p className="text-blue-200/80 mb-8">Sign in with a test role to explore the app</p>
        <div className="grid sm:grid-cols-2 gap-4">
          <button
            onClick={() => onLogin({ role: "staff" })}
            className="group px-6 py-5 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-medium transition flex items-center justify-center gap-2"
          >
            <User className="group-hover:scale-110 transition" />
            Login as Decision Maker
          </button>
          <button
            onClick={() => onLogin({ role: "chief" })}
            className="px-6 py-5 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-medium transition flex items-center justify-center gap-2 border border-slate-600"
          >
            <Shield />
            Login as Chief
          </button>
        </div>
        <p className="text-xs text-blue-300/60 mt-6">No passwords required • Mock authentication</p>
      </div>
    </div>
  );
}

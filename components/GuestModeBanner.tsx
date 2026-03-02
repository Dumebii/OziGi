import { supabase } from "../lib/supabase";

export default function UpgradeBanner() {
  return (
    <div className="mb-12 p-8 bg-slate-950 rounded-[2.5rem] text-white flex flex-col md:flex-row items-center justify-between gap-8 border border-slate-800 shadow-2xl relative overflow-hidden">
      <div className="relative z-10 text-left">
        <div className="flex items-center gap-2 mb-3">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-red-500">
            Guest Mode Active
          </p>
        </div>
        <h3 className="text-xl font-black italic uppercase tracking-tighter mb-2">
          Professionalize Your Workflow
        </h3>
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">
          <span className="flex items-center gap-2">
            🌿 <b>Auto-Save History</b>
          </span>
          <span className="flex items-center gap-2">
            🚀 <b>Discord Deployment</b>
          </span>
          <span className="flex items-center gap-2">
            🧠 <b>Custom Voice Matrix</b>
          </span>
        </div>
      </div>
      <button
        onClick={() => supabase.auth.signInWithOAuth({ provider: "github" })}
        className="relative z-10 bg-white text-slate-900 px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-red-700 hover:text-white transition-all shadow-lg"
      >
        Connect GitHub
      </button>
    </div>
  );
}

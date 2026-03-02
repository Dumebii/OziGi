import { supabase } from "../lib/supabase";

export default function Header({
  session,
  view,
  setView,
  onOpenHistory,
}: {
  session: any;
  view: string;
  setView: (v: "landing" | "dashboard") => void;
  onOpenHistory: () => void;
}) {
  const signIn = async () =>
    await supabase.auth.signInWithOAuth({ provider: "github" });
  const signOut = async () => await supabase.auth.signOut();

  return (
    <nav className="fixed top-0 w-full z-[100] bg-white/80 backdrop-blur-md border-b border-slate-100 px-8 py-4 flex justify-between items-center">
      <div
        className="flex items-center gap-2 cursor-pointer"
        onClick={() => setView("landing")}
      >
        <div className="bg-red-700 p-1.5 rounded-lg">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L19 12L12 22L5 12L12 2Z" fill="white" />
          </svg>
        </div>
        <span className="font-black italic uppercase tracking-tighter text-slate-900">
          WriterHelper
        </span>
      </div>

      <div className="flex items-center gap-6">
        {session && view === "dashboard" && (
          <button
            onClick={onOpenHistory}
            className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-red-600 transition-colors"
          >
            📚 History
          </button>
        )}
        {view === "dashboard" && (
          <button
            onClick={() => setView("landing")}
            className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900"
          >
            Home
          </button>
        )}

        {session ? (
          <button
            onClick={signOut}
            className="bg-slate-900 text-white px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-red-700 transition-all"
          >
            Sign Out
          </button>
        ) : (
          <button
            onClick={signIn}
            className="bg-red-700 text-white px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest"
          >
            Connect GitHub
          </button>
        )}
      </div>
    </nav>
  );
}

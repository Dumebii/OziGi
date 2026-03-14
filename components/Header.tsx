"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { supabase } from "../lib/supabase";
import SettingsModal from "./SettingsModal";

export default function Header({
  session,
  onOpenHistory,
  onSignIn,
}: {
  session: any;
  onOpenHistory: () => void;
  onSignIn: () => void;
}) {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const pathname = usePathname(); 

  const signOut = async () => await supabase.auth.signOut();
  const avatarUrl = session?.user?.user_metadata?.avatar_url;

  // ✨ FIXED: The missing listener is back! 
  // Now the Header can "hear" the dropdown signal to open the Settings Modal.
  useEffect(() => {
    const handleOpenSettings = () => {
      setIsSettingsOpen(true);
    };
    window.addEventListener("openSettingsModal", handleOpenSettings);
    return () => {
      window.removeEventListener("openSettingsModal", handleOpenSettings);
    };
  }, []);

  return (
    <>
<header className="fixed top-0 left-0 right-0 z-50 pointer-events-none flex flex-col items-center pt-5 gap-4">
        
        {/* CONDITIONAL RENDER: Only show the pill on the root landing page */}
        {pathname === "/" && (
          <Link
            href="/dashboard"
            className="pointer-events-auto inline-flex items-center justify-center bg-slate-900 px-5 py-1.5 text-xs sm:text-sm font-semibold text-slate-100 rounded-full shadow-md hover:bg-slate-800 hover:-translate-y-0.5 hover:shadow-lg transition-all group border border-slate-700/50"
          >
            <span className="flex items-center gap-2">
              <span className="text-amber-400">⚡</span> 
              Ozigi is live — try it free today
              <span className="group-hover:translate-x-1 transition-transform opacity-60 ml-1">&rarr;</span>
            </span>
          </Link>
        )}
        <div className="w-full px-4 md:px-8 pointer-events-none">
        <div className="max-w-7xl mx-auto flex justify-between items-center bg-white/80 backdrop-blur-xl border-2 border-slate-900 rounded-[2rem] p-3 md:p-4 shadow-[0_8px_30px_rgb(0,0,0,0.12)] pointer-events-auto transition-all">
          <Link
            href="/"
            className="flex items-center gap-2 group cursor-pointer"
          >
            <div className="w-8 h-8 md:w-10 md:h-10 bg-red-700 rounded-xl md:rounded-2xl rotate-3 group-hover:rotate-12 transition-all flex items-center justify-center shadow-lg shadow-red-900/20">
              <img
                src="/icon.svg"
                alt="Ozigi Logo"
                className="w-8 h-8 md:w-10 md:h-10 object-contain transition-transform group-hover:scale-105"
              />
            </div>
            <span className="font-black italic uppercase tracking-tighter text-xl md:text-2xl hidden sm:block text-slate-900">
              Ozigi
            </span>
          </Link>

          <div className="flex items-center gap-2 md:gap-4">
                        <nav className="hidden md:flex items-center gap-4 mr-2 border-r border-slate-200 pr-4">
              <Link 
                href="/docs" 
                className={`text-[10px] md:text-xs font-black uppercase tracking-widest transition-colors ${pathname === '/docs' ? 'text-red-700' : 'text-slate-500 hover:text-slate-900'}`}
              >
                Docs
              </Link>
              <Link 
                href="/architecture" 
                className={`text-[10px] md:text-xs font-black uppercase tracking-widest transition-colors ${pathname === '/architecture' ? 'text-red-700' : 'text-slate-500 hover:text-slate-900'}`}
              >
                Architecture
              </Link>
            </nav>
            {pathname === "/" ? (
              <Link
                href="/dashboard"
                className="text-[10px] md:text-xs font-black uppercase tracking-widest text-slate-500 hover:text-red-700 transition-colors px-2 md:px-4"
              >
                Try It Now
              </Link>
            ) : (
              session && (
                <button
                  onClick={onOpenHistory}
                  className="text-[10px] md:text-xs font-black uppercase tracking-widest text-slate-500 hover:text-red-700 transition-colors px-2 md:px-4 hidden sm:block"
                >
                  History
                </button>
              )
            )}

            {!session ? (
              <button
                onClick={onSignIn}
                className="bg-red-700 text-white px-5 md:px-8 py-2 md:py-3 rounded-full text-[10px] md:text-xs font-black uppercase tracking-widest hover:bg-red-800 transition-all shadow-lg active:scale-95 shrink-0"
              >
                Sign In
              </button>
            ) : (
              <div className="flex items-center gap-2 md:gap-3 bg-slate-100 p-1 md:p-1.5 rounded-[1.5rem] border border-slate-200">
                <button
                  onClick={() => setIsSettingsOpen(true)}
                  className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-slate-300 overflow-hidden border-2 border-white hover:border-red-400 transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 shrink-0"
                >
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt="Avatar"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-slate-800 flex items-center justify-center text-white font-bold text-xs">
                      {session.user.email?.charAt(0).toUpperCase()}
                    </div>
                  )}
                </button>
                <button
                  onClick={signOut}
                  className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-slate-900 px-3 md:px-4 pr-4 md:pr-5 transition-colors hidden sm:block"
                >
                  Log Out
                </button>
              </div>
            )}
          </div>
        </div>
        </div>
      </header>

      {isSettingsOpen && (
        <SettingsModal
          session={session}
          onClose={() => setIsSettingsOpen(false)}
        />
      )}
    </>
  );
}

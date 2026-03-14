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
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-3 group"
          >
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-lg group-hover:scale-110 transition-transform">
              O
            </div>
            <span className="text-xl font-bold text-foreground hidden sm:block">Ozigi</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="/docs"
              className={`text-sm font-medium transition-colors ${pathname === '/docs' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
            >
              Docs
            </Link>
            <Link
              href="/architecture"
              className={`text-sm font-medium transition-colors ${pathname === '/architecture' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
            >
              Architecture
            </Link>
            <Link
              href="/pricing"
              className={`text-sm font-medium transition-colors ${pathname === '/pricing' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
            >
              Pricing
            </Link>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            {!session ? (
              <>
                <button
                  onClick={onSignIn}
                  className="hidden sm:block px-6 py-2 text-foreground hover:text-primary transition-colors font-medium text-sm"
                >
                  Sign In
                </button>
                <button
                  onClick={onSignIn}
                  className="px-6 py-2 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-accent transition-all text-sm"
                >
                  Get Started
                </button>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <button
                  onClick={onOpenHistory}
                  className="hidden sm:block px-4 py-2 text-muted-foreground hover:text-foreground transition-colors font-medium text-sm"
                >
                  History
                </button>
                <div className="flex items-center gap-2 bg-secondary p-1.5 rounded-full border border-border">
                  <button
                    onClick={() => setIsSettingsOpen(true)}
                    className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent overflow-hidden border-2 border-background hover:border-primary transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background shrink-0"
                  >
                    {avatarUrl ? (
                      <img
                        src={avatarUrl}
                        alt="Avatar"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-primary flex items-center justify-center text-white font-bold text-xs">
                        {session.user.email?.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </button>
                  <button
                    onClick={signOut}
                    className="text-xs font-semibold text-muted-foreground hover:text-foreground px-3 transition-colors hidden sm:block"
                  >
                    Log Out
                  </button>
                </div>
              </div>
            )}
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

"use client";
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import Hero from "../components/Hero";
import Header from "../components/Header";
import Footer from "../components/Footer";
import AuthModal from "../components/AuthModal";

export default function Home() {
  const [session, setSession] = useState<any>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <div className="bg-[#fafafa] font-sans text-slate-900 min-h-screen flex flex-col">
      <Header
        session={session}
        onSignIn={() => setIsAuthModalOpen(true)}
        onOpenHistory={() => {}} // Not needed on landing page
      />

      <main className="pt-28 md:pt-32 pb-8 flex-1">
        {/* We pass a simple redirect to the Hero instead of a state toggle */}
        <Hero onStart={() => (window.location.href = "/dashboard")} />
      </main>

      {isAuthModalOpen && (
        <AuthModal onClose={() => setIsAuthModalOpen(false)} />
      )}
      <Footer />
    </div>
  );
}

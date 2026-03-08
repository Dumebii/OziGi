"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "../lib/supabase";
import Header from "../components/Header";
import Footer from "../components/Footer";
import AuthModal from "../components/AuthModal";

export default function Home() {
  const router = useRouter();
  const [session, setSession] = useState<any>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // ✨ GOAL 2: The Automatic Redirect Listener
// ✨ FIXED: The Smart Redirect Listener
  useEffect(() => {
    // 1. Just load the session so the Header knows to show "Dashboard" instead of "Sign In"
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    // 2. Listen specifically for the SIGN_IN event, ignore initial page loads
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      
      // Only redirect if they actively just logged in!
      if (event === "SIGNED_IN") {
        router.push("/dashboard");
      }
    });

    return () => subscription.unsubscribe();
  }, [router]);

  return (
    <div className="bg-[#fafafa] font-sans text-slate-900 min-h-screen flex flex-col">
      <Header
        session={session}
        onSignIn={() => setIsAuthModalOpen(true)}
        onOpenHistory={() => {}}
      />

      <main className="flex-1">
        {/* --- HERO SECTION --- */}
        <section className="relative overflow-hidden pt-32 md:pt-48 pb-24 md:pb-32 selection:bg-slate-200 selection:text-slate-900 border-b border-slate-200/60">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-40" />

          <div className="relative max-w-5xl mx-auto px-6 text-center z-10">
            <div className="flex justify-center mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200 shadow-sm">
                <span className="flex h-2 w-2 rounded-full bg-slate-800 animate-pulse" />
                <span className="text-xs font-black uppercase tracking-widest text-slate-700">
                  Ozigi v3: The Universal Context Update
                </span>
              </div>
            </div>

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black italic uppercase tracking-tighter text-slate-900 mb-8 leading-[0.9] animate-in fade-in slide-in-from-bottom-6 duration-700 delay-150">
              The Intelligent <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-600 to-slate-900">
                Context Engine.
              </span>
            </h1>

            <p className="max-w-2xl mx-auto text-lg md:text-xl text-slate-600 font-medium leading-relaxed mb-10 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
              Stop wrestling with generic AI tools. Feed Ozigi your raw notes, PDFs, or web links, and let it architect structured, multi-platform campaigns in your exact voice. No prompt engineering required.
            </p>

            {/* ✨ GOAL 3: Professional, Emoji-Free CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-10 duration-700 delay-500">
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="w-full sm:w-auto px-8 py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10 active:scale-95"
              >
                Start Engineering Content
              </button>
              <Link
                href="/docs"
                className="w-full sm:w-auto px-8 py-4 bg-white text-slate-700 border border-slate-200 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-slate-50 transition-all shadow-sm"
              >
                Read the Documentation
              </Link>
            </div>
          </div>
        </section>

        {/* --- ✨ GOAL 4: QUICK DOCS / HOW IT WORKS --- */}
        <section className="py-24 bg-white border-b border-slate-200/60">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-black italic uppercase tracking-tighter text-slate-900 mb-4">
                How The Engine Works
              </h2>
              <p className="text-slate-500 font-medium">Three steps from raw context to polished distribution.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Step 1 */}
              <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-200">
                <div className="w-12 h-12 bg-white rounded-xl border border-slate-200 flex items-center justify-center text-xl font-black text-slate-900 mb-6 shadow-sm">
                  1
                </div>
                <h3 className="text-lg font-black uppercase tracking-widest text-slate-900 mb-3">Ingest Context</h3>
                <p className="text-sm text-slate-600 font-medium leading-relaxed">
                  Paste a URL, dump unformatted meeting transcripts, or upload a PDF. Ozigi extracts the core narrative without you needing to summarize it first.
                </p>
              </div>

              {/* Step 2 */}
              <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-200">
                <div className="w-12 h-12 bg-white rounded-xl border border-slate-200 flex items-center justify-center text-xl font-black text-slate-900 mb-6 shadow-sm">
                  2
                </div>
                <h3 className="text-lg font-black uppercase tracking-widest text-slate-900 mb-3">Apply Voice Persona</h3>
                <p className="text-sm text-slate-600 font-medium leading-relaxed">
                  Select a saved persona from your database. The engine applies strict stylistic constraints, bypassing AI detection to sound exactly like you.
                </p>
              </div>

              {/* Step 3 */}
              <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-200">
                <div className="w-12 h-12 bg-white rounded-xl border border-slate-200 flex items-center justify-center text-xl font-black text-slate-900 mb-6 shadow-sm">
                  3
                </div>
                <h3 className="text-lg font-black uppercase tracking-widest text-slate-900 mb-3">Omnichannel Routing</h3>
                <p className="text-sm text-slate-600 font-medium leading-relaxed">
                  Instantly receive a structured campaign. Push directly to X (Twitter) via Web Intents, format for LinkedIn, or drop straight into your Discord server.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* --- ✨ GOAL 4: VERSATILE USE CASES (BENTO GRID) --- */}
        <section className="py-24 bg-[#fafafa]">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-black italic uppercase tracking-tighter text-slate-900 mb-4">
                Built For Professionals
              </h2>
              <p className="text-slate-500 font-medium">A chameleon engine that adapts to your industry.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Tech / DevRel */}
              <div className="bg-white p-8 md:p-10 rounded-[2rem] border border-slate-200 shadow-sm group hover:border-slate-300 transition-colors">
                <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-2">Use Case 01</h3>
                <h4 className="text-2xl font-black italic uppercase tracking-tighter text-slate-900 mb-4">Technical Writing</h4>
                <p className="text-slate-600 font-medium leading-relaxed">
                  Turn dry API documentation, GitHub release notes, or complex architectural concepts into highly engaging X threads and LinkedIn posts without losing technical accuracy.
                </p>
              </div>

              {/* Marketing / Founders */}
              <div className="bg-white p-8 md:p-10 rounded-[2rem] border border-slate-200 shadow-sm group hover:border-slate-300 transition-colors">
                <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-2">Use Case 02</h3>
                <h4 className="text-2xl font-black italic uppercase tracking-tighter text-slate-900 mb-4">Founders & Marketing</h4>
                <p className="text-slate-600 font-medium leading-relaxed">
                  Convert messy product strategy documents, customer interview transcripts, or rough ideas into polished thought leadership campaigns that drive Go-To-Market outcomes.
                </p>
              </div>

              {/* Educators */}
              <div className="bg-white p-8 md:p-10 rounded-[2rem] border border-slate-200 shadow-sm group hover:border-slate-300 transition-colors">
                <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-2">Use Case 03</h3>
                <h4 className="text-2xl font-black italic uppercase tracking-tighter text-slate-900 mb-4">Digital Educators</h4>
                <p className="text-slate-600 font-medium leading-relaxed">
                  Upload a PDF of your latest course curriculum or workshop slides, and let Ozigi extract the core lessons to build an automated, multi-day promotional campaign.
                </p>
              </div>

              {/* Creators */}
              <div className="bg-white p-8 md:p-10 rounded-[2rem] border border-slate-200 shadow-sm group hover:border-slate-300 transition-colors">
                <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-2">Use Case 04</h3>
                <h4 className="text-2xl font-black italic uppercase tracking-tighter text-slate-900 mb-4">Content Creators</h4>
                <p className="text-slate-600 font-medium leading-relaxed">
                  Paste the URL of your latest YouTube video or podcast episode. The engine will instantly read the transcript and spin out native hooks and posts for your audience.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {isAuthModalOpen && <AuthModal onClose={() => setIsAuthModalOpen(false)} />}
    </div>
  );
}

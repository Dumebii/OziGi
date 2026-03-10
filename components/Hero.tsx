"use client";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "../lib/supabase";
import Header from "../components/Header";
import Footer from "../components/Footer";
import AuthModal from "../components/AuthModal";
import { motion, Variants } from "framer-motion";

export default function Hero() {
  const router = useRouter();
  const [session, setSession] = useState<any>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  
  const prevSession = useRef<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session: initialSession } }) => {
      setSession(initialSession);
      prevSession.current = initialSession;
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, newSession) => {
      setSession(newSession);
      
      if (event === "SIGNED_IN" && !prevSession.current) {
        router.push("/dashboard");
      }
      
      prevSession.current = newSession;
    });

    return () => subscription.unsubscribe();
  }, [router]);

  // --- Animation Variants ---
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } 
  }
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    }
  }
};

  return (
    <div className="bg-[#fafafa] font-sans text-slate-900 min-h-screen flex flex-col">
      <Header
        session={session}
        onSignIn={() => setIsAuthModalOpen(true)}
        onOpenHistory={() => {}}
      />

      <main className="flex-1">
        
{/* --- 1. HERO SECTION (Unified with Framer Motion) --- */}
        <motion.section 
          className="relative overflow-hidden pt-28 pb-10 md:pb-12 flex flex-col items-center justify-center selection:bg-slate-200 selection:text-slate-900 border-b border-slate-200/60"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          {/* Background Elements */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-40" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-slate-400/10 blur-[120px] rounded-full pointer-events-none" />

          <div className="relative max-w-5xl mx-auto px-6 text-center z-10 w-full">
            <motion.div variants={fadeUp} className="flex justify-center mb-5">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200 shadow-sm">
                <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-xs font-black uppercase tracking-widest text-slate-700">
                  New: Multi-platform content campaigns
                </span>
              </div>
            </motion.div>

            <motion.div variants={fadeUp} className="flex flex-col items-center justify-center mb-4 gap-1">
              <div className="overflow-hidden pb-1 px-4">
                <h1 className="text-5xl md:text-7xl lg:text-8xl font-black italic uppercase tracking-tighter text-slate-900 leading-[0.9]">
                  The Intelligent
                </h1>
              </div>
              <div className="overflow-hidden pt-1 pb-2 px-4">
                <span className="inline-block text-5xl md:text-7xl lg:text-8xl font-black italic uppercase tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-slate-600 to-slate-900 leading-[0.9]">
                  Content Engine
                </span>
              </div>
            </motion.div>

            <motion.div variants={fadeUp}>
              <p className="max-w-2xl mx-auto text-lg md:text-xl text-slate-600 font-medium leading-relaxed mb-6">
                Staring at a blinking cursor, trying to figure out what to post? Stop fighting with generic AI tools. Feed Ozigi your raw notes, PDFs, or web links, and let it generate structured, multi-platform content in your OWN voice. No prompt engineering required.
              </p>
            </motion.div>

            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/demo"
                className="w-full sm:w-auto px-8 py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10 hover:shadow-slate-900/20 hover:-translate-y-1 active:translate-y-0 text-center"
              >
                See a Live Example
              </Link>
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="w-full sm:w-auto px-8 py-4 bg-white text-slate-700 border border-slate-200 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-slate-50 transition-all shadow-sm hover:shadow-md hover:-translate-y-1 active:translate-y-0"
              >
                Sign In to Build
              </button>
            </motion.div>

            {/* 🔥 UPDATED: Pulled up significantly by reducing mt-12 to mt-8 */}
            <motion.div variants={fadeUp} className="mt-8 flex justify-center">
               <div className="flex items-center gap-4 bg-white/60 backdrop-blur-md py-3 px-6 rounded-full border border-slate-200 shadow-sm">
                   <div className="flex -space-x-3">
                      <div className="w-10 h-10 rounded-full bg-slate-200 border-2 border-white shadow-sm"></div>
                      <div className="w-10 h-10 rounded-full bg-slate-300 border-2 border-white shadow-sm"></div>
                      <div className="w-10 h-10 rounded-full bg-slate-400 border-2 border-white shadow-sm"></div>
                      <div className="w-10 h-10 rounded-full bg-slate-900 border-2 border-white flex items-center justify-center text-[10px] text-white font-black tracking-tighter shadow-sm">140+</div>
                   </div>
                   <div className="text-left flex flex-col justify-center">
                       <p className="text-sm font-black text-slate-900 tracking-tight leading-none mb-1">140+ Campaigns</p>
                       <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none">Successfully generated</p>
                   </div>
               </div>
            </motion.div>

          </div>
        </motion.section>
        
        {/* --- 2. HOW IT WORKS --- */}
        <section id="how-it-works" className="py-16 md:py-24 bg-white border-b border-slate-200/60 relative">
          <div className="max-w-6xl mx-auto px-6 relative z-10">
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.1 }}
              variants={fadeUp}
              className="text-center mb-16 md:mb-20"
            >
              <h2 className="text-3xl md:text-5xl font-black italic uppercase tracking-tighter text-slate-900 mb-4">
                How The Engine Works
              </h2>
              <p className="text-slate-500 font-medium text-lg">Three steps from raw context to polished Content.</p>
            </motion.div>

            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.1 }}
              variants={staggerContainer}
              className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12"
            >
              <motion.div variants={fadeUp} className="bg-slate-50 p-8 md:p-10 rounded-[2.5rem] border border-slate-200 hover:border-slate-300 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 ease-out group cursor-default">
                <div className="w-14 h-14 bg-white rounded-2xl border border-slate-200 flex items-center justify-center text-xl font-black text-slate-900 mb-8 shadow-sm group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                  1
                </div>
                <h3 className="text-xl font-black uppercase tracking-widest text-slate-900 mb-4">Ingest Context</h3>
                <p className="text-base text-slate-600 font-medium leading-relaxed">
                  Paste a URL, dump unformatted meeting transcripts, or upload a PDF/image. Ozigi extracts the core narrative without you needing to summarize it first.
                </p>
              </motion.div>

              <motion.div variants={fadeUp} className="bg-slate-50 p-8 md:p-10 rounded-[2.5rem] border border-slate-200 hover:border-slate-300 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 ease-out group cursor-default">
                <div className="w-14 h-14 bg-white rounded-2xl border border-slate-200 flex items-center justify-center text-xl font-black text-slate-900 mb-8 shadow-sm group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-300">
                  2
                </div>
                <h3 className="text-xl font-black uppercase tracking-widest text-slate-900 mb-4">Apply Voice Persona</h3>
                <p className="text-base text-slate-600 font-medium leading-relaxed">
                  Create and save custom voice personas. The engine applies strict stylistic constraints to your selected persona, bypassing AI detection to sound exactly like you every time.
                </p>
              </motion.div>

              <motion.div variants={fadeUp} className="bg-slate-50 p-8 md:p-10 rounded-[2.5rem] border border-slate-200 hover:border-slate-300 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 ease-out group cursor-default">
                <div className="w-14 h-14 bg-white rounded-2xl border border-slate-200 flex items-center justify-center text-xl font-black text-slate-900 mb-8 shadow-sm group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                  3
                </div>
                <h3 className="text-xl font-black uppercase tracking-widest text-slate-900 mb-4">Omnichannel Routing</h3>
                <p className="text-base text-slate-600 font-medium leading-relaxed">
                  Instantly receive structured content. Push directly to X (Twitter) via Web Intents, LinkedIn, or drop straight into your Discord server.
                </p>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* --- 3. THE MOAT: CHAOS IN, STRATEGY OUT --- */}
        <section className="py-24 px-6 bg-slate-50 border-b border-slate-200/60 relative">
          <div className="max-w-7xl mx-auto relative z-10">
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.1 }}
              variants={fadeUp}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter text-slate-900 mb-6">
                Chaos In. <span className="text-red-700">Strategy Out.</span>
              </h2>
              <p className="text-lg font-medium text-slate-500 max-w-2xl mx-auto leading-relaxed">
                Most AI tools wrap your insights in corporate buzzwords and predictable emojis. 
                Ozigi uses a strict editorial brief and a "Banned Lexicon" to force a pragmatic, human cadence. 
                See the difference.
              </p>
            </motion.div>

            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.1 }}
              variants={staggerContainer}
              className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch"
            >
              {/* Standard AI Card */}
              <motion.div variants={fadeUp} className="bg-white border-2 border-slate-200 rounded-[2.5rem] p-8 md:p-10 flex flex-col hover:border-slate-300 transition-colors shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-2xl">🤖</span>
                  <h3 className="text-xl font-black uppercase tracking-widest text-slate-400">Standard AI Output</h3>
                </div>
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 flex-1 shadow-inner">
                  <p className="text-slate-500 font-medium leading-relaxed">
                    🚀 <span className="font-bold">Navigating the complex landscape</span> of Cloud infrastructure! 
                    Today I <span className="font-bold">delved</span> into a <span className="font-bold">robust</span> Supabase auth bug. 
                    It is a <span className="font-bold">testament</span> to how <span className="font-bold">crucial</span> OAuth handshakes are in the <span className="font-bold">realm</span> of web dev. 
                    Let's <span className="font-bold">unlock</span> seamless integration together! 👇 #TechLife #Coding #WebDev
                  </p>
                </div>
                <div className="mt-6 flex justify-center">
                   <span className="text-xs font-black uppercase tracking-widest text-red-700 bg-red-50 px-4 py-2 rounded-lg border border-red-100">Fails Anti-AI Detection</span>
                </div>
              </motion.div>

              {/* Ozigi Engine Card */}
              <motion.div variants={fadeUp} className="bg-slate-900 border-2 border-slate-900 rounded-[2.5rem] p-8 md:p-10 flex flex-col shadow-2xl relative overflow-hidden group">
                <div className="absolute -top-20 -right-20 w-64 h-64 bg-red-700/20 blur-3xl rounded-full pointer-events-none group-hover:bg-red-700/30 transition-colors duration-700"></div>
                
                <div className="flex items-center gap-3 mb-6 relative z-10">
                  <span className="text-2xl">⚡</span>
                  <h3 className="text-xl font-black uppercase tracking-widest text-white">The Ozigi Engine</h3>
                </div>
                <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 flex-1 shadow-inner relative z-10">
                  <p className="text-slate-300 font-medium leading-relaxed">
                    Stop debugging your Auth in a silo. I just lost 4 hours to a single missing domain in Google Cloud. <br/><br/>
                    The OAuth handshake doesn't care about your feelings. Check your authorized domains first. Save the headache.
                  </p>
                </div>
                <div className="mt-6 flex justify-center relative z-10">
                   <span className="text-xs font-black uppercase tracking-widest text-green-400 bg-green-400/10 px-4 py-2 rounded-lg border border-green-400/20">Passes as Human 100%</span>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* --- 4. VERSATILE USE CASES --- */}
        <section className="py-24 md:py-32 bg-[#fafafa]">
          <div className="max-w-6xl mx-auto px-6">
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.1 }}
              variants={fadeUp}
              className="text-center mb-16 md:mb-24"
            >
              <h2 className="text-3xl md:text-5xl font-black italic uppercase tracking-tighter text-slate-900 mb-4">
                Built For Professionals
              </h2>
              <p className="text-slate-500 font-medium text-lg">An engine built to adapt to your industry.</p>
            </motion.div>

            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.1 }}
              variants={staggerContainer}
              className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8"
            >
              <motion.div variants={fadeUp} className="bg-white p-8 md:p-12 rounded-[2.5rem] border border-slate-200 shadow-sm hover:shadow-2xl hover:border-slate-300 hover:-translate-y-2 transition-all duration-500 ease-out cursor-default">
                <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-3">Use Case 01</h3>
                <h4 className="text-3xl font-black italic uppercase tracking-tighter text-slate-900 mb-4">Technical Writing</h4>
                <p className="text-lg text-slate-600 font-medium leading-relaxed">
                  Turn dry API documentation, GitHub release notes, or complex architectural concepts into highly engaging X threads and LinkedIn posts without losing technical accuracy.
                </p>
              </motion.div>

              <motion.div variants={fadeUp} className="bg-white p-8 md:p-12 rounded-[2.5rem] border border-slate-200 shadow-sm hover:shadow-2xl hover:border-slate-300 hover:-translate-y-2 transition-all duration-500 ease-out cursor-default">
                <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-3">Use Case 02</h3>
                <h4 className="text-3xl font-black italic uppercase tracking-tighter text-slate-900 mb-4">Founders & Marketing</h4>
                <p className="text-lg text-slate-600 font-medium leading-relaxed">
                  Convert messy product strategy documents, customer interview transcripts, or rough ideas into polished thought leadership campaigns that drive Go-To-Market outcomes.
                </p>
              </motion.div>

              <motion.div variants={fadeUp} className="bg-white p-8 md:p-12 rounded-[2.5rem] border border-slate-200 shadow-sm hover:shadow-2xl hover:border-slate-300 hover:-translate-y-2 transition-all duration-500 ease-out cursor-default">
                <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-3">Use Case 03</h3>
                <h4 className="text-3xl font-black italic uppercase tracking-tighter text-slate-900 mb-4">Digital Educators</h4>
                <p className="text-lg text-slate-600 font-medium leading-relaxed">
                  Upload a PDF of your latest course curriculum or workshop slides, and let Ozigi extract the core lessons to build an automated, multi-day promotional campaign.
                </p>
              </motion.div>

              <motion.div variants={fadeUp} className="bg-white p-8 md:p-12 rounded-[2.5rem] border border-slate-200 shadow-sm hover:shadow-2xl hover:border-slate-300 hover:-translate-y-2 transition-all duration-500 ease-out cursor-default">
                <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-3">Use Case 04</h3>
                <h4 className="text-3xl font-black italic uppercase tracking-tighter text-slate-900 mb-4">Content Creators</h4>
                <p className="text-lg text-slate-600 font-medium leading-relaxed">
                  Paste the URL of your latest YouTube video or podcast episode. The engine will instantly read the transcript and spin out native hooks and posts for your audience.
                </p>
              </motion.div>
            </motion.div>
          </div>
        </section>
      </main>
      {isAuthModalOpen && <AuthModal onClose={() => setIsAuthModalOpen(false)} />}
    </div>
  );
}

"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { toast } from "sonner";
import { Zap, ArrowRight, CheckCircle2 } from "lucide-react";
import Distillery from "../../components/ContextEngine";
import DistributionGrid from "../../components/DistributionGrid";
import GeneratingState from "../../components/GeneratingState";
import AuthModal from "../../components/AuthModal";
import { PLATFORMS } from "@/lib/platforms";

const SAMPLE_CREATOR = `I've been making YouTube videos for 3 years and I keep getting comments saying I sound like I actually know what I'm talking about. Here's what I've learned: consistency beats perfection. I post every Tuesday regardless of whether I think the video is ready. My first 50 videos were bad. My next 50 got better. Now I'm at 40k subscribers and brands are reaching out. The secret isn't the algorithm,it's just not stopping.`;

const SAMPLE_FOUNDER = `We just closed our seed round. $1.2M from 3 angels and a small fund. Took 6 months of conversations. Key things I learned: no one cares about your deck, they care about your conviction. We got rejected 22 times. The 23rd became our lead. The difference? We stopped trying to sound like a startup and started talking like founders who actually understood the problem.`;

const SAMPLE_DEVREL = `Shipped a breaking change today in our SDK. Removed the deprecated v1 auth flow. Migration path: swap initClient() for createSession(), pass your api_key as the first arg instead of inside options. Takes about 5 minutes. We kept v1 running in parallel for 8 months. Today it's gone. If you're still on it, the v2 docs have everything you need.`;

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] },
  },
};

function SignUpGate({
  onSignUp,
  onViewPrevious,
}: {
  onSignUp: () => void;
  onViewPrevious: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.35 }}
      className="bg-white rounded-3xl shadow-2xl border border-slate-100 px-8 py-12 max-w-lg mx-auto text-center"
    >
      <div className="w-14 h-14 bg-brand-red rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
        <Zap className="w-7 h-7 text-white" />
      </div>

      <h2 className="text-brand-navy font-black italic uppercase tracking-tighter text-3xl mb-3 leading-tight">
        That didn't sound like AI.
        <br />
        That's the point.
      </h2>

      <p className="text-slate-500 text-sm leading-relaxed mb-8 max-w-sm mx-auto">
        Create a free account to save your campaign, run unlimited generations, and publish directly to X, LinkedIn, and Discord — always in your voice.
      </p>

      <button
        onClick={onSignUp}
        className="block w-full bg-brand-red hover:bg-[#C5280A] text-white font-black uppercase tracking-widest text-sm px-6 py-4 rounded-xl transition-all active:scale-[0.98] mb-4 shadow-lg shadow-brand-red/20"
      >
        Create Free Account →
      </button>

      <ul className="flex flex-col gap-2 text-xs text-slate-500 mb-6">
        {["5 campaigns free every month", "No credit card required", "Publish directly from your dashboard"].map((item) => (
          <li key={item} className="flex items-center justify-center gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-brand-red shrink-0" />
            {item}
          </li>
        ))}
      </ul>

      <button
        onClick={onViewPrevious}
        className="text-sm text-slate-400 hover:text-slate-700 underline underline-offset-2 transition-colors"
      >
        View your generated campaign
      </button>
    </motion.div>
  );
}

function PostGenerationBanner({ onSignUp }: { onSignUp: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
      className="mt-8 rounded-2xl bg-brand-navy border-l-4 border-brand-red px-8 py-7 flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
    >
      <div>
        <p className="text-white font-black italic uppercase tracking-tighter text-xl md:text-2xl mb-2">
          This is what it sounds like when AI doesn't sound like AI.
        </p>
        <p className="text-slate-400 text-sm leading-relaxed max-w-xl">
          Sign up free to save this campaign, run unlimited generations, and publish to your platforms — always in your voice, never in AI's.
        </p>
      </div>
      <div className="flex flex-col gap-2 shrink-0">
        <button
          onClick={onSignUp}
          className="bg-brand-red hover:bg-[#C5280A] text-white font-black uppercase tracking-widest text-sm px-8 py-4 rounded-xl transition-all active:scale-[0.98] whitespace-nowrap shadow-lg shadow-brand-red/20"
        >
          Sign Up Free →
        </button>
        <p className="text-slate-500 text-xs text-center">No credit card. 5 campaigns free.</p>
      </div>
    </motion.div>
  );
}

export default function FromYouTubePage() {
  const [loading, setLoading] = useState(false);
  const [campaign, setCampaign] = useState<any[]>([]);
  const [emailContent, setEmailContent] = useState<string | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [hasGeneratedOnce, setHasGeneratedOnce] = useState(false);
  const [showGate, setShowGate] = useState(false);
  const [previousOutput, setPreviousOutput] = useState<any>(null);
  const campaignRef = useRef<HTMLDivElement>(null);
  const demoRef = useRef<HTMLDivElement>(null);

  const [inputs, setInputs] = useState({
    url: "",
    text: "",
    fileUrls: [] as string[],
    files: [] as File[],
    platforms: [PLATFORMS.X, PLATFORMS.LINKEDIN, PLATFORMS.DISCORD],
    tweetFormat: "single" as const,
    additionalInfo: "",
    personaId: "default",
  });

  useEffect(() => {
    const stored = localStorage.getItem("ozigi_demo_last_output");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setPreviousOutput(parsed);
        setHasGeneratedOnce(true);
      } catch {
        // ignore
      }
    }
  }, []);

  const handleGenerate = async () => {
    if (hasGeneratedOnce) {
      setShowGate(true);
      return;
    }

    setLoading(true);
    setCampaign([]);
    setEmailContent(null);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Demo-Mode": "true",
        },
        body: JSON.stringify({
          sourceMaterial: {
            url: inputs.url,
            rawText: inputs.text,
            assetUrls: inputs.fileUrls,
          },
          campaignDirectives: {
            platforms: inputs.platforms,
            tweetFormat: inputs.tweetFormat,
            additionalContext: inputs.additionalInfo,
            personaVoice: "Expert Social Media Copywriter",
          },
        }),
      });

      if (response.status === 403) {
        const data = await response.json();
        if (data.error === "demo_limit_reached") {
          setHasGeneratedOnce(true);
          setShowGate(true);
          setLoading(false);
          return;
        }
      }

      if (!response.ok) throw new Error("Generation failed");

      const data = await response.json();
      const cleanJson = data.output.replace(/```json/gi, "").replace(/```/gi, "").trim();
      const finalResponse = JSON.parse(cleanJson);
      const finalCampaign = finalResponse.campaign || [];
      const finalEmail = finalResponse.email || null;

      if (finalCampaign.length > 0) {
        setCampaign(finalCampaign);
        setEmailContent(finalEmail);
        setHasGeneratedOnce(true);

        localStorage.setItem(
          "ozigi_demo_last_output",
          JSON.stringify({ campaign: finalCampaign, email: finalEmail })
        );
        setPreviousOutput({ campaign: finalCampaign, email: finalEmail });

        setTimeout(() => {
          campaignRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 100);
        toast.success("Content generated!");
      }
    } catch {
      toast.error("Generation failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleViewPrevious = () => {
    setShowGate(false);
    if (previousOutput?.campaign) {
      setCampaign(previousOutput.campaign);
      setEmailContent(previousOutput.email || null);
    }
  };

  const scrollToDemo = () => {
    demoRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="min-h-screen bg-brand-offwhite font-sans text-slate-900">
      {/* Minimal header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <img src="/logo.png" alt="Ozigi" className="h-8 w-auto logo-spin" />
            <span className="text-xl font-black text-brand-navy tracking-tighter">Ozigi</span>
          </Link>
          <button
            onClick={() => setIsAuthModalOpen(true)}
            className="bg-brand-red hover:bg-[#C5280A] text-white text-xs font-black uppercase tracking-widest px-5 py-2.5 rounded-xl transition-all active:scale-[0.98]"
          >
            Sign Up Free
          </button>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="pt-16 pb-12 px-6 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-red/6 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-navy/4 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4 pointer-events-none" />

          <div className="relative max-w-3xl mx-auto">
            <motion.h1
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter text-brand-navy leading-[0.9] mb-6"
            >
              Create Content that doesn't
              <br />
              <span className="text-brand-red">sound like AI.</span>
            </motion.h1>

            <motion.p
              initial="hidden"
              animate="visible"
              variants={{ ...fadeUp, visible: { ...fadeUp.visible, transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1], delay: 0.1 } } }}
              className="text-slate-600 font-medium text-lg md:text-xl max-w-xl mx-auto leading-relaxed mb-10"
            >
              You just watched it. Now try it yourself. Paste anything you've written or want to share and see how it sounds when it actually sounds like you.
            </motion.p>

            <motion.div
              initial="hidden"
              animate="visible"
              variants={{ ...fadeUp, visible: { ...fadeUp.visible, transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1], delay: 0.2 } } }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <button
                onClick={scrollToDemo}
                className="bg-brand-red hover:bg-[#C5280A] text-white font-black uppercase tracking-widest text-sm px-8 py-4 rounded-xl transition-all active:scale-[0.98] shadow-xl shadow-brand-red/25 flex items-center gap-2"
              >
                Try it now — it's free <ArrowRight className="w-4 h-4" />
              </button>
              <p className="text-slate-400 text-xs">No account needed · Takes 20 seconds</p>
            </motion.div>
          </div>
        </section>

        {/* Before / After proof strip */}
        <section className="py-10 px-6 bg-white border-y border-slate-200">
          <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-6">
            <div className="rounded-2xl bg-slate-50 border border-red-200/80 p-6">
              <p className="text-[10px] font-black uppercase tracking-widest text-red-500 mb-3">What ChatGPT gives you</p>
              <p className="text-slate-600 text-sm leading-relaxed italic">
                "Here are 5 key strategies to leverage for your content creation journey. In today's digital landscape, authenticity is paramount. By harnessing the power of AI, creators can unlock unprecedented growth opportunities..."
              </p>
              <span className="mt-4 inline-block text-[10px] font-bold text-red-500 bg-red-50 px-3 py-1 rounded-full border border-red-200">Screams AI</span>
            </div>
            <div className="rounded-2xl bg-gradient-to-br from-brand-red/6 to-white border border-brand-red/25 p-6">
              <p className="text-[10px] font-black uppercase tracking-widest text-brand-red mb-3">What Ozigi gives you</p>
              <p className="text-slate-700 text-sm leading-relaxed">
                "Posting consistently for 3 years taught me one thing: the algorithm doesn't care about your production quality. It cares about whether people finish watching. Solve that problem and the numbers follow."
              </p>
              <span className="mt-4 inline-block text-[10px] font-bold text-brand-red bg-brand-red/10 px-3 py-1 rounded-full border border-brand-red/25">Sounds like a real person</span>
            </div>
          </div>
        </section>

        {/* Interactive Demo */}
        <section ref={demoRef} className="py-16 px-6 scroll-mt-16">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-black italic uppercase tracking-tighter text-brand-navy mb-3">
                Your turn. Try it now.
              </h2>
              <p className="text-slate-500 font-medium">
                Paste a URL, your notes, or something you've been meaning to post. See the difference in 20 seconds.
              </p>
            </div>

            {showGate ? (
              <div className="py-4">
                <SignUpGate
                  onSignUp={() => setIsAuthModalOpen(true)}
                  onViewPrevious={handleViewPrevious}
                />
              </div>
            ) : (
              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 md:p-8">
                {!loading && campaign.length === 0 && (
                  <>
                    <Distillery
                      session={null}
                      userPersonas={[]}
                      demoMode
                      inputs={inputs}
                      setInputs={setInputs}
                      loading={loading}
                      onGenerate={handleGenerate}
                    />

                    <div className="flex flex-wrap items-center gap-3 mt-4 pt-4 border-t border-slate-100">
                      <span className="text-xs text-slate-400 font-medium">Try a sample:</span>
                      {[
                        { label: "Creator update", value: SAMPLE_CREATOR },
                        { label: "Founder story", value: SAMPLE_FOUNDER },
                        { label: "DevRel announcement", value: SAMPLE_DEVREL },
                      ].map((s) => (
                        <button
                          key={s.label}
                          onClick={() => setInputs({ ...inputs, text: s.value })}
                          className="text-xs text-slate-500 hover:text-slate-900 border border-slate-200 rounded-full px-3 py-1.5 transition-colors hover:border-slate-400"
                        >
                          {s.label}
                        </button>
                      ))}
                    </div>
                  </>
                )}

                {loading && <GeneratingState />}

                {!loading && campaign.length > 0 && (
                  <div className="animate-in fade-in slide-in-from-bottom-8">
                    <div className="flex justify-between items-center mb-8">
                      <button
                        onClick={() => setIsAuthModalOpen(true)}
                        className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-brand-red transition-colors bg-white px-5 py-3 rounded-xl border border-slate-200 shadow-sm hover:shadow-md active:scale-95"
                      >
                        ← Try something else
                      </button>
                    </div>

                    <div className="scroll-mt-32" ref={campaignRef}>
                      <DistributionGrid
                        campaign={campaign}
                        session={null}
                        selectedPlatforms={inputs.platforms}
                        emailContent={emailContent}
                        setEmailContent={setEmailContent}
                        demoMode
                      />
                    </div>

                    <PostGenerationBanner onSignUp={() => setIsAuthModalOpen(true)} />
                  </div>
                )}
              </div>
            )}
          </div>
        </section>

        {/* Social trust strip */}
        <section className="py-14 px-6 bg-white border-t border-slate-200">
          <div className="max-w-4xl mx-auto">
            <p className="text-center text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-10">
              What people say after trying it
            </p>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  quote: "I've tried every AI writing tool. This is the only one where people don't immediately ask 'did you use ChatGPT for this?'",
                  name: "DevRel @ Series B startup",
                },
                {
                  quote: "I pasted my raw thread notes and got back something that sounded exactly like me on a good day. That's rare.",
                  name: "Founder, 28k followers on X",
                },
                {
                  quote: "My LinkedIn engagement doubled. Same ideas, different engine. The difference is the voice actually sounds human.",
                  name: "Creator, SaaS niche",
                },
              ].map((t, i) => (
                <div key={i} className="bg-slate-50 rounded-2xl p-6 border border-slate-200/80">
                  <p className="text-slate-700 text-sm leading-relaxed mb-4 italic">"{t.quote}"</p>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{t.name}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-20 px-6 bg-brand-navy relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-brand-red/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-brand-red/5 rounded-full blur-3xl pointer-events-none" />
          <div className="relative max-w-2xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter text-white mb-5 leading-tight">
              Stop sounding like
              <br />
              <span className="text-brand-red">everyone else's AI.</span>
            </h2>
            <p className="text-slate-400 font-medium text-lg mb-10 leading-relaxed">
              Create a free account. Start with your own content. Publish to your audience in a voice they'll actually recognise as yours.
            </p>
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="bg-brand-red hover:bg-[#C5280A] text-white font-black uppercase tracking-widest text-sm px-10 py-5 rounded-xl transition-all active:scale-[0.98] shadow-2xl shadow-brand-red/30 inline-flex items-center gap-3"
            >
              Create Your Free Account <ArrowRight className="w-4 h-4" />
            </button>
            <p className="text-slate-500 text-xs mt-4">5 campaigns free · No credit card · Takes 2 minutes to set up</p>
          </div>
        </section>
      </main>

      {/* Minimal footer */}
      <footer className="bg-brand-navy border-t border-white/5 py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2">
            <img src="/logo.png" alt="Ozigi" className="h-6 w-auto logo-spin" />
            <span className="text-base font-black text-white tracking-tighter">Ozigi</span>
          </Link>
          <div className="flex items-center gap-6 text-xs text-slate-500">
            <Link href="/privacy-policy" className="hover:text-slate-300 transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-slate-300 transition-colors">Terms</Link>
            <Link href="/" className="hover:text-slate-300 transition-colors">Back to home</Link>
          </div>
        </div>
      </footer>

      {isAuthModalOpen && <AuthModal onClose={() => setIsAuthModalOpen(false)} />}
    </div>
  );
}

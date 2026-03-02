"use client";
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { CampaignDay } from "../lib/types";
import Hero from "../components/Hero";
import Distillery from "../components/ContextEngine";
import DistributionGrid from "../components/DistributionGrid";
import UpgradeBanner from "../components/GuestModeBanner";
import Footer from "../components/Footer";
import Header from "../components/Header";
// Import History Modal if you moved it, otherwise we'll keep it inline for now

export default function Home() {
  const [session, setSession] = useState<any>(null);
  // Initialize view from localStorage if available
  const [view, setView] = useState<"landing" | "dashboard">("landing");
  const [loading, setLoading] = useState(false);
  const [campaign, setCampaign] = useState<CampaignDay[]>([]);
  const [inputs, setInputs] = useState({ url: "", text: "" });

  // History States restored
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [pastCampaigns, setPastCampaigns] = useState<any[]>([]);

  useEffect(() => {
    // 1. Persistence Check
    const savedView = localStorage.getItem("writerhelper_view") as
      | "landing"
      | "dashboard";
    if (savedView) setView(savedView);

    // 2. Auth Check
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) fetchHistory(session.user.id);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session?.user) fetchHistory(session.user.id);
    });
    return () => subscription.unsubscribe();
  }, []);

  // Update localStorage whenever view changes
  const handleSetView = (newView: "landing" | "dashboard") => {
    setView(newView);
    localStorage.setItem("writerhelper_view", newView);
  };

  const fetchHistory = async (userId: string) => {
    const { data } = await supabase
      .from("campaigns")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    if (data) setPastCampaigns(data);
  };

  const restoreCampaign = (record: any) => {
    setInputs({
      url: record.source_url || "",
      text: record.source_notes || "",
    });
    setCampaign(record.generated_content);
    setIsHistoryOpen(false);
  };

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          urlContext: inputs.url,
          textContext: inputs.text,
          personaVoice: "Expert Content Strategist",
        }),
      });
      const data = await res.json();
      const parsed = JSON.parse(data.output.replace(/```json|```/g, "").trim());
      if (parsed.campaign) {
        setCampaign(parsed.campaign);
        if (session?.user) {
          await supabase.from("campaigns").insert({
            user_id: session.user.id,
            source_url: inputs.url,
            source_notes: inputs.text,
            generated_content: parsed.campaign,
          });
          fetchHistory(session.user.id);
        }
      }
    } catch (err) {
      console.error("Distillation error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#fafafa] font-sans text-slate-900">
      <Header
        session={session}
        view={view}
        setView={handleSetView}
        onOpenHistory={() => setIsHistoryOpen(true)}
      />

      {/* History Modal Logic Restored */}
      {isHistoryOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-[200] flex items-center justify-center p-6">
          <div className="bg-white w-full max-w-2xl rounded-3xl p-8 shadow-2xl border-4 border-slate-900 relative max-h-[80vh] flex flex-col">
            <button
              onClick={() => setIsHistoryOpen(false)}
              className="absolute top-6 right-6 text-slate-400 hover:text-red-600 font-black text-xl"
            >
              ×
            </button>
            <h2 className="text-2xl font-black italic uppercase tracking-tighter mb-6">
              Strategy History
            </h2>
            <div className="overflow-y-auto space-y-4">
              {pastCampaigns.map((record) => (
                <div
                  key={record.id}
                  className="border border-slate-200 p-4 rounded-xl flex justify-between items-center group hover:bg-red-50/20"
                >
                  <div className="truncate pr-4">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      {new Date(record.created_at).toLocaleDateString()}
                    </p>
                    <p className="text-sm font-medium truncate">
                      {record.source_url || "Custom Text Strategy"}
                    </p>
                  </div>
                  <button
                    onClick={() => restoreCampaign(record)}
                    className="bg-slate-900 text-white text-[10px] font-black uppercase px-4 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    Restore
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <main className="flex-1">
        {view === "landing" ? (
          <Hero onStart={() => handleSetView("dashboard")} />
        ) : (
          <div className="max-w-5xl mx-auto px-8">
            {!session && <UpgradeBanner />}
            <h2 className="text-4xl font-black italic uppercase tracking-tighter mb-12">
              Context Engine
            </h2>
            <Distillery
              inputs={inputs}
              setInputs={setInputs}
              onGenerate={handleGenerate}
              loading={loading}
            />
            {campaign.length > 0 && (
              <div className="mt-16">
                <DistributionGrid campaign={campaign} />
              </div>
            )}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

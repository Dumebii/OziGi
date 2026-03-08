"use client";
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

interface SettingsModalProps {
  session: any;
  onClose: () => void;
}

export default function SettingsModal({
  session,
  onClose,
}: SettingsModalProps) {
  // --- Workspace State ---
  const [persona, setPersona] = useState("");
  const [webhook, setWebhook] = useState("");
  const [isSaving, setIsSaving] = useState(false);
const [newPersonaName, setNewPersonaName] = useState("");
  const [newPersonaPrompt, setNewPersonaPrompt] = useState("");
  const [isSavingPersona, setIsSavingPersona] = useState(false);
  // --- OAuth Linking State ---
  const [connections, setConnections] = useState<string[]>([]);
  const [linkLoading, setLinkLoading] = useState<string | null>(null);

  useEffect(() => {
    // 1. Load Workspace Preferences
    if (session?.user?.user_metadata) {
      setPersona(session.user.user_metadata.persona || "");
      setWebhook(session.user.user_metadata.discord_webhook || "");
    }
    // 2. Load Social Connections
    fetchConnections();
  }, [session]);

  const fetchConnections = async () => {
    const { data } = await supabase
      .from("user_tokens")
      .select("provider")
      .eq("user_id", session?.user?.id);

    if (data) {
      setConnections(
        data.map((d) => (d.provider === "twitter" ? "x" : d.provider))
      );
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    const { error } = await supabase.auth.updateUser({
      data: { persona, discord_webhook: webhook },
    });
    setIsSaving(false);
    if (!error) onClose();
    else console.error("Failed to update settings:", error.message);
  };

  const handleLinkAccount = async (provider: "x" | "linkedin_oidc") => {
    setLinkLoading(provider);

    let scopes = undefined;
    if (provider === "x") {
      scopes = "tweet.read tweet.write users.read offline.access";
    } else if (provider === "linkedin_oidc") {
      scopes = "w_member_social openid profile email";
    }

    const { error } = await supabase.auth.linkIdentity({
      provider,
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
        scopes: scopes,
      },
    });

    if (error) {
      console.error(`Error linking ${provider}:`, error);
      alert(`Failed to connect account: ${error.message}`);
      setLinkLoading(null);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-[200] flex items-center justify-center p-4 sm:p-6 animate-in fade-in">
      <div className="bg-white w-full max-w-lg rounded-3xl p-6 sm:p-8 shadow-2xl border-4 border-slate-900 relative max-h-[90vh] overflow-y-auto flex flex-col">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-slate-400 hover:text-red-600 font-black text-xl transition-colors"
          aria-label="Close Settings"
        >
          ×
        </button>

        <h2 className="text-2xl font-black italic uppercase tracking-tighter mb-6 text-slate-900">
          Settings
        </h2>

        <div className="space-y-8">
          {/* --- SECTION 1: WORKSPACE PREFERENCES --- */}
          {/* Custom Personas Section */}
          <div className="p-6 bg-white border border-slate-200 rounded-2xl">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 mb-4">
              🗣️ Create New Persona
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Persona Name</label>
                <input
                  type="text"
                  placeholder="e.g., Snarky DevRel"
                  className="w-full bg-slate-50 rounded-xl px-4 py-3 border border-slate-200 outline-none focus:border-red-500/50 text-sm font-medium text-slate-900"
                  value={newPersonaName}
                  onChange={(e) => setNewPersonaName(e.target.value)}
                />
              </div>
              
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">System Prompt</label>
                <textarea
                  placeholder="You are a developer educator who hates corporate buzzwords..."
                  className="w-full bg-slate-50 rounded-xl px-4 py-3 border border-slate-200 outline-none focus:border-red-500/50 text-sm font-medium min-h-[100px] resize-y text-slate-900"
                  value={newPersonaPrompt}
                  onChange={(e) => setNewPersonaPrompt(e.target.value)}
                />
              </div>

              <button
                disabled={!newPersonaName || !newPersonaPrompt || isSavingPersona}
                onClick={async () => {
                  setIsSavingPersona(true);
                  const { error } = await supabase.from("personas").insert({
                    user_id: session.user.id,
                    name: newPersonaName,
                    prompt: newPersonaPrompt // ⚠️ Change to 'content' if your column is named content!
                  });
                  setIsSavingPersona(false);
                  
                  if (!error) {
                    window.location.reload(); // Instantly reloads the page to fetch your newly saved persona!
                  } else {
                    alert("Failed to save persona: " + error.message);
                  }
                }}
                className="w-full bg-red-700 text-white py-3 rounded-xl font-black uppercase tracking-widest hover:bg-red-800 transition-all disabled:opacity-50 text-xs shadow-lg"
              >
                {isSavingPersona ? "Saving..." : "Save Persona to Database"}
              </button>
            </div>
          </div>
          {/* --- SECTION 2: CONNECTED ACCOUNTS --- */}
          <div className="space-y-4">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-900 border-b-2 border-slate-100 pb-2">
              Social Connections
            </h3>
            <p className="text-[10px] font-medium text-slate-500 uppercase tracking-widest leading-relaxed">
              Link your accounts to enable one-click publishing.
            </p>

            {/* X (Twitter) Connection */}
            <div className="flex items-center justify-between p-4 border border-slate-200 rounded-2xl bg-slate-50 hidden">
              <div className="flex items-center gap-3">
                <svg
                  className="w-4 h-4 text-slate-900"
                  viewBox="0 0 1200 1227"
                  fill="currentColor"
                >
                  <path d="M714.163 519.284L1160.89 0H1055.03L667.137 450.887L357.328 0H0L468.492 681.821L0 1226.37H105.866L515.491 750.218L842.672 1226.37H1200L714.137 519.284H714.163ZM569.165 687.828L521.697 619.934L144.011 79.6944H306.615L611.412 515.685L658.88 583.579L1055.08 1150.3H892.476L569.165 687.854V687.828Z" />
                </svg>
                <span className="font-black uppercase tracking-widest text-xs">
                  X (Twitter)
                </span>
              </div>
              {connections.includes("x") ? (
                <span className="text-[10px] font-black uppercase tracking-widest text-green-700 bg-green-100 px-3 py-1.5 rounded-lg border border-green-200">
                  Connected
                </span>
              ) : (
                <button
                  onClick={() => handleLinkAccount("x")}
                  disabled={linkLoading !== null}
                  className="text-[10px] font-black uppercase tracking-widest text-white bg-black hover:bg-slate-800 px-4 py-2 rounded-lg transition-all shadow-sm"
                >
                  {linkLoading === "x" ? "Linking..." : "Connect"}
                </button>
              )}
            </div>

            {/* LinkedIn Connection */}
            <div className="flex items-center justify-between p-4 border border-slate-200 rounded-2xl bg-slate-50">
              <div className="flex items-center gap-3">
                <svg
                  className="w-4 h-4 text-[#0A66C2]"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
                <span className="font-black uppercase tracking-widest text-xs">
                  LinkedIn
                </span>
              </div>
              {connections.includes("linkedin_oidc") ? (
                <span className="text-[10px] font-black uppercase tracking-widest text-green-700 bg-green-100 px-3 py-1.5 rounded-lg border border-green-200">
                  Connected
                </span>
              ) : (
                <button
                  onClick={() => handleLinkAccount("linkedin_oidc")}
                  disabled={linkLoading !== null}
                  className="text-[10px] font-black uppercase tracking-widest text-white bg-[#0A66C2] hover:bg-[#004182] px-4 py-2 rounded-lg transition-all shadow-sm"
                >
                  {linkLoading === "linkedin_oidc" ? "Linking..." : "Connect"}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

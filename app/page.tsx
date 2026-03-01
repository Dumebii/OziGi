"use client";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

// --- Interfaces for Type Safety ---
interface CampaignDay {
  day: number;
  x: string;
  linkedin: string;
  discord: string;
  [key: string]: string | number;
}

interface PostCardProps {
  platform: string;
  content: string;
  day: number;
}

// --- Sub-Component: Social Post Card (Lunar Crimson Theme) ---
const PostCard = ({ platform, content, day }: PostCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(content);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isPosting, setIsPosting] = useState(false);

  const charLimit = 250;
  const isLong = editedContent.length > charLimit;
  const displayContent =
    isExpanded || isEditing
      ? editedContent
      : editedContent.substring(0, charLimit) + "...";

  const handlePost = async () => {
    if (platform.toLowerCase() !== "discord") return;
    setIsPosting(true);
    try {
      const res = await fetch("/api/post-discord", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: editedContent }),
      });
      if (res.ok) alert("✅ Shared to Discord!");
    } catch (err) {
      alert("❌ Post failed. Check connection.");
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <div className="bg-white border-l-4 border-red-700 rounded-r-2xl p-6 mb-6 shadow-sm hover:shadow-md transition-all border-y border-r border-slate-200">
      <div className="flex justify-between items-center mb-4">
        <span className="bg-red-50 text-red-700 text-[10px] font-black px-2.5 py-1 rounded-md uppercase tracking-widest">
          Day {day}
        </span>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="text-slate-400 hover:text-red-600 text-[11px] font-black uppercase transition-colors tracking-widest"
        >
          {isEditing ? "💾 Save" : "✏️ Edit"}
        </button>
      </div>

      <div className="mt-2 min-h-[100px]">
        {isEditing ? (
          <textarea
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            className="w-full min-h-[180px] p-4 text-sm text-slate-900 border border-red-100 rounded-xl outline-none bg-red-50/30 font-mono leading-relaxed focus:ring-2 focus:ring-red-500/20"
          />
        ) : (
          <div className="prose prose-slate prose-sm max-w-none text-slate-900 font-medium leading-relaxed">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {displayContent}
            </ReactMarkdown>
          </div>
        )}
      </div>

      {!isEditing && isLong && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-red-700 text-[11px] mt-4 font-black uppercase tracking-tighter hover:underline"
        >
          {isExpanded ? "↑ Show Less" : "↓ Read More"}
        </button>
      )}

      <div className="mt-6 pt-5 border-t border-slate-100 flex gap-3">
        <button
          onClick={handlePost}
          disabled={isPosting || isEditing}
          className="flex-1 bg-red-700 text-white text-[11px] font-black py-3.5 rounded-xl active:scale-95 disabled:bg-slate-200 disabled:text-slate-400 transition-all uppercase tracking-[0.2em] shadow-lg shadow-red-900/10"
        >
          {isPosting ? "Processing..." : `Deploy to ${platform}`}
        </button>
        <button
          onClick={() => {
            navigator.clipboard.writeText(editedContent);
            alert("Copied to clipboard!");
          }}
          className="px-4 py-3.5 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors text-slate-400 hover:text-red-600"
          title="Copy to clipboard"
        >
          📋
        </button>
      </div>
    </div>
  );
};

// --- Main Page Component ---
export default function Home() {
  const [url, setUrl] = useState("");
  const [campaign, setCampaign] = useState<CampaignDay[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const generateCampaign = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        body: JSON.stringify({ articleUrl: url }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Server Error");
      const cleanJson = data.output.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(cleanJson);
      if (parsed.campaign) setCampaign(parsed.campaign);
    } catch (err: any) {
      setError(err.message || "Failed to orchestrate strategy.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] font-sans text-slate-900 selection:bg-red-100 selection:text-red-900">
      {/* Visual Header: Moon-Nib Icon + Lunar Crimson Branding */}
      <header className="relative bg-slate-950 py-24 px-6 text-center overflow-hidden">
        {/* Decorative Lunar Glow */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-red-900/10 rounded-full blur-[150px]"></div>
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-slate-900/40 rounded-full blur-[100px]"></div>

        <div className="relative z-10 flex flex-col items-center">
          {/* Professional Mark: Moon-Nib SVG */}
          <div className="mb-8 bg-red-700 p-5 rounded-3xl shadow-2xl shadow-red-950/40 group hover:rotate-6 transition-transform duration-500 cursor-pointer">
            <svg
              width="42"
              height="42"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12 2L19 12L12 22L5 12L12 2Z" fill="white" />
              <circle
                cx="16"
                cy="8"
                r="4"
                fill="#7f1d1d"
                className="group-hover:fill-red-900 transition-colors"
              />
            </svg>
          </div>

          <h1 className="text-5xl font-black tracking-tighter text-white uppercase italic">
            Writer<span className="text-red-600">Helper</span>
          </h1>
          <p className="text-slate-500 mt-4 text-[10px] font-black uppercase tracking-[0.5em] flex items-center gap-4">
            <span className="w-12 h-[1px] bg-slate-800"></span>
            Agentic Orchestration 🌙
            <span className="w-12 h-[1px] bg-slate-800"></span>
          </p>

          <div className="mt-14 max-w-2xl mx-auto w-full flex gap-0 p-1.5 bg-white rounded-3xl shadow-2xl border-[6px] border-slate-900 focus-within:border-red-900/30 transition-colors">
            <input
              className="flex-1 px-6 py-4 outline-none text-slate-900 text-lg font-bold placeholder:text-slate-300 bg-transparent"
              placeholder="Source article URL..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
            <button
              onClick={generateCampaign}
              disabled={loading || !url}
              className="bg-red-700 text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-red-800 transition-all active:scale-95 disabled:bg-slate-200 disabled:text-slate-400"
            >
              {loading ? "Reasoning..." : "Architect"}
            </button>
          </div>
          {error && (
            <p className="mt-8 text-red-400 text-[10px] font-black uppercase bg-red-950/40 py-2 px-6 rounded-full inline-block border border-red-900/50">
              {error}
            </p>
          )}
        </div>
      </header>

      {/* Main Campaign Grid */}
      <main className="max-w-7xl mx-auto p-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {["X", "LinkedIn", "Discord"].map((platform) => (
            <div key={platform}>
              <div className="flex items-center gap-3 mb-10 border-b-2 border-slate-100 pb-4">
                <span className="text-red-600 text-xl font-black italic">
                  ✦
                </span>
                <h2 className="text-sm font-black uppercase tracking-[0.25em] text-slate-800">
                  {platform} Pipeline
                </h2>
              </div>
              <div className="space-y-8">
                {campaign.map((dayData, idx) => (
                  <PostCard
                    key={idx}
                    day={dayData.day}
                    platform={platform}
                    content={String(dayData[platform.toLowerCase()] || "")}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Empty State / Nature Background Hint */}
        {!campaign.length && !loading && (
          <div className="text-center py-40 border-2 border-dashed border-slate-200 rounded-[40px] bg-white/40">
            <p className="text-slate-300 font-bold uppercase tracking-[0.3em] text-[10px]">
              Ready to ingest research data 🌿
            </p>
          </div>
        )}
      </main>

      {/* Subtle Lunar Footer */}
      <footer className="py-20 text-center opacity-20">
        <div className="w-1 h-1 bg-red-600 rounded-full mx-auto mb-4"></div>
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-900">
          Lunar Crimson v2.1.0
        </p>
      </footer>
    </div>
  );
}

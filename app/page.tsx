"use client";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

// 1. Define Types for Architecture
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

// --- Sub-Component: Social Post Card ---
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
    if (platform.toLowerCase() !== "discord") {
      alert(`${platform} integration is in the v2 roadmap!`);
      return;
    }
    setIsPosting(true);
    try {
      const res = await fetch("/api/post-discord", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: editedContent }),
      });
      if (res.ok) alert("✅ Shared to Discord!");
    } catch (err) {
      alert("❌ Post failed.");
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 mb-5 shadow-sm transition-all">
      <div className="flex justify-between items-center mb-3">
        <span className="bg-blue-50 text-blue-700 text-[10px] font-bold px-2 py-1 rounded-full uppercase">
          Day {day}
        </span>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="text-slate-400 hover:text-blue-600 text-xs font-semibold uppercase"
        >
          {isEditing ? "💾 Save" : "✏️ Edit"}
        </button>
      </div>
      <div className="mt-2 min-h-[100px]">
        {isEditing ? (
          <textarea
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            className="w-full min-h-[150px] p-3 text-sm text-slate-700 border border-blue-100 rounded-lg outline-none bg-slate-50 font-mono"
          />
        ) : (
          <div className="prose prose-slate prose-sm max-w-none text-slate-700">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {displayContent}
            </ReactMarkdown>
          </div>
        )}
      </div>
      {!isEditing && isLong && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-blue-600 text-[11px] mt-3 font-bold uppercase"
        >
          {isExpanded ? "↑ Less" : "↓ More"}
        </button>
      )}
      <div className="mt-5 pt-4 border-t border-slate-100 flex gap-2">
        <button
          onClick={handlePost}
          disabled={isPosting || isEditing}
          className="flex-1 bg-slate-900 text-white text-xs font-bold py-2.5 rounded-lg active:scale-95"
        >
          {isPosting ? "Sending..." : `Push to ${platform}`}
        </button>
      </div>
    </div>
  );
};

// --- Main Page Component ---
export default function Home() {
  const [url, setUrl] = useState("");
  // FIX: Typed the state to avoid 'never' error
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

      if (!res.ok) throw new Error(data.error || "Server Crash");

      const cleanJson = data.output.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(cleanJson);

      if (parsed.campaign) setCampaign(parsed.campaign);
    } catch (err: any) {
      setError(err.message || "Failed to parse AI response.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <header className="max-w-2xl mx-auto mb-12 text-center">
        <h1 className="text-3xl font-black uppercase">Agentic Scheduler v2</h1>
        <div className="mt-6 flex gap-2">
          <input
            className="flex-1 px-4 py-3 border border-slate-300 rounded-xl outline-none"
            placeholder="dev.to URL..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <button
            onClick={generateCampaign}
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold"
          >
            {loading ? "..." : "Generate"}
          </button>
        </div>
        {error && (
          <p className="mt-4 text-red-500 text-xs font-bold uppercase">
            {error}
          </p>
        )}
      </header>

      <main className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {["X", "LinkedIn", "Discord"].map((platform) => (
          <div key={platform}>
            <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6">
              {platform} Pipeline
            </h2>
            {campaign.map((dayData, idx) => (
              <PostCard
                key={idx}
                day={dayData.day}
                platform={platform}
                content={String(dayData[platform.toLowerCase()] || "")}
              />
            ))}
          </div>
        ))}
      </main>
    </div>
  );
}

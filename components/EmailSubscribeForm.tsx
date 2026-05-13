"use client";
import { useState } from "react";

export default function EmailSubscribeForm({ compact = false }: { compact?: boolean }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function subscribe(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");

    const res = await fetch("/api/newsletter/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email.trim().toLowerCase() }),
    });

    setStatus(res.ok ? "success" : "error");
  }

  if (status === "success") {
    return (
      <div className="text-center py-4">
        <p className="text-2xl mb-2">✓</p>
        <p className="font-black uppercase tracking-tight text-slate-900">You&apos;re in!</p>
        <p className="text-sm text-slate-500 mt-1">First email on its way.</p>
      </div>
    );
  }

  if (compact) {
    return (
      <form onSubmit={subscribe} className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          required
          className="flex-1 px-3 py-2 text-sm rounded-lg border border-slate-200 bg-white focus:outline-none focus:border-[#E8320A] transition-colors"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest text-white disabled:opacity-60 transition-all active:scale-95"
          style={{ background: "linear-gradient(135deg, #E8320A 0%, #c52000 100%)" }}
        >
          {status === "loading" ? "…" : "Subscribe"}
        </button>
      </form>
    );
  }

  return (
    <div className="rounded-2xl bg-slate-950 px-8 py-10 text-center">
      <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#E8320A] mb-3">
        Newsletter
      </p>
      <h2 className="text-2xl md:text-3xl font-black italic uppercase tracking-tighter text-white leading-tight mb-3">
        Founder&apos;s Thoughts
      </h2>
      <p className="text-sm text-slate-400 mb-6 max-w-sm mx-auto">
        Once or twice a week — what we&apos;re building, content observations, and personal thoughts from the founder.
      </p>
      <form onSubmit={subscribe} className="flex flex-col sm:flex-row gap-3 max-w-sm mx-auto">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          required
          className="flex-1 px-4 py-3 rounded-xl text-sm bg-slate-800 border border-slate-700 focus:border-[#E8320A] focus:outline-none text-white placeholder:text-slate-500 transition-colors"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest text-white disabled:opacity-60 flex-shrink-0 transition-all active:scale-95"
          style={{ background: "linear-gradient(135deg, #E8320A 0%, #c52000 100%)" }}
        >
          {status === "loading" ? "…" : "Subscribe →"}
        </button>
      </form>
      {status === "error" && (
        <p className="text-xs mt-3 text-[#E8320A]">Something went wrong. Try again.</p>
      )}
      <p className="text-[10px] text-slate-600 mt-3">No spam. Unsubscribe anytime.</p>
    </div>
  );
}

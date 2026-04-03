"use client";
import { useState, useEffect } from "react";

const LOADING_MESSAGES = [
  "Preparing your workspace...",
  "Loading your campaigns...",
  "Syncing your personas...",
  "Fetching your stats...",
  "Almost ready...",
];

export default function DashboardLoading() {
  const [messageIndex, setMessageIndex] = useState(0);
  const [showRefreshPrompt, setShowRefreshPrompt] = useState(false);
  const [dots, setDots] = useState("");

  // Cycle through messages
  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % LOADING_MESSAGES.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  // Animated dots
  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "" : prev + "."));
    }, 400);
    return () => clearInterval(interval);
  }, []);

  // Show refresh prompt after 15 seconds
  useEffect(() => {
    const timeout = setTimeout(() => {
      setShowRefreshPrompt(true);
    }, 15000);
    return () => clearTimeout(timeout);
  }, []);

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <div className="text-center px-6 max-w-md">
        {/* Logo */}
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <img 
              src="/logo.png" 
              alt="Ozigi" 
              className="w-16 h-16 animate-pulse"
            />
            {/* Glow effect */}
            <div className="absolute inset-0 bg-brand-red/20 blur-xl rounded-full animate-pulse" />
          </div>
        </div>

        {/* Brand name */}
        <h1 className="text-2xl font-black italic uppercase tracking-tighter text-slate-900 mb-2">
          Ozigi
        </h1>

        {/* Loading indicator */}
        <div className="flex justify-center gap-1.5 mb-6">
          <div className="w-2 h-2 bg-brand-red rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
          <div className="w-2 h-2 bg-brand-red rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
          <div className="w-2 h-2 bg-brand-red rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
        </div>

        {/* Status message */}
        <p 
          key={messageIndex}
          className="text-sm font-medium text-slate-600 h-5 animate-in fade-in duration-300"
        >
          {LOADING_MESSAGES[messageIndex]}{dots}
        </p>

        {/* Refresh prompt */}
        {showRefreshPrompt && (
          <div className="mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <p className="text-xs text-slate-500 mb-3">
              Taking longer than expected?
            </p>
            <button
              onClick={handleRefresh}
              className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-slate-800 transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh Page
            </button>
          </div>
        )}

        {/* Subtle footer */}
        <p className="mt-12 text-[10px] text-slate-400 uppercase tracking-widest">
          The Content Engine
        </p>
      </div>
    </div>
  );
}

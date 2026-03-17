"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface TrialGateModalProps {
  isOpen: boolean;
  onClose: () => void; // only called after downgrade
}

export default function TrialGateModal({ isOpen, onClose }: TrialGateModalProps) {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [downgrading, setDowngrading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchStats();
    }
  }, [isOpen]);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/user/stats");
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (error) {
      console.error("Failed to fetch stats", error);
    } finally {
      setLoading(false);
    }
  };

  const handleContinueFree = async () => {
    setDowngrading(true);
    try {
      const res = await fetch("/api/user/downgrade", { method: "POST" });
      if (res.ok) {
        onClose(); // close modal, now on free tier
        // Optionally refresh the page or update UI
        window.location.reload();
      } else {
        console.error("Failed to downgrade");
      }
    } catch (error) {
      console.error("Error downgrading", error);
    } finally {
      setDowngrading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-4"
        onClick={(e) => e.stopPropagation()} // prevent closing on backdrop click
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border-4 border-slate-900"
        >
          {/* Header - dark navy */}
          <div className="bg-slate-900 p-6 text-white">
            <h2 className="text-2xl font-black italic uppercase tracking-tighter">
              {stats?.isTrialExpired ? "Your Pro trial has ended" : "Generation limit reached"}
            </h2>
            <p className="text-slate-300 mt-2 text-sm font-medium">
              Your work is saved. Pick a plan to keep going.
            </p>
          </div>

          {/* Stats row */}
          <div className="p-6 border-b border-slate-100">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-black text-slate-900">
                  {loading ? "—" : stats?.stats.campaignsGenerated}
                </div>
                <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Campaigns
                </div>
              </div>
              <div>
                <div className="text-2xl font-black text-slate-900">
                  {loading ? "—" : stats?.stats.personasSaved}
                </div>
                <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Personas
                </div>
              </div>
              <div>
                <div className="text-2xl font-black text-slate-900">
                  {loading ? "—" : stats?.stats.postsPublished}
                </div>
                <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Posts
                </div>
              </div>
            </div>
          </div>

          {/* Feature comparison */}
          <div className="p-6 space-y-4">
            <div className="flex items-start gap-3">
              <span className="text-red-500 text-lg">🔴</span>
              <div>
                <p className="font-bold text-slate-900">Without a plan</p>
                <p className="text-xs text-slate-500">
                  New campaign generation locked • LinkedIn publishing locked • Image generation locked
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-green-500 text-lg">🟢</span>
              <div>
                <p className="font-bold text-slate-900">Always kept</p>
                <p className="text-xs text-slate-500">
                  Your saved personas • Your campaign history • Your account and data
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="p-6 bg-slate-50 space-y-3">
            <a
              href="/pricing"
              className="block w-full bg-slate-900 text-white text-center py-4 rounded-xl font-black uppercase tracking-widest text-sm hover:bg-slate-800 transition-colors"
            >
              Upgrade to Pro — $12/month →
            </a>
            <button
              onClick={handleContinueFree}
              disabled={downgrading}
              className="w-full text-sm text-slate-500 underline underline-offset-4 hover:text-slate-800 disabled:opacity-50 font-medium"
            >
              {downgrading ? "Downgrading..." : "Continue with 5 free generations/month instead"}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}